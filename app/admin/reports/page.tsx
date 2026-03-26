"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText } from "lucide-react";
import { API_URL } from "@/lib/auth-service";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const printReport = () => {
    if (!startDate || !endDate) {
      return toast.error("Please select a date range first");
    }

    const printUrl = `/admin/reports/print?startDate=${startDate}&endDate=${endDate}`;
    window.open(printUrl, "_blank");
  };

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
          Reports & Analytics
        </h1>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 h-auto p-1 rounded-xl w-fit sm:w-auto flex min-w-max sm:min-w-0">
            <TabsTrigger value="financial" className="rounded-lg px-4 py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">Sales</TabsTrigger>
            <TabsTrigger value="inbound" className="rounded-lg px-4 py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">Incoming Goods</TabsTrigger>
            <TabsTrigger value="outbound" className="rounded-lg px-4 py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-black">Outgoing Goods</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="financial" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden rounded-2xl shadow-xl shadow-black/20">
            <CardHeader className="border-b border-zinc-800 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                <FileText className="w-5 h-5 text-primary" />
                Sales Report (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 h-11 rounded-xl focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 h-11 rounded-xl focus-visible:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <Button
                    onClick={printReport}
                    disabled={loading}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-black h-11 rounded-xl shadow-lg shadow-white/10 transition-all active:scale-[0.98]"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {loading ? "PREPARING..." : "PRINT REPORT"}
                  </Button>
                </div>
              </div>
              <p className="mt-8 text-xs font-medium text-zinc-500 bg-zinc-800/20 p-4 rounded-xl border border-zinc-800/50 leading-relaxed">
                <span className="text-zinc-400 font-bold block mb-1">Information &bull;</span>
                This report contains details of all completed orders (PAID/COMPLETED) within the selected date range.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound">
          <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Incoming Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500">Incoming goods recording feature is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="outbound">
          <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Outgoing Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500">Outgoing goods recording feature is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
