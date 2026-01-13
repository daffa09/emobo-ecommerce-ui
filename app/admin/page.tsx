import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Package, ArrowUpRight, ArrowDownRight, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold border-border hover:bg-surface">Download Report</Button>
          <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">Add New Product</Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", val: formatIDR(678478350), trend: "+20.1%", icon: <div className="font-bold text-emerald-500">Rp</div>, positive: true },
          { title: "New Customers", val: "+2,350", trend: "+180.1%", icon: <Users className="w-5 h-5 text-blue-500" />, positive: true },
          { title: "Total Sales", val: "12,234", trend: "+19%", icon: <CreditCard className="w-5 h-5 text-purple-500" />, positive: true },
          { title: "Active Inventory", val: "573", trend: "-2.4%", icon: <Package className="w-5 h-5 text-amber-500" />, positive: false },
        ].map((stat, i) => (
          <div key={i} className="group glass-card p-6 rounded-3xl border-border transition-smooth hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-smooth">
                {stat.icon}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-3xl font-black mt-1 tracking-tight">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2rem] border-border shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <CardTitle className="text-xl font-bold">Performance Analytics</CardTitle>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="p-12 text-center text-muted-foreground">
            <div className="aspect-[2/1] bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <p className="font-medium">Chart visualization will be initialized here</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="bg-slate-950 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <Zap className="w-10 h-10 text-primary mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">Pro Insights</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your sales performance is 45% higher than the industry average this month. Keep up the high-end curation!
            </p>
            <Button className="w-full rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-200">View Details</Button>
          </div>

          <Card className="rounded-[2rem] border-border shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {["Update Prices", "Manage Inventory", "User Permissions", "System Configuration"].map((action, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-smooth group">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-primary">{action}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
