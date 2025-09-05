# fal.ai Nano Banana – End‑to‑End Setup Guide (Next.js + n8n)

This guide shows you how to integrate **Nano Banana** (Gemini 2.5 Flash Image) via `fal.ai` for your e‑commerce mockup generator: upload → transform → return Top‑3 images with webhooks, queues, and production‑grade patterns.

---

## 1. What you’ll build

* **Public UI (Next.js)** where a seller uploads a product/model photo and clicks "Generate".
* **Backend route** that sends a job to `fal`’s queue endpoint with a `webhookUrl`.
* **Webhook route** that `fal` calls when the job completes → you persist the 3 image URLs.
* **Status route** your UI polls to display progress and final images.

**Key benefits**: Jobs beyond your concurrency limit queue automatically on fal’s side. Webhooks let you notify the user immediately when results are ready.

---

## 2. Prerequisites

* A `fal.ai` account and `FAL_KEY`.
* Next.js (App Router) + TypeScript + Tailwind (recommended).
* A persistent store (Redis, Postgres, Mongo, Supabase) for jobs/results.
* Optional: n8n for orchestration and retries.

---

## 3. Environment variables

Create a `.env` file for server-only variables:

```env
FAL_KEY=your_fal_api_key
NEXT_PUBLIC_BASE_URL=[https://your-domain.com](https://your-domain.com)

# Optional: storage / queues
REDIS_URL=...
DATABASE_URL=...
Keep FAL_KEY server‑side. Never expose it in client code.

4. Install Dependencies
Bash

# fal SDK (easiest path)
npm i @fal-ai/client

# Optional: verification helper for webhook signatures
npm i @noble/ed25519

# If you use Redis/Upstash, install their client
npm i @upstash/redis
5. Core Architecture
Endpoints you will implement
POST /api/generate – Accepts upload + prompt. Submits to fal queue with webhookUrl. Returns { jobId }.

POST /api/fal/webhook – Receives fal callback, verifies signature, stores image URLs.

GET /api/jobs/:jobId – Returns { status, images[] } for the UI.

Flow
User Upload → /api/generate → fal.queue (queued) → fal runs model → fal → /api/fal/webhook → DB → UI polls /api/jobs/:jobId → Show 3 images

6. Choosing the Right Model Endpoints
Text → Image: fal-ai/nano-banana
Use when you want to create images from a description (no input image).

Image → Image (edit / multi‑image fusion): fal-ai/nano-banana/edit
Use for try‑on and background transforms (you pass image_urls).

For your T‑shirt mockups, start with nano-banana/edit.

7. Minimal Request Schemas (Safe Defaults)
A) Text → Image
JSON

{
  "prompt": "studio white catalog photo, soft shadows, ecommerce, high key",
  "num_images": 3,
  "output_format": "png"
}
B) Image → Image (Edit)
JSON

{
  "prompt": "studio white catalog photo, soft shadows, ecommerce, high key",
  "image_urls": ["https://your-public-url/input.png"],
  "num_images": 3,
  "output_format": "png"
}
Notes:

num_images: 3 returns Top‑3 in one job (one concurrency slot, 3× image cost).

You can pass multiple image_urls for fusion/composition.

8. Next.js – Server Integration (App Router)
8.1 Configure the fal client
Create lib/fal.ts:

TypeScript

import { fal } from "@fal-ai/client";

if (!process.env.FAL_KEY) throw new Error("FAL_KEY missing");

fal.config({ credentials: process.env.FAL_KEY });

export { fal };
8.2 Submit job with webhook
app/api/generate/route.ts

TypeScript

import { NextRequest, NextResponse } from "next/server";
import { fal } from "@/lib/fal";
import crypto from "node:crypto";

// Replace with Redis/DB in production
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const prompt = String(form.get("prompt") || "studio white background, catalog-ready");
  const image = form.get("image");

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "image file required" }, { status: 400 });
  }

  // Upload file to fal storage to get a temporary URL
  const imageUrl = await fal.storage.upload(image);

  const jobId = crypto.randomUUID();
  jobs.set(jobId, { status: "QUEUED" });

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/fal/webhook?jobId=${jobId}`;

  const { request_id } = await fal.queue.submit("fal-ai/nano-banana/edit", {
    input: {
      prompt,
      image_urls: [imageUrl],
      num_images: 3,
      output_format: "png",
    },
    webhookUrl,
  });

  jobs.set(jobId, { status: "QUEUED", requestId: request_id });
  return NextResponse.json({ jobId, requestId: request_id });
}
8.3 Webhook receiver + signature verification
app/api/fal/webhook/route.ts

TypeScript

import { NextRequest, NextResponse } from "next/server";
import { sync as ed25519 } from "@noble/ed25519";

const JWKS_URL = "[https://rest.alpha.fal.ai/.well-known/jwks.json](https://rest.alpha.fal.ai/.well-known/jwks.json)";
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

const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId") || "unknown";

  const raw = Buffer.from(await req.arrayBuffer());
  const ok = await verify(req, raw);
  if (!ok) return NextResponse.json({ error: "invalid signature" }, { status: 401 });

  const body = JSON.parse(raw.toString("utf-8"));

  if (body.status === "OK") {
    const images = body?.payload?.images ?? [];
    jobs.set(jobId, { status: "SUCCEEDED", requestId: body.request_id, images });
  } else {
    jobs.set(jobId, { status: "FAILED", requestId: body.request_id, error: body?.error || body?.payload });
  }
  return NextResponse.json({ ok: true });
}
8.4 Status endpoint for the UI
app/api/jobs/[jobId]/route.ts

TypeScript

import { NextRequest, NextResponse } from "next/server";

const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function GET(_: NextRequest, { params }: { params: { jobId: string } }) {
  const data = jobs.get(params.jobId);
  if (!data) return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(data);
}
9. Frontend Usage (Outline)
Submit FormData with image + prompt to /api/generate.

Receive { jobId }.

Poll GET /api/jobs/:jobId every 1–2s via SWR/React Query until status === "SUCCEEDED".

Render the 3 image cards; provide buttons: Use, Download, Compare.

Optional: Show a progress UI with states QUEUED → RUNNING → SUCCEEDED/FAILED (you can infer RUNNING if not queued and not yet succeeded within N seconds).

10. Raw HTTP Alternative (No SDK)
Submit (queue + webhook):

HTTP

POST [https://queue.fal.run/fal-ai/nano-banana/edit?fal_webhook=https://your-domain.com/api/fal/webhook%3FjobId%3D123](https://queue.fal.run/fal-ai/nano-banana/edit?fal_webhook=https://your-domain.com/api/fal/webhook%3FjobId%3D123)
Authorization: Key <FAL_KEY>
Content-Type: application/json

{
  "prompt": "studio white catalog photo, soft shadows, ecommerce",
  "image_urls": ["https://.../input.png"],
  "num_images": 3,
  "output_format": "png"
}
Response: { "request_id": "...", "gateway_request_id": "..." }

Webhook: fal POSTs your URL with { status: "OK", payload: { images: [{ url }, ...] } }.

11. Webhook Details & Reliability
Include jobId in your webhook query string to correlate.

fal sends signature headers; verify using JWKS (see code above).

fal retries webhooks multiple times if your endpoint is down (exponential backoff). Ensure your route is idempotent.

Return 200 quickly; do heavy work (DB writes, S3 copies) asynchronously.

Idempotency tip: Use request_id as a unique key to avoid double‑writes on retries.

12. Concurrency, Queuing & Throughput
Default concurrency is roughly 10 simultaneous jobs per account/key. Extra requests queue automatically on fal.

Your UI should surface queue position (optional) and show a non‑blocking spinner/notification.

For higher throughput: request higher concurrency from fal or shard traffic across projects/keys (respect ToS).

Throughput Math (Rule of Thumb)
jobs/min ≈ concurrency × (60 ÷ avg_job_seconds)

If avg job = 20s, with 10 slots → ~30 jobs/minute.

13. Cost Controls & Pricing Levers
num_images drives variable cost. Offer Top‑3 only on paid tiers; use Top‑1 on free tier.

Add size limits (e.g., 12MB) and enforce image formats (JPG/PNG/WebP/HEIC).

Cache best results; allow users to re‑download without re‑generating.

14. Storage & CDN
Persist image URLs you get from fal.

Optionally copy to your S3/Cloudflare R2 bucket for long-term storage.

Serve via CDN (CloudFront/Cloudflare) for faster product pages.

15. n8n Integration (Optional Orchestration)
Two patterns:

Webhook‑first: fal → your Next.js /api/fal/webhook → HTTP Request (n8n) to continue a workflow (e.g., store to S3, notify WhatsApp, update CRM).

n8n as the backend: Your UI posts to n8n → n8n calls queue.fal.run → n8n exposes a webhook node for fal callback → pushes results to DB.

Minimal n8n steps:

HTTP Request (POST) to https://queue.fal.run/fal-ai/nano-banana/edit?fal_webhook=... with JSON body.

Webhook node to receive result, verify headers, and write to DB.

Respond to Webhook or Send Message (WhatsApp/Email) to alert the user.

16. Local Testing
Use ngrok to expose your webhook: https://<sub>.ngrok.io/api/fal/webhook.

Confirm your server logs the signature headers and payload shape.

Simulate failures (return 500) to see fal retry behavior.

17. Observability & Ops
Log request_id, gateway_request_id, and jobId.

Add Sentry (server) to capture webhook errors/timeouts.

Track latency from submit → webhook delivered for SLOs.

18. Production Checklist
[ ] Server‑only access to FAL_KEY.

[ ] HTTPS for webhook endpoint.

[ ] Signature verification + idempotent writes.

[ ] Rate limiting & payload validation on /api/generate.

[ ] Size/type validation for uploads.

[ ] Store final URLs in DB; copy to S3/R2 if needed.

[ ] Graceful UI for queued/running/failed jobs.

[ ] Alerts if webhook error rate spikes.

19. Quick FAQ
Can I request 3 images in one go?
Yes—set num_images: 3. It stays one job (one slot) but costs 3× per image.

Do webhooks exist?
Yes—pass webhookUrl (SDK) or fal_webhook (raw HTTP). Verify signatures via JWKS.

What about rate limits?
Plan for ~10 concurrent jobs by default; extras queue. Ask fal to raise limits as you scale.

Can I do text‑only generation?
Yes, use fal-ai/nano-banana.

Can I merge two images (e.g., model + T‑shirt)?
Use image_urls with multiple links on the /edit endpoint and describe the transformation in the prompt.

20. Copy-Paste Snippets
Submit (raw HTTP)
HTTP

POST [https://queue.fal.run/fal-ai/nano-banana/edit?fal_webhook=https://your-domain.com/api/fal/webhook%3FjobId%3D123](https://queue.fal.run/fal-ai/nano-banana/edit?fal_webhook=https://your-domain.com/api/fal/webhook%3FjobId%3D123)
Authorization: Key <FAL_KEY>
Content-Type: application/json

{
  "prompt": "studio white catalog photo, soft shadows, ecommerce",
  "image_urls": ["https://.../input.png"],
  "num_images": 3,
  "output_format": "png"
}
Webhook payload (example)
JSON

{
  "request_id": "...",
  "status": "OK",
  "payload": {
    "images": [
      { "url": "https://.../img1.png" },
      { "url": "https://.../img2.png" },
      { "url": "https://.../img3.png" }
    ]
  }
}
21. Next Steps for Your Product
Gate Top‑3 behind paid tiers; default free tier to Top‑1.

Add a compare slider and download buttons on each result.

Pre‑build catalog presets: Amazon/Flipkart/Myntra white background, square crop, 85% product fill.

Add a bulk mode later: accept a ZIP, stream results via webhook → email/WhatsApp when done.

You’re set. Plug these routes into your Next.js app, point your frontend to /api/generate and /api/jobs/:jobId, and you’ll have a scalable, webhook‑driven Top‑3 mockup generator on fal.ai Nano Banana.