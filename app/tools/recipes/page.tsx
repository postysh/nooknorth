"use client";

import { useState, useEffect, useMemo } from "react";

interface Recipe {
  name: string;
  imageUrl: string;
  sellPrice: number;
  category: string;
  materials: { name: string; count: number }[];
}

const CATEGORIES = ["All", "Housewares", "Miscellaneous", "Wall-mounted", "Ceiling Decor", "Wallpaper", "Floors", "Rugs", "Tools", "Clothing", "Fencing", "Equipment", "Other"];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, search, categoryFilter]);

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
            <h1 className="text-2xl font-semibold text-foreground mb-1">📋 DIY Recipes</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filtered.length} of ${recipes.length} recipes`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
              {filtered.map((r, idx) => (
                <div
                  key={`${r.name}-${idx}`}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="p-3 bg-yellow-500/5">
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {r.materials.length} materials
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
