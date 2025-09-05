import { NextRequest, NextResponse } from "next/server";
import { sync as ed25519 } from "@noble/ed25519";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { deductCredits, updateTransformationStats } from "@/app/lib/credits";

const JWKS_URL = "https://rest.alpha.fal.ai/.well-known/jwks.json";
let jwks: any[] | null = null;
let jwksTs = 0;

async function fetchJwks() {
    const now = Date.now();
    if (!jwks || now - jwksTs > 24 * 60 * 60 * 1000) {
        const r = await fetch(JWKS_URL, { cache: "no-store" });
        if (!r.ok) throw new Error("JWKS fetch failed");
        const j = await r.json();
        jwks = j.keys || [];
        jwksTs = now;
    }
    return jwks!;
}

async function verify(req: NextRequest, raw: Buffer) {
    const id = req.headers.get("x-fal-webhook-request-id");
    const uid = req.headers.get("x-fal-webhook-user-id");
    const ts = req.headers.get("x-fal-webhook-timestamp");
    const sig = req.headers.get("x-fal-webhook-signature");
    
    if (!id || !uid || !ts || !sig) return false;

    // freshness ±5 minutes
    const now = Math.floor(Date.now() / 1000);
    const t = parseInt(ts, 10);
    if (!Number.isFinite(t) || Math.abs(now - t) > 300) return false;

    // message = id + "\n" + uid + "\n" + ts + "\n" + sha256(body)
    const hash = await crypto.subtle.digest("SHA-256", raw);
    const hashHex = Buffer.from(hash).toString("hex");
    const msg = new TextEncoder().encode(`${id}\n${uid}\n${ts}\n${hashHex}`);

    const sigBytes = Buffer.from(sig, "hex");
    const keys = await fetchJwks();
    for (const k of keys) {
        try {
            const x = k?.x;
            if (!x) continue;
            const pub = Buffer.from(x.replace(/-/g, "+").replace(/_/g, "/"), "base64");
            if (ed25519.verify(sigBytes, msg, pub)) return true;
        } catch {}
    }
    return false;
}

// In-memory job storage (same as transform route)
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const jobId = url.searchParams.get("jobId") || "unknown";

        const raw = Buffer.from(await req.arrayBuffer());
        
        // Verify webhook signature
        const ok = await verify(req, raw);
        if (!ok) {
            console.error('Webhook signature verification failed');
            return NextResponse.json({ error: "invalid signature" }, { status: 401 });
        }

        const body = JSON.parse(raw.toString("utf-8"));
        console.log('Webhook received:', { jobId, status: body.status, requestId: body.request_id });

        // Get job data
        const jobData = jobs.get(jobId);
        if (!jobData) {
            console.error('Job not found:', jobId);
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        const { transformationId, userId } = jobData;

        if (body.status === "OK") {
            const images = body?.payload?.images ?? [];
            const imageUrls = images.map((img: any) => img.url);
            
            // Update job status
            jobs.set(jobId, { 
                status: "SUCCEEDED", 
                requestId: body.request_id, 
                images: images,
                transformationId,
                userId
            });

            // Update transformation in Firestore
            if (transformationId) {
                const transformationRef = doc(db, 'transformations', transformationId);
                await updateDoc(transformationRef, {
                    status: 'completed',
                    transformedImageUrls: imageUrls,
                    apiResponse: body.payload,
                    completedAt: serverTimestamp(),
                    processingTime: Date.now() - (jobData.startTime || Date.now()),
                });

                // Deduct credits and update user stats
                if (userId) {
                    await deductCredits(userId, 1);
                    await updateTransformationStats(userId);
                }
            }

        } else {
            // Handle failure
            const errorMessage = body?.error || body?.payload || "Unknown error";
            
            jobs.set(jobId, { 
                status: "FAILED", 
                requestId: body.request_id, 
                error: errorMessage,
                transformationId,
                userId
            });

            // Update transformation in Firestore
            if (transformationId) {
                const transformationRef = doc(db, 'transformations', transformationId);
                await updateDoc(transformationRef, {
                    status: 'failed',
                    errorMessage: errorMessage,
                    failedAt: serverTimestamp(),
                });
            }
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
