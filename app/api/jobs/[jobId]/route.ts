import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// In-memory job storage (same as other routes)
const jobs = (globalThis as any).__JOBS__ ?? new Map<string, any>();
(globalThis as any).__JOBS__ = jobs;

export async function GET(_: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
    try {
        const { jobId } = await params;
        
        // Get job status from memory
        const jobData = jobs.get(jobId);
        if (!jobData) {
            return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
        }

        // If we have transformation ID, get full data from Firestore
        if (jobData.transformationId) {
            const transformationRef = doc(db, 'transformations', jobData.transformationId);
            const transformationSnap = await getDoc(transformationRef);
            
            if (transformationSnap.exists()) {
                const transformationData = transformationSnap.data();
                return NextResponse.json({
                    ...jobData,
                    transformation: {
                        id: transformationSnap.id,
                        ...transformationData
                    }
                });
            }
        }

        return NextResponse.json(jobData);

    } catch (error) {
        console.error('Get job error:', error);
        return NextResponse.json({ 
            status: "ERROR",
            error: "Internal server error" 
        }, { status: 500 });
    }
}
