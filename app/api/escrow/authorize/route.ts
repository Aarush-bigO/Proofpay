import { NextRequest, NextResponse } from 'next/server';
import { createEscrowAuthorization } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, jobId, jobTitle = 'Milestone Service', currency = 'USD' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid or missing amount' },
        { status: 400 }
      );
    }

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing required field: jobId' },
        { status: 400 }
      );
    }

    const escrowData = await createEscrowAuthorization(
      Number(amount),
      jobId,
      jobTitle,
      currency
    );

    return NextResponse.json({
      success: true,
      ...escrowData,
    });
  } catch (error) {
    console.error('Escrow authorize error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal escrow error' },
      { status: 500 }
    );
  }
}
