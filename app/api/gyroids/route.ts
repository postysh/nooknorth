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
    const response = await fetch("https://api.nookipedia.com/nh/gyroids", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const gyroids = data.map((g: {
      name: string;
      variations: { variation: string; image_url: string; colors: string[] }[];
      sell: number;
      sound: string;
    }) => ({
      name: g.name,
      imageUrl: g.variations?.[0]?.image_url || null,
      sellPrice: g.sell,
      sound: g.sound,
    }));

    return NextResponse.json(gyroids);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
