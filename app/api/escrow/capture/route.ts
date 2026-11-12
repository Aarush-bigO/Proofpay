import { NextRequest, NextResponse } from 'next/server';
import { captureEscrowAuthorization } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorizationId, amount, currency = 'USD' } = body;

    if (!authorizationId) {
      return NextResponse.json(
        { error: 'Missing required field: authorizationId' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid or missing amount' },
        { status: 400 }
      );
    }

    const captureResult = await captureEscrowAuthorization(
      authorizationId,
      Number(amount),
      currency
    );

    return NextResponse.json({
      ...captureResult,
    });
  } catch (error) {
    console.error('Escrow capture error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal capture error' },
      { status: 500 }
    );
  }
}
