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
    const response = await fetch("https://api.nookipedia.com/nh/bugs", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const bugs = data.map((b: {
      name: string;
      image_url: string;
      sell_nook: number;
      location: string;
      rarity: string;
      north: { availability_array: { months: string; time: string }[] };
    }) => ({
      name: b.name,
      imageUrl: b.image_url,
      price: b.sell_nook,
      location: b.location,
      rarity: b.rarity,
      availability: b.north?.availability_array || [],
    }));

    return NextResponse.json(bugs);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
