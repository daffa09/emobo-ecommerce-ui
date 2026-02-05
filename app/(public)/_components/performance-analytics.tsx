"use client";

import { TrendingUp, Users, Zap, ShoppingCart, ArrowUpRight, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Mock Data for Analytics
const historicalData = {
  "2023": [
    { name: "MacBook Pro M2", brand: "Apple", type: "Ultrabook", searches: 14200 },
    { name: "ROG Zephyrus G14", brand: "Asus", type: "Gaming", searches: 12800 },
    { name: "ThinkPad X1 G10", brand: "Lenovo", type: "Business", searches: 11500 },
    { name: "XPS 13", brand: "Dell", type: "Ultrabook", searches: 10200 },
    { name: "Raider GE77", brand: "MSI", type: "Gaming", searches: 8900 },
    { name: "ZenBook Pro", brand: "Asus", type: "Ultrabook", searches: 7500 },
    { name: "Victus 16", brand: "HP", type: "Gaming", searches: 6200 },
  ],
  "2024": [
    { name: "Legion Pro 7i", brand: "Lenovo", type: "Gaming", searches: 15600 },
    { name: "MacBook Air M3", brand: "Apple", type: "Ultrabook", searches: 13900 },
    { name: "ROG Strix SCAR 16", brand: "Asus", type: "Gaming", searches: 12400 },
    { name: "XPS 15", brand: "Dell", type: "Ultrabook", searches: 11100 },
    { name: "Stealth 14", brand: "MSI", type: "Gaming", searches: 9800 },
    { name: "Swift Go 14", brand: "Acer", type: "Ultrabook", searches: 8500 },
    { name: "Omen Transcend", brand: "HP", type: "Gaming", searches: 7200 },
  ],
  "2025": [
    { name: "Legion 9i", brand: "Lenovo", type: "Gaming", searches: 16500 },
    { name: "ROG Strix Scar 18", brand: "Asus", type: "Gaming", searches: 15200 },
    { name: "MacBook Pro M4", brand: "Apple", type: "Ultrabook", searches: 14800 },
    { name: "XPS 16", brand: "Dell", type: "Ultrabook", searches: 13500 },
    { name: "Raider GE78", brand: "MSI", type: "Gaming", searches: 12200 },
    { name: "ZenBook Duo G3", brand: "Asus", type: "Ultrabook", searches: 11500 },
    { name: "ThinkPad X1 G12", brand: "Lenovo", type: "Business", searches: 10900 },
    { name: "Omen 17", brand: "HP", type: "Gaming", searches: 10400 },
  ],
  "2026": [
    { name: "Legion 10i Concept", brand: "Lenovo", type: "Gaming", searches: 18500 },
    { name: "ROG Flow Z16", brand: "Asus", type: "Gaming", searches: 17200 },
    { name: "MacBook Pro M5", brand: "Apple", type: "Ultrabook", searches: 16800 },
    { name: "XPS Cosmic", brand: "Dell", type: "Ultrabook", searches: 15500 },
    { name: "Raider TITAN", brand: "MSI", type: "Gaming", searches: 14200 },
    { name: "ZenBook Holographic", brand: "Asus", type: "Ultrabook", searches: 13500 },
    { name: "ThinkPad Neural", brand: "Lenovo", type: "Business", searches: 12900 },
    { name: "Omen Quantum", brand: "HP", type: "Gaming", searches: 12400 },
  ]
};

const brands = ["All", "Lenovo", "Asus", "Apple", "Dell", "MSI", "HP"];
const types = ["All", "Gaming", "Ultrabook", "Business"];
const years = ["2023", "2024", "2025", "2026"];

export function PerformanceAnalytics() {
  const [filterType, setFilterType] = useState<"brand" | "type">("brand");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2026");

  const currentYearData = historicalData[selectedYear as keyof typeof historicalData] || [];

  const filteredLaptops = currentYearData
    .filter(l => {
      if (selectedFilter === "All") return true;
      if (filterType === "brand") return l.brand === selectedFilter;
      if (filterType === "type") return l.type === selectedFilter;
      return true;
    })
    .sort((a, b) => b.searches - a.searches)
    .slice(0, 5);

  const maxSearches = Math.max(...currentYearData.map(l => l.searches), 1);

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

              {/* Year Filter */}
              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Year:</span>
                  <div className="flex flex-wrap gap-2">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all border",
                          selectedYear === year
                            ? "bg-primary border-primary text-white shadow-lg"
                            : "bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
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
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Top Searches {selectedYear}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {selectedFilter === "All" ? "All Categories" : selectedFilter}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
                </div>

                <div className="h-[350px] w-full mt-4">
                  {filteredLaptops.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredLaptops}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#60a5fa" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          hide
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={10}
                          fontWeight="bold"
                          tickFormatter={(value) => `${value / 1000}k`}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                  <p className="text-xs font-black text-white uppercase tracking-tight mb-1">{data.name}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-primary font-black text-sm">{data.searches.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Searches</span>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{data.brand} • {data.type}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="searches"
                          stroke="url(#lineGradient)"
                          strokeWidth={4}
                          dot={{ r: 6, fill: "#1e293b", stroke: "#3b82f6", strokeWidth: 2 }}
                          activeDot={{ r: 8, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                          filter="url(#glow)"
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-slate-500 font-medium">No results found for current filter.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  {filteredLaptops.map((laptop, i) => (
                    <div key={i} className="group/item flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-sm font-black w-5", i < 3 ? "text-primary" : "text-slate-600")}>#{i + 1}</span>
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
                        <span className="text-sm font-bold text-white block">{laptop.searches.toLocaleString('en-US')}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Searches</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
