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
      return toast.error("Pilih rentang tanggal terlebih dahulu");
    }

    const printUrl = `/admin/reports/print?startDate=${startDate}&endDate=${endDate}`;
    window.open(printUrl, "_blank");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h1>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList>
          <TabsTrigger value="financial">Penjualan</TabsTrigger>
          <TabsTrigger value="inbound">Barang Masuk</TabsTrigger>
          <TabsTrigger value="outbound">Barang Keluar</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Laporan Penjualan (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end max-w-2xl">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Tanggal Mulai</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Tanggal Selesai</label>
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
                  {loading ? "Menyiapkan..." : "Cetak Laporan"}
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Laporan ini berisi rincian semua pesanan yang telah diselesaikan (PAID/COMPLETED) dalam rentang tanggal yang dipilih.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound">
          <Card>
            <CardHeader>
              <CardTitle>Barang Masuk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fitur pencatatan barang masuk akan segera hadir.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound">
          <Card>
            <CardHeader>
              <CardTitle>Barang Keluar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fitur pencatatan barang keluar akan segera hadir.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
