import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { fetchRankingData } from '@/lib/rankings';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await fetchRankingData(userId);
        return NextResponse.json(data);
    } catch (err) {
        console.error('Rankings error:', err instanceof Error ? err.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
