import { NextRequest, NextResponse } from 'next/server';

const DOMA_API_BASE_URL = 'https://api-testnet.doma.xyz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiKey = process.env.DOMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Validate required fields
    const { orderbook, chainId, parameters, signature } = body;
    if (!orderbook || !chainId || !parameters || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields: orderbook, chainId, parameters, signature' },
        { status: 400 }
      );
    }

    const response = await fetch(`${DOMA_API_BASE_URL}/v1/orderbook/list`, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderbook,
        chainId,
        parameters,
        signature
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Doma API error: ${response.status} ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
