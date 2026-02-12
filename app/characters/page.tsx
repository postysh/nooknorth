"use client";

import { useState, useMemo } from "react";
import { npcs, type NPC } from "@/data/npcs";

export default function CharactersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | NPC["category"]>("all");

  const filtered = useMemo(() => {
    return npcs.filter((npc) => {
      const matchesSearch =
        npc.name.toLowerCase().includes(search.toLowerCase()) ||
        npc.role.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || npc.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const categoryLabels = {
    all: "All",
    resident: "Residents",
    visitor: "Visitors",
    special: "Special",
  };

  return (
    <main
      className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="flex-1 overflow-y-auto pt-20 px-4 pb-8" style={{ scrollbarGutter: "stable" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1">🏝️ Characters</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} NPCs</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Search characters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((npc) => (
              <div
                key={npc.name}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="p-4 bg-emerald-500/5 flex items-center justify-center">
                  <img
                    src={npc.imageUrl}
                    alt={npc.name}
                    className="w-24 h-24 object-contain group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="px-3 pb-3">
                  <h3 className="font-medium text-sm text-foreground truncate">{npc.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{npc.role}</p>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        npc.category === "resident"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : npc.category === "visitor"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {npc.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
