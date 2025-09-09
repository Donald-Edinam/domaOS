import { NextRequest, NextResponse } from 'next/server';

const DOMA_API_BASE_URL = 'https://api-testnet.doma.xyz';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const [orderId, fulfiller] = params.params;

    if (!orderId || !fulfiller) {
      return NextResponse.json(
        { error: 'Missing orderId or fulfiller address' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DOMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${DOMA_API_BASE_URL}/v1/orderbook/offer/${orderId}/${fulfiller}`,
      {
        method: 'GET',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

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
    console.error('Error fetching offer fulfillment data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
