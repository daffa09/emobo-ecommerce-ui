"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CreditCard, Package, Loader2, ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR, cn } from "@/lib/utils";
import { fetchSalesReport, fetchAdminProducts, fetchAllOrders, type SalesReport, type Order } from "@/lib/api-service";

export default function AdminDashboardPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [salesData, orders, productData] = await Promise.all([
          fetchSalesReport(),
          fetchAllOrders(),
          fetchAdminProducts({ limit: 1 })
        ]);
        setReport(salesData);
        setProductCount(productData.total);
        setRecentOrders(orders.slice(0, 3));
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sales",
      val: formatIDR(report?.totalSales || 0),
      icon: <div className="font-bold text-blue-500">Rp</div>,
    },
    {
      title: "Total Profit",
      val: formatIDR(report?.totalProfit || 0),
      icon: <div className="font-bold text-emerald-500">+$</div>,
    },
    {
      title: "Total Customers",
      val: report?.totalCustomers?.toString() || "0",
      icon: <Users className="w-5 h-5 text-zinc-400" />,
    },
    {
      title: "Total Orders",
      val: report?.totalOrders?.toString() || "0",
      icon: <CreditCard className="w-5 h-5 text-purple-500" />,
    },
    {
      title: "Active Products",
      val: (productCount || 0).toString(),
      icon: <Package className="w-5 h-5 text-amber-500" />,
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

      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <div key={i} className="group glass-card p-6 transition-smooth hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.title}</p>
              <p className="text-3xl font-black tracking-tight text-white leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/20 transition-smooth" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/40" />
                <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-smooth">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Order #{order.id} - {order.status}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()} • {formatIDR(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/transactions?id=${order.id}`}>
                        <Button variant="ghost" size="sm" className="font-bold text-primary hover:text-primary-light hover:bg-primary/10">View</Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-10 font-bold">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card overflow-hidden relative group">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-black text-white tracking-tight">Quick Actions</h4>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {[
                  { name: "Manage Products", href: "/admin/catalog" },
                  { name: "Manage Orders", href: "/admin/transactions" },
                  { name: "View Customers", href: "/admin/customers" },
                  { name: "Sales Reports", href: "/admin/reports" }
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/10 transition-smooth group border border-transparent hover:border-primary/30 text-left">
                    <span className="text-sm font-bold text-slate-400 group-hover:text-white">{action.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
