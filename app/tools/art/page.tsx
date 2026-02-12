"use client";

import { useState, useEffect, useMemo } from "react";

interface Art {
  name: string;
  imageUrl: string;
  hasFake: boolean;
  fakeImageUrl: string | null;
  artName: string;
  author: string;
  year: string;
  buyPrice: number;
  sellPrice: number;
  authenticity: string;
}

export default function ArtPage() {
  const [art, setArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fakeFilter, setFakeFilter] = useState("All");

  useEffect(() => {
    async function fetchArt() {
      try {
        const res = await fetch("/api/art");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArt();
  }, []);

  const filtered = useMemo(() => {
    return art.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                           a.artName.toLowerCase().includes(search.toLowerCase());
      const matchesFake = fakeFilter === "All" || 
                         (fakeFilter === "Has Fake" && a.hasFake) ||
                         (fakeFilter === "Always Real" && !a.hasFake);
      return matchesSearch && matchesFake;
    });
  }, [art, search, fakeFilter]);

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
            <h1 className="text-2xl font-semibold text-foreground mb-1">🎨 Art Guide</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} of ${art.length} artworks`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search art..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
            <select
              value={fakeFilter}
              onChange={(e) => setFakeFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Art</option>
              <option value="Has Fake">Has Fake Version</option>
              <option value="Always Real">Always Real</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-3 animate-pulse">
                  <div className="w-full aspect-square bg-muted rounded-lg mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((a) => (
                <div
                  key={a.name}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="p-3 bg-purple-500/5">
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.artName}</p>
                    <p className="text-xs text-muted-foreground">{a.author}, {a.year}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {a.buyPrice.toLocaleString()} 🔔
                      </span>
                      {a.hasFake ? (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                          ⚠️ Has Fake
                        </span>
                      ) : (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">
                          ✓ Always Real
                        </span>
                      )}
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
