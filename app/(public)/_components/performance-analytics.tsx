"use client";

import { TrendingUp, Users, Zap, ShoppingCart, ArrowUpRight, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock Data for Analytics
const laptops = [
  { name: "Legion 9i", brand: "Lenovo", type: "Gaming", searches: 12500 },
  { name: "ROG Strix Scar 18", brand: "Asus", type: "Gaming", searches: 11200 },
  { name: "MacBook Pro M3", brand: "Apple", type: "Ultrabook", searches: 9800 },
  { name: "XPS 15", brand: "Dell", type: "Ultrabook", searches: 8500 },
  { name: "Raider GE78", brand: "MSI", type: "Gaming", searches: 7200 },
  { name: "ZenBook Duo", brand: "Asus", type: "Ultrabook", searches: 6500 },
  { name: "ThinkPad X1", brand: "Lenovo", type: "Business", searches: 5900 },
  { name: "Omen 16", brand: "HP", type: "Gaming", searches: 5400 },
];

const brands = ["All", "Lenovo", "Asus", "Apple", "Dell", "MSI", "HP"];
const types = ["All", "Gaming", "Ultrabook", "Business"];

export function PerformanceAnalytics() {
  const [filterType, setFilterType] = useState<"brand" | "type">("brand");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredLaptops = laptops
    .filter(l => {
      if (selectedFilter === "All") return true;
      if (filterType === "brand") return l.brand === selectedFilter;
      if (filterType === "type") return l.type === selectedFilter;
      return true;
    })
    .sort((a, b) => b.searches - a.searches)
    .slice(0, 5);

  const maxSearches = Math.max(...laptops.map(l => l.searches));

  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative border-y border-slate-800">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Search Data</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Trend Pencarian <br />
              <span className="text-primary">Laptop Terkini</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Ketahui laptop apa yang paling diminati saat ini. Data analitik real-time berdasarkan pencarian pengguna di platform kami.
            </p>

            <div className="space-y-6 pt-4">
              {/* Filter Type Toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter By:</span>
                <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => { setFilterType("brand"); setSelectedFilter("All"); }}
                    className={cn("px-4 py-1.5 text-sm font-bold rounded-md transition-all", filterType === "brand" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white")}
                  >
                    Brand
                  </button>
                  <button
                    onClick={() => { setFilterType("type"); setSelectedFilter("All"); }}
                    className={cn("px-4 py-1.5 text-sm font-bold rounded-md transition-all", filterType === "type" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white")}
                  >
                    Type
                  </button>
                </div>
              </div>

              {/* Selection Chips */}
              <div className="flex flex-wrap gap-2">
                {(filterType === "brand" ? brands : types).map(item => (
                  <button
                    key={item}
                    onClick={() => setSelectedFilter(item)}
                    className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border transition-all",
                      selectedFilter === item
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-slate-800/40 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-3xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-2xl group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent pointer-events-none" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Top Searches</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedFilter === "All" ? "All Categories" : selectedFilter}</p>
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
                </div>

                <div className="space-y-6">
                  {filteredLaptops.map((laptop, i) => (
                    <div key={i} className="group/item">
                      <div className="flex items-end justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={cn("text-base font-black w-6", i < 3 ? "text-primary" : "text-slate-600")}>#{i + 1}</span>
                          <div>
                            <span className="text-sm font-bold text-white group-hover/item:text-primary transition-colors block">{laptop.name}</span>
                            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              <span>{laptop.brand}</span>
                              <span className="text-slate-700">•</span>
                              <span>{laptop.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white block">{laptop.searches.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Searches</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-primary to-blue-400 rounded-full relative overflow-hidden"
                          style={{ width: `${(laptop.searches / maxSearches) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredLaptops.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-slate-500 font-medium">No results found for current filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
