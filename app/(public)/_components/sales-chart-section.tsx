"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { API_URL } from "@/lib/auth-service";

interface TopSellingProduct {
  id: number;
  name: string;
  totalSold: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export function SalesChartSection() {
  const [data, setData] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products/top-selling`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch top selling products", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading chart...</div>;
  if (data.length === 0) return null;

  const chartData = data.map((item) => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
    sold: item.totalSold,
  }));

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produk Paling Laris</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cek laptop yang paling banyak dibeli oleh pelanggan kami. Jangan sampai kehabisan!
          </p>
        </div>

        <div className="bg-background p-6 rounded-xl border shadow-sm">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sold" name="Total Terjual" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
