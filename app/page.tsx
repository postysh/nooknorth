import { Component as ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { BGPattern } from "@/components/ui/bg-pattern";

const API_HEADERS = {
  "X-API-KEY": process.env.NOOKIPEDIA_API_KEY || "",
  "Accept-Version": "1.0.0",
};

async function getVillagers() {
  if (!process.env.NOOKIPEDIA_API_KEY) return null;
  
  try {
    const response = await fetch("https://api.nookipedia.com/villagers?game=NH&nhdetails=true", {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) return null;
    
    const villagers = await response.json();
    const shuffled = villagers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20).map((v: { 
      name: string; 
      image_url: string;
      species: string;
      personality: string;
      gender: string;
      birthday_month: string;
      birthday_day: string;
      phrase: string;
      quote: string;
      sign: string;
      url: string;
      nh_details?: {
        hobby: string;
        fav_colors: string[];
        fav_styles: string[];
        photo_url: string;
      };
      title_color: string;
    }) => ({
      src: v.image_url,
      alt: v.name,
      name: v.name,
      species: v.species,
      personality: v.personality,
      gender: v.gender,
      birthday: v.birthday_month && v.birthday_day ? `${v.birthday_month} ${v.birthday_day}` : undefined,
      catchphrase: v.phrase,
      hobby: v.nh_details?.hobby,
      titleColor: v.title_color,
      quote: v.quote,
      sign: v.sign,
      favColors: v.nh_details?.fav_colors,
      favStyles: v.nh_details?.fav_styles,
      url: v.url,
      photoUrl: v.nh_details?.photo_url,
    }));
  } catch {
    return null;
  }
}

async function getTodaysBirthdays() {
  if (!process.env.NOOKIPEDIA_API_KEY) return null;
  
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const day = now.getDate();
  
  try {
    const response = await fetch(
      `https://api.nookipedia.com/villagers?game=NH&birthmonth=${month}&birthday=${day}`,
      {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      }
    );
    
    if (!response.ok) return null;
    
    const villagers = await response.json();
    return villagers.map((v: { name: string; image_url: string; species: string; phrase: string }) => ({
      name: v.name,
      imageUrl: v.image_url,
      species: v.species,
      catchphrase: v.phrase,
    }));
  } catch {
    return null;
  }
}

interface Critter {
  name: string;
  image_url: string;
  sell_nook: number;
  location: string;
}

async function getAvailableNow() {
  if (!process.env.NOOKIPEDIA_API_KEY) return null;
  
  try {
    const [fishRes, bugsRes] = await Promise.all([
      fetch("https://api.nookipedia.com/nh/fish?month=current", {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      }),
      fetch("https://api.nookipedia.com/nh/bugs?month=current", {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      }),
    ]);
    
    if (!fishRes.ok || !bugsRes.ok) return null;
    
    const fishData = await fishRes.json();
    const bugsData = await bugsRes.json();
    
    // API returns { north: [], south: [] } for current month
    const fish = (fishData.north || []).slice(0, 6).map((f: Critter) => ({
      name: f.name,
      imageUrl: f.image_url,
      price: f.sell_nook,
      location: f.location,
      type: 'fish' as const,
    }));
    
    const bugs = (bugsData.north || []).slice(0, 6).map((b: Critter) => ({
      name: b.name,
      imageUrl: b.image_url,
      price: b.sell_nook,
      location: b.location,
      type: 'bug' as const,
    }));
    
    return { fish, bugs };
  } catch {
    return null;
  }
}

export default async function Page() {
  const villagers = await getVillagers();
  
  return (
    <main className="h-screen flex flex-col overflow-hidden relative">
      <BGPattern variant="dots" mask="none" fill="var(--dot-color)" size={20} />
      {/* Hero Section */}
      <section className="pt-20 pb-4 px-4 text-center">
        <div className="animate-fade-in space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Welcome to</p>
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight inline-flex items-center justify-center gap-2">
            Nook
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8 text-primary">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
            North
          </h1>
          <p className="text-sm text-muted-foreground">Your Animal Crossing: <span className="text-primary font-medium">New Horizons</span> companion</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            🚧 In Development
          </span>
        </div>
      </section>

      {/* Villager Slider */}
      <section className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <ImageAutoSlider images={villagers || undefined} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-3 px-4 shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Data by <a href="https://nookipedia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Nookipedia</a> · © {new Date().getFullYear()} Nook North · Not affiliated with Nintendo
          </p>
        </div>
      </footer>
    </main>
  );
}
