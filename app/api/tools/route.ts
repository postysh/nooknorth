import { NextResponse } from "next/server";

const API_HEADERS = {
  "X-API-KEY": process.env.NOOKIPEDIA_API_KEY || "",
  "Accept-Version": "1.0.0",
};

export async function GET() {
  if (!process.env.NOOKIPEDIA_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.nookipedia.com/nh/tools", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const tools = data.map((t: {
      name: string;
      variations: { variation: string; image_url: string }[];
      buy: { price: number; currency: string }[];
      sell: number;
      customizable: boolean;
      uses: string | null;
    }) => ({
      name: t.name,
      imageUrl: t.variations?.[0]?.image_url || null,
      buyPrice: t.buy?.[0]?.price || null,
      sellPrice: t.sell,
      customizable: t.customizable,
      uses: t.uses,
    }));

    return NextResponse.json(tools);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
