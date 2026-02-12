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
    const response = await fetch("https://api.nookipedia.com/nh/fossils/individuals", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const fossils = data.map((f: {
      name: string;
      image_url: string;
      sell: number;
      fossil_group: string;
    }) => ({
      name: f.name,
      imageUrl: f.image_url,
      sellPrice: f.sell,
      group: f.fossil_group,
    }));

    return NextResponse.json(fossils);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
