"use client";

import { useState, useEffect, useMemo } from "react";

interface Villager {
  name: string;
  imageUrl: string;
  species: string;
  personality: string;
  gender: string;
  birthday: string;
  catchphrase: string;
  titleColor: string;
}

const SPECIES = [
  "Alligator", "Anteater", "Bear", "Bird", "Bull", "Cat", "Chicken", "Cow", 
  "Cub", "Deer", "Dog", "Duck", "Eagle", "Elephant", "Frog", "Goat", 
  "Gorilla", "Hamster", "Hippo", "Horse", "Kangaroo", "Koala", "Lion", 
  "Monkey", "Mouse", "Octopus", "Ostrich", "Penguin", "Pig", "Rabbit", 
  "Rhino", "Sheep", "Squirrel", "Tiger", "Wolf"
];

const PERSONALITIES = [
  "Cranky", "Jock", "Lazy", "Normal", "Peppy", "Sisterly", "Smug", "Snooty"
];

function getSafeColor(hex?: string): string | undefined {
  if (!hex) return undefined;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (r > 230 && g > 230 && b > 230) return 'b0b0b0';
  return hex;
}

export default function VillagersPage() {
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [personalityFilter, setPersonalityFilter] = useState("");

  useEffect(() => {
    async function fetchVillagers() {
      try {
        const res = await fetch("/api/villagers");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVillagers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVillagers();
  }, []);

  const filtered = useMemo(() => {
    return villagers.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecies = !speciesFilter || v.species === speciesFilter;
      const matchesPersonality = !personalityFilter || v.personality === personalityFilter;
      return matchesSearch && matchesSpecies && matchesPersonality;
    });
  }, [villagers, search, speciesFilter, personalityFilter]);

  return (
    <main 
      className="h-screen flex flex-col overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }}
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-20 px-4 pb-8" style={{ scrollbarGutter: 'stable' }}>
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Villagers</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${filtered.length} of ${villagers.length} villagers`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
          />
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Species</option>
            {SPECIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={personalityFilter}
            onChange={(e) => setPersonalityFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Personalities</option>
            {PERSONALITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {(search || speciesFilter || personalityFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setSpeciesFilter("");
                setPersonalityFilter("");
              }}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
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
            <p className="text-muted-foreground">No villagers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((v) => {
              const color = getSafeColor(v.titleColor);
              return (
                <div
                  key={v.name}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  style={color ? { borderTopColor: `#${color}`, borderTopWidth: '3px' } : {}}
                >
                  <div
                    className="p-3"
                    style={color ? { background: `linear-gradient(to bottom, #${color}10, transparent)` } : {}}
                  >
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-medium text-sm text-foreground truncate">{v.name}</h3>
                    <p className="text-xs text-muted-foreground">{v.species}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {v.personality}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
