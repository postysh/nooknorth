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
    const response = await fetch("https://api.nookipedia.com/nh/fish", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const fish = data.map((f: {
      name: string;
      image_url: string;
      sell_nook: number;
      location: string;
      shadow_size: string;
      rarity: string;
      north: { availability_array: { months: string; time: string }[] };
    }) => ({
      name: f.name,
      imageUrl: f.image_url,
      price: f.sell_nook,
      location: f.location,
      shadowSize: f.shadow_size,
      rarity: f.rarity,
      availability: f.north?.availability_array || [],
    }));

    return NextResponse.json(fish);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
