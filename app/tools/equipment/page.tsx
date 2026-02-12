"use client";

import { useState, useEffect, useMemo } from "react";

interface Tool {
  name: string;
  imageUrl: string;
  buyPrice: number | null;
  sellPrice: number;
  customizable: boolean;
  uses: number | null;
  recipe: { name: string; count: number }[] | null;
}

export default function EquipmentPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/tools");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTools(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  const filtered = useMemo(() => {
    return tools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
  }, [tools, search]);

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
            <h1 className="text-2xl font-semibold text-foreground mb-1">🔧 Equipment</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} tools`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((t) => (
                <div
                  key={t.name}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="p-3 bg-orange-500/5">
                    <img
                      src={t.imageUrl}
                      alt={t.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{t.name}</h3>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {t.sellPrice > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {t.sellPrice.toLocaleString()} 🔔
                        </span>
                      )}
                      {t.uses && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {t.uses} uses
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
