import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const limitCount = parseInt(searchParams.get('limit') || '20');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Query transformations for the user (simplified to avoid index requirement)
        const transformationsRef = collection(db, 'transformations');
        const q = query(
            transformationsRef,
            where('userId', '==', userId),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const transformations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by createdAt on the client side to avoid index requirement
        transformations.sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime; // Descending order (newest first)
        });

        return NextResponse.json({ transformations });

    } catch (error) {
        console.error('Get transformations error:', error);
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
