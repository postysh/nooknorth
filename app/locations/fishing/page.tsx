"use client";

import { useState, useEffect, useMemo } from "react";

interface Fish {
  name: string;
  imageUrl: string;
  price: number;
  location: string;
  shadowSize: string;
  rarity: string;
}

const LOCATIONS = ["All", "Sea", "River", "Pond", "Pier", "River (Clifftop)", "River (Mouth)", "Sea (when raining)"];

export default function FishingPage() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  useEffect(() => {
    async function fetchFish() {
      try {
        const res = await fetch("/api/fish");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFish(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFish();
  }, []);

  const filtered = useMemo(() => {
    return fish.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = locationFilter === "All" || f.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [fish, search, locationFilter]);

  return (
    <main 
      className="h-screen flex flex-col overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }}
    >
      <div className="flex-1 overflow-y-auto pt-20 px-4 pb-8" style={{ scrollbarGutter: 'stable' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1">🎣 Fishing Spots</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} of ${fish.length} fish`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {(search || locationFilter !== "All") && (
              <button
                onClick={() => { setSearch(""); setLocationFilter("All"); }}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 animate-pulse">
                  <div className="w-full aspect-square bg-muted rounded-lg mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No fish found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((f) => (
                <div
                  key={f.name}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="p-3 bg-blue-500/5">
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{f.name}</h3>
                    <p className="text-xs text-muted-foreground">{f.location}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {f.price.toLocaleString()} 🔔
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {f.shadowSize}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
