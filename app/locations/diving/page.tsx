"use client";

import { useState, useEffect, useMemo } from "react";

interface SeaCreature {
  name: string;
  imageUrl: string;
  price: number;
  shadowSize: string;
  shadowMovement: string;
  rarity: string;
}

const SHADOW_SIZES = ["All", "Tiny", "Small", "Medium", "Large", "X-Large", "XX-Large"];
const MOVEMENTS = ["All", "Stationary", "Slow", "Medium", "Fast", "Very fast"];

export default function DivingPage() {
  const [creatures, setCreatures] = useState<SeaCreature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [movementFilter, setMovementFilter] = useState("All");

  useEffect(() => {
    async function fetchCreatures() {
      try {
        const res = await fetch("/api/sea");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCreatures(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCreatures();
  }, []);

  const filtered = useMemo(() => {
    return creatures.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesSize = sizeFilter === "All" || c.shadowSize.toLowerCase().includes(sizeFilter.toLowerCase());
      const matchesMovement = movementFilter === "All" || c.shadowMovement.toLowerCase().includes(movementFilter.toLowerCase());
      return matchesSearch && matchesSize && matchesMovement;
    });
  }, [creatures, search, sizeFilter, movementFilter]);

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
            <h1 className="text-2xl font-semibold text-foreground mb-1">🤿 Diving</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} of ${creatures.length} sea creatures`}
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
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              {SHADOW_SIZES.map((size) => (
                <option key={size} value={size}>{size === "All" ? "All Sizes" : size}</option>
              ))}
            </select>
            <select
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              {MOVEMENTS.map((m) => (
                <option key={m} value={m}>{m === "All" ? "All Speeds" : m}</option>
              ))}
            </select>
            {(search || sizeFilter !== "All" || movementFilter !== "All") && (
              <button
                onClick={() => { setSearch(""); setSizeFilter("All"); setMovementFilter("All"); }}
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
              <p className="text-muted-foreground">No sea creatures found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((c) => (
                <div
                  key={c.name}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="p-3 bg-cyan-500/5">
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.shadowSize} · {c.shadowMovement}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {c.price.toLocaleString()} 🔔
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
