"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CreditCard, Package, ArrowUpRight, ArrowDownRight, Zap, Target, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR, cn } from "@/lib/utils";
import { fetchSalesReport, fetchAllProducts, type SalesReport } from "@/lib/api-service";

export default function AdminDashboardPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [salesData, products] = await Promise.all([
          fetchSalesReport(),
          fetchAllProducts(),
        ]);
        setReport(salesData);
        setProductCount(products.length);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      val: formatIDR(report?.totalRevenue || 0),
      trend: "+20.1%",
      icon: <div className="font-bold text-emerald-500">Rp</div>,
      positive: true
    },
    {
      title: "Total Customers",
      val: report?.totalCustomers?.toString() || "0",
      trend: "+18.1%",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      positive: true
    },
    {
      title: "Total Orders",
      val: report?.totalOrders?.toString() || "0",
      trend: "+19%",
      icon: <CreditCard className="w-5 h-5 text-purple-500" />,
      positive: true
    },
    {
      title: "Active Products",
      val: productCount.toString(),
      trend: "+2.4%",
      icon: <Package className="w-5 h-5 text-amber-500" />,
      positive: true
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
          <p className="text-slate-400 font-medium">Welcome back. Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50 transition-smooth hover:border-zinc-700/50 hover:bg-zinc-900 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                {stat.icon}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1.5">{stat.title}</p>
              <p className="text-3xl font-black tracking-tight text-white leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-smooth" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/40" />
                <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-zinc-800/50 hover:bg-black/60 transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Order #SKU-{2930 + item} Processed</p>
                        <p className="text-xs text-slate-500 font-medium">{item * 2} hours ago • Admin Panel</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="font-bold text-primary hover:text-primary-light hover:bg-primary/10">Views</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 overflow-hidden relative group shadow-lg">
            <div className="p-6 border-b border-zinc-800/50 bg-white/5">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-black text-white tracking-tight">Quick Actions</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {["Update Prices", "Manage Inventory", "User Permissions", "System Configuration"].map((action, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-smooth group border border-transparent hover:border-zinc-800/50">
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white">{action}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-smooth" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
