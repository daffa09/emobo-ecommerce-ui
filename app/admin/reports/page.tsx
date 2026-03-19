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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList>
          <TabsTrigger value="financial">Sales</TabsTrigger>
          <TabsTrigger value="inbound">Incoming Goods</TabsTrigger>
          <TabsTrigger value="outbound">Outgoing Goods</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Sales Report (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end max-w-2xl">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <Button
                  onClick={printReport}
                  disabled={loading}
                  className="bg-primary"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {loading ? "Preparing..." : "Print Report"}
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                This report contains details of all completed orders (PAID/COMPLETED) within the selected date range.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Incoming goods recording feature is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Goods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Outgoing goods recording feature is coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
