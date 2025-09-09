import { NextRequest, NextResponse } from "next/server";

const DOMA_API_BASE_URL = "https://api-testnet.doma.xyz";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const domainId = params.id;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.DOMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${DOMA_API_BASE_URL}/v1/domains/${domainId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Domain not found" },
          { status: 404 },
        );
      }
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Doma API error: ${response.status} ${errorData}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    const domain = {
      id: data.id,
      domain: data.name,
      currentPrice: `${data.price || "0"} ETH`,
      lastSold: data.lastSalePrice ? `${data.lastSalePrice} ETH` : null,
      lastSoldDate: data.lastSaleDate || null,
      category: data.category || "General",
      description: data.description || `Premium domain: ${data.name}`,
      isVerified: data.verified || false,
      expiryDate: data.expiryDate || null,
      contractAddress: data.contractAddress || null,
      tokenId: data.tokenId || null,
      currentOwner: data.owner || null,
      orderbook: data.orderbook || "opensea",
      chainId: data.chainId || "eip155:1",
      metrics: {
        monthlySearches: data.metrics?.monthlySearches || 0,
        cpc: data.metrics?.cpc || 0,
        domainAuthority: data.metrics?.domainAuthority || 0,
        backlinks: data.metrics?.backlinks || 0,
        trafficValue: data.metrics?.trafficValue || 0,
      },
      history: data.history || [],
      offers: data.offers || [],
    };

    return NextResponse.json({ domain });
  } catch (error) {
    console.error("Error fetching domain details:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch domain details",
      },
      { status: 500 },
    );
  }
}
