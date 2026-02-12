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
    const response = await fetch("https://api.nookipedia.com/nh/recipes", {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
    }

    const data = await response.json();
    
    const recipes = data.map((r: {
      name: string;
      image_url: string;
      serial_id: number;
      sell: number;
      recipes_to_unlock: number;
      category: string;
      materials: { name: string; count: number }[];
    }) => ({
      name: r.name,
      imageUrl: r.image_url,
      sellPrice: r.sell,
      category: r.category,
      materials: r.materials,
      recipesToUnlock: r.recipes_to_unlock,
    }));

    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
