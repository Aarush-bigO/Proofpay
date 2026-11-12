import { NextRequest, NextResponse } from 'next/server';
import { voidEscrowAuthorization } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorizationId } = body;

    if (!authorizationId) {
      return NextResponse.json(
        { error: 'Missing required field: authorizationId' },
        { status: 400 }
      );
    }

    const voidResult = await voidEscrowAuthorization(authorizationId);

    return NextResponse.json({
      ...voidResult,
    });
  } catch (error) {
    console.error('Escrow void error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal void error' },
      { status: 500 }
    );
  }
}
