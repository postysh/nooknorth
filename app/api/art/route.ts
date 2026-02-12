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
    const response = await fetch("https://api.nookipedia.com/nh/art", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const art = data.map((a: {
      name: string;
      image_url: string;
      has_fake: boolean;
      fake_image_url: string | null;
      art_name: string;
      author: string;
      year: string;
      art_style: string;
      description: string;
      buy: number;
      sell: number;
      authenticity: string;
    }) => ({
      name: a.name,
      imageUrl: a.image_url,
      hasFake: a.has_fake,
      fakeImageUrl: a.fake_image_url,
      artName: a.art_name,
      author: a.author,
      year: a.year,
      artStyle: a.art_style,
      description: a.description,
      buyPrice: a.buy,
      sellPrice: a.sell,
      authenticity: a.authenticity,
    }));

    return NextResponse.json(art);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
