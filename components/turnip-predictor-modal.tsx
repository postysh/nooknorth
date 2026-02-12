"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "nooknorth-turnip-prices";

interface TurnipPrices {
  buyPrice: number | null;
  prices: (number | null)[];
  lastPattern: Pattern | null;
}

type Pattern = "fluctuating" | "large-spike" | "decreasing" | "small-spike";

interface PatternResult {
  pattern: Pattern;
  probability: number;
  description: string;
  recommendation: string;
  priceRange: { min: number; max: number } | null;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PERIODS = ["AM", "PM"];

// Pattern transition probabilities based on datamined code by Ninji
// Given last week's pattern, probability of this week's pattern
const TRANSITION_PROBS: Record<Pattern, Record<Pattern, number>> = {
  "fluctuating": {
    "fluctuating": 0.20,
    "large-spike": 0.30,
    "decreasing": 0.15,
    "small-spike": 0.35,
  },
  "large-spike": {
    "fluctuating": 0.50,
    "large-spike": 0.05,
    "decreasing": 0.20,
    "small-spike": 0.25,
  },
  "decreasing": {
    "fluctuating": 0.25,
    "large-spike": 0.45,
    "decreasing": 0.05,
    "small-spike": 0.25,
  },
  "small-spike": {
    "fluctuating": 0.45,
    "large-spike": 0.25,
    "decreasing": 0.15,
    "small-spike": 0.15,
  },
};

// Base probabilities (equilibrium / no previous pattern known)
const BASE_PROBS: Record<Pattern, number> = {
  "fluctuating": 0.3461,
  "large-spike": 0.2475,
  "decreasing": 0.1476,
  "small-spike": 0.2588,
};

function getPriorProbabilities(lastPattern: Pattern | null): Record<Pattern, number> {
  if (lastPattern && TRANSITION_PROBS[lastPattern]) {
    return TRANSITION_PROBS[lastPattern];
  }
  return BASE_PROBS;
}

// Check if prices match the decreasing pattern
function matchesDecreasing(buyPrice: number, prices: (number | null)[]): number {
  // Decreasing: starts at 85-90% of buy price, decreases 3-5% each half-day
  let probability = 1;
  const minRate = 0.85;
  const maxRate = 0.90;
  
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    if (price === null) continue;
    
    const minExpected = Math.floor(buyPrice * (minRate - 0.05 * i));
    const maxExpected = Math.ceil(buyPrice * (maxRate - 0.03 * i));
    
    if (price < minExpected - 5 || price > maxExpected + 5) {
      probability *= 0.1; // Unlikely but not impossible due to rounding
    }
    
    // Must be decreasing
    if (minExpected < buyPrice * 0.3) {
      // Sanity check - prices shouldn't go below ~30%
      break;
    }
  }
  
  return Math.max(0, Math.min(1, probability));
}

// Check if prices match the fluctuating/random pattern
function matchesFluctuating(buyPrice: number, prices: (number | null)[]): number {
  // Fluctuating: alternates between decreasing and increasing phases
  // Prices range from 60-140% of buy price
  let probability = 1;
  
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    if (price === null) continue;
    
    const minExpected = Math.floor(buyPrice * 0.6);
    const maxExpected = Math.ceil(buyPrice * 1.4);
    
    if (price < minExpected || price > maxExpected) {
      probability *= 0.1;
    }
  }
  
  return Math.max(0, Math.min(1, probability));
}

// Check if prices match small spike pattern
function matchesSmallSpike(buyPrice: number, prices: (number | null)[]): number {
  // Small spike: decreasing phase, then 5 half-days of increase (peak 140-200%)
  let probability = 1;
  let foundIncrease = false;
  let peakFound = false;
  
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    if (price === null) continue;
    
    // Check if we see an increase after decrease (spike starting)
    if (i > 0 && prices[i - 1] !== null && price > prices[i - 1]!) {
      foundIncrease = true;
    }
    
    // Peak should be 140-200% of buy price
    if (price >= buyPrice * 1.4 && price <= buyPrice * 2.0) {
      peakFound = true;
    }
    
    // Prices above 200% don't fit small spike
    if (price > buyPrice * 2.1) {
      probability *= 0.1;
    }
  }
  
  // Boost probability if we found characteristic patterns
  if (foundIncrease && !peakFound) {
    probability *= 1.2; // Might still be building to peak
  }
  
  return Math.max(0, Math.min(1, probability));
}

// Check if prices match large spike pattern
function matchesLargeSpike(buyPrice: number, prices: (number | null)[]): number {
  // Large spike: decreasing 1-7 half-days, then spike to 200-600%
  let probability = 1;
  let foundSpike = false;
  
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    if (price === null) continue;
    
    // Large spike peak is 200-600% of buy price
    if (price >= buyPrice * 2.0) {
      foundSpike = true;
      if (price > buyPrice * 6.0) {
        probability *= 0.1; // Too high even for large spike
      }
    }
  }
  
  // If we see very high prices, boost large spike probability
  if (foundSpike) {
    probability *= 2;
  }
  
  return Math.max(0, Math.min(1, probability));
}

function predictPatterns(
  buyPrice: number,
  prices: (number | null)[],
  lastPattern: Pattern | null
): PatternResult[] {
  const priors = getPriorProbabilities(lastPattern);
  
  // Calculate likelihood of each pattern given observed prices
  const likelihoods: Record<Pattern, number> = {
    "fluctuating": matchesFluctuating(buyPrice, prices),
    "large-spike": matchesLargeSpike(buyPrice, prices),
    "decreasing": matchesDecreasing(buyPrice, prices),
    "small-spike": matchesSmallSpike(buyPrice, prices),
  };
  
  // Apply Bayes' theorem: P(pattern|prices) ∝ P(prices|pattern) * P(pattern)
  const posteriors: Record<Pattern, number> = {
    "fluctuating": likelihoods["fluctuating"] * priors["fluctuating"],
    "large-spike": likelihoods["large-spike"] * priors["large-spike"],
    "decreasing": likelihoods["decreasing"] * priors["decreasing"],
    "small-spike": likelihoods["small-spike"] * priors["small-spike"],
  };
  
  // Normalize probabilities
  const total = Object.values(posteriors).reduce((a, b) => a + b, 0);
  
  const results: PatternResult[] = [
    {
      pattern: "large-spike",
      probability: total > 0 ? posteriors["large-spike"] / total : 0.25,
      description: "Prices decrease then spike dramatically (200-600% of buy price)",
      recommendation: "Wait for the spike! Could reach 300-600+ bells",
      priceRange: { min: Math.round(buyPrice * 2), max: Math.round(buyPrice * 6) },
    },
    {
      pattern: "small-spike",
      probability: total > 0 ? posteriors["small-spike"] / total : 0.26,
      description: "Prices decrease then have a moderate spike (140-200%)",
      recommendation: "Sell at the peak, usually 4th price after increase starts",
      priceRange: { min: Math.round(buyPrice * 1.4), max: Math.round(buyPrice * 2) },
    },
    {
      pattern: "fluctuating",
      probability: total > 0 ? posteriors["fluctuating"] / total : 0.35,
      description: "Random ups and downs between 60-140% of buy price",
      recommendation: "Sell when you see 120%+ or on any profit opportunity",
      priceRange: { min: Math.round(buyPrice * 0.6), max: Math.round(buyPrice * 1.4) },
    },
    {
      pattern: "decreasing",
      probability: total > 0 ? posteriors["decreasing"] / total : 0.15,
      description: "Prices only go down all week - no profit possible on your island",
      recommendation: "Sell immediately or find a friend's island with better prices!",
      priceRange: { min: Math.round(buyPrice * 0.3), max: Math.round(buyPrice * 0.9) },
    },
  ];
  
  // Sort by probability
  return results.sort((a, b) => b.probability - a.probability);
}

function loadSavedPrices(): TurnipPrices {
  if (typeof window === "undefined") {
    return { buyPrice: null, prices: Array(12).fill(null), lastPattern: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        buyPrice: parsed.buyPrice ?? null,
        prices: parsed.prices ?? Array(12).fill(null),
        lastPattern: parsed.lastPattern ?? null,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { buyPrice: null, prices: Array(12).fill(null), lastPattern: null };
}

function savePrices(data: TurnipPrices) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface TurnipPredictorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TurnipPredictorModal({ open, onOpenChange }: TurnipPredictorModalProps) {
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [prices, setPrices] = useState<string[]>(Array(12).fill(""));
  const [lastPattern, setLastPattern] = useState<Pattern | null>(null);
  const [results, setResults] = useState<PatternResult[] | null>(null);

  useEffect(() => {
    if (open) {
      const saved = loadSavedPrices();
      setBuyPrice(saved.buyPrice?.toString() ?? "");
      setPrices(saved.prices.map(p => p?.toString() ?? ""));
      setLastPattern(saved.lastPattern);
    }
  }, [open]);

  const handleBuyPriceChange = (value: string) => {
    setBuyPrice(value);
    const numValue = value ? parseInt(value) : null;
    savePrices({
      buyPrice: numValue,
      prices: prices.map(p => p ? parseInt(p) : null),
      lastPattern,
    });
  };

  const handlePriceChange = (index: number, value: string) => {
    const newPrices = [...prices];
    newPrices[index] = value;
    setPrices(newPrices);
    savePrices({
      buyPrice: buyPrice ? parseInt(buyPrice) : null,
      prices: newPrices.map(p => p ? parseInt(p) : null),
      lastPattern,
    });
  };

  const handleLastPatternChange = (pattern: Pattern | null) => {
    setLastPattern(pattern);
    savePrices({
      buyPrice: buyPrice ? parseInt(buyPrice) : null,
      prices: prices.map(p => p ? parseInt(p) : null),
      lastPattern: pattern,
    });
  };

  const handlePredict = () => {
    const buy = buyPrice ? parseInt(buyPrice) : null;
    if (!buy || buy < 90 || buy > 110) {
      return;
    }
    
    const numericPrices = prices.map(p => p ? parseInt(p) : null);
    const predictions = predictPatterns(buy, numericPrices, lastPattern);
    setResults(predictions);
  };

  const handleReset = () => {
    setBuyPrice("");
    setPrices(Array(12).fill(""));
    setLastPattern(null);
    setResults(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasAnyPrice = prices.some(p => p !== "");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
        <AlertDialogTitle className="sr-only">Turnip Predictor</AlertDialogTitle>
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-primary">
              <path d="M12 2c-1 2-1 4 0 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 3c0 2 1 4 3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15 3c0 2-1 4-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <ellipse cx="12" cy="14" rx="6" ry="7" fill="currentColor" opacity="0.15"/>
              <ellipse cx="12" cy="14" rx="6" ry="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 19c0 1.5-.5 2.5-1 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
              <path d="M14 19c0 1.5.5 2.5 1 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
              <path d="M12 20v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            </svg>
            <h2 className="font-medium text-foreground">Turnip Predictor</h2>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sunday Buy Price */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Sunday Buy Price (from Daisy Mae)
            </label>
            <input
              type="number"
              min="90"
              max="110"
              placeholder="90-110"
              value={buyPrice}
              onChange={(e) => handleBuyPriceChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Last Week's Pattern */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Last Week&apos;s Pattern (optional, improves accuracy)
            </label>
            <select
              value={lastPattern ?? ""}
              onChange={(e) => handleLastPatternChange(e.target.value as Pattern || null)}
              className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Unknown</option>
              <option value="fluctuating">Fluctuating (Random)</option>
              <option value="large-spike">Large Spike</option>
              <option value="small-spike">Small Spike</option>
              <option value="decreasing">Decreasing</option>
            </select>
          </div>

          {/* Daily Prices Grid */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Daily Prices (enter as you get them)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide">{day}</span>
                  <div className="flex gap-1">
                    {PERIODS.map((period, periodIndex) => {
                      const index = dayIndex * 2 + periodIndex;
                      return (
                        <input
                          key={`${day}-${period}`}
                          type="number"
                          min="0"
                          max="700"
                          placeholder={period}
                          value={prices[index]}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-muted/50 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePredict}
              disabled={!buyPrice}
              className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Predict Pattern
            </button>
            {(buyPrice || hasAnyPrice) && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-2 pt-2 border-t border-border">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Predicted Patterns
              </h3>
              {results.map((result) => (
                <div
                  key={result.pattern}
                  className={`p-3 rounded-lg border ${
                    result.probability > 0.4
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">
                      {result.pattern.replace("-", " ")}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      result.probability > 0.4
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {Math.round(result.probability * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {result.description}
                  </p>
                  {result.priceRange && (
                    <p className="text-xs text-primary">
                      Expected range: {result.priceRange.min} - {result.priceRange.max} bells
                    </p>
                  )}
                  <p className="text-xs text-foreground/80 mt-1 italic">
                    💡 {result.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <p className="text-[10px] text-muted-foreground/70 text-center pt-2">
            Based on datamined patterns by Ninji. More prices = better predictions!
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
