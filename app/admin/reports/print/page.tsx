"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/auth-service";
import { getCookie } from "@/lib/cookie-utils";

interface ReportData {
  orders: {
    id: number;
    date: string;
    customer: string;
    totalAmount: number;
    items: {
      productName: string;
      quantity: number;
      price: number;
    }[];
  }[];
  totalSales: number;
  period: {
    startDate: string | null;
    endDate: string | null;
  };
}

export default function PrintReportPage() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie("emobo-token");
        const res = await fetch(`${API_URL}/reports/sales?start=${startDate}&end=${endDate}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Gagal mengambil data laporan");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [data]);

  if (loading) return <div className="p-8 text-center">Memuat data laporan...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Data laporan tidak ditemukan.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black min-h-screen">
      <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-3xl font-bold uppercase">Laporan Penjualan</h1>
          <p className="text-gray-600">Emobo Ecommerce</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Periode:</p>
          <p>{data.period.startDate ? new Date(data.period.startDate).toLocaleDateString("id-ID") : "-"} - {data.period.endDate ? new Date(data.period.endDate).toLocaleDateString("id-ID") : "-"}</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-black">
            <th className="p-2 text-left border border-gray-300">Tanggal</th>
            <th className="p-2 text-left border border-gray-300">Order ID</th>
            <th className="p-2 text-left border border-gray-300">Pelanggan</th>
            <th className="p-2 text-right border border-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200">
              <td className="p-2 border border-gray-300">{new Date(order.date).toLocaleDateString("id-ID")}</td>
              <td className="p-2 border border-gray-300">#{order.id}</td>
              <td className="p-2 border border-gray-300">{order.customer}</td>
              <td className="p-2 text-right border border-gray-300">Rp {order.totalAmount.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-50">
            <td colSpan={3} className="p-2 text-right border border-gray-300">TOTAL PENJUALAN</td>
            <td className="p-2 text-right border border-gray-300">Rp {data.totalSales.toLocaleString("id-ID")}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-12 flex justify-end">
        <div className="text-center w-48">
          <p>Dicetak pada:</p>
          <p className="mb-16">{new Date().toLocaleDateString("id-ID")}</p>
          <div className="border-t border-black">Admin Emobo</div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
