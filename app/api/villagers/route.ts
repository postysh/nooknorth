import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NOOKIPEDIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.nookipedia.com/villagers?game=NH", {
      headers: {
        "X-API-KEY": apiKey,
        "Accept-Version": "1.0.0",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch villagers" }, { status: response.status });
    }

    const data = await response.json();
    
    const villagers = data.map((v: {
      name: string;
      image_url: string;
      species: string;
      personality: string;
      gender: string;
      birthday_month: string;
      birthday_day: string;
      phrase: string;
      title_color: string;
    }) => ({
      name: v.name,
      imageUrl: v.image_url,
      species: v.species,
      personality: v.personality,
      gender: v.gender,
      birthday: v.birthday_month && v.birthday_day ? `${v.birthday_month} ${v.birthday_day}` : null,
      catchphrase: v.phrase,
      titleColor: v.title_color,
    }));

    return NextResponse.json(villagers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch villagers" }, { status: 500 });
  }
}
