import { NextRequest, NextResponse } from "next/server";

const DOMA_API_BASE_URL = "https://api-testnet.doma.xyz";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");

    const queryParams = new URLSearchParams();
    if (category && category !== "All")
      queryParams.append("category", category);
    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);
    queryParams.append("status", "expired");

    const apiKey = process.env.DOMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${DOMA_API_BASE_URL}/v1/domains?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Doma API error: ${response.status} ${errorData}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    const domains =
      data.domains?.map((domain: any) => ({
        id: domain.id,
        domain: domain.name,
        currentPrice: `${domain.price || "0"} ETH`,
        lastSold: domain.lastSalePrice ? `${domain.lastSalePrice} ETH` : null,
        lastSoldDate: domain.lastSaleDate || null,
        category: domain.category || "General",
        description: domain.description || `Premium domain: ${domain.name}`,
        isVerified: domain.verified || false,
        expiryDate: domain.expiryDate || null,
        contractAddress: domain.contractAddress || null,
        tokenId: domain.tokenId || null,
        currentOwner: domain.owner || null,
        orderbook: domain.orderbook || "opensea",
        chainId: domain.chainId || "eip155:1",
      })) || [];

    return NextResponse.json({
      domains,
      total: domains.length,
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch domains",
      },
      { status: 500 },
    );
  }
}
