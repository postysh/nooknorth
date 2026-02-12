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
    const response = await fetch("https://api.nookipedia.com/nh/sea", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const sea = data.map((s: {
      name: string;
      image_url: string;
      sell_nook: number;
      shadow_size: string;
      shadow_movement: string;
      rarity: string;
      north: { availability_array: { months: string; time: string }[] };
    }) => ({
      name: s.name,
      imageUrl: s.image_url,
      price: s.sell_nook,
      shadowSize: s.shadow_size,
      shadowMovement: s.shadow_movement,
      rarity: s.rarity,
      availability: s.north?.availability_array || [],
    }));

    return NextResponse.json(sea);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
