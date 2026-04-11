"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/auth-service";
import { getCookie } from "@/lib/cookie-utils";
import { fetchPurchaseOrders, fetchAllOrders } from "@/lib/api-service";

interface SalesReportData {
  orders: {
    id: number;
    date: string;
    customer: string;
    totalAmount: number;
    profit: number;
  }[];
  totalSales: number;
  totalProfit: number;
  period: { startDate: string | null; endDate: string | null };
}

interface GoodsReportData {
  type: "inbound" | "outbound";
  items: {
    date: string;
    id: string | number;
    productName: string;
    sku: string;
    quantity: number;
    status?: string;
  }[];
  totalQuantity: number;
  period: { startDate: string | null; endDate: string | null };
}

export default function PrintReportPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "sales";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [goodsData, setGoodsData] = useState<GoodsReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getCookie("emobo-token");

        if (type === "sales") {
          const res = await fetch(`${API_URL}/reports/sales?start=${startDate}&end=${endDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch");
          const json = await res.json();
          setSalesData(json);
        } else if (type === "inbound") {
          const pos = await fetchPurchaseOrders();
          const start = startDate ? new Date(startDate) : new Date(0);
          const end = endDate ? new Date(endDate) : new Date();
          end.setHours(23, 59, 59, 999);

          const filtered = pos.filter((po) => {
            const d = new Date(po.createdAt);
            return d >= start && d <= end;
          });

          const reportItems: any[] = [];
          let totalQty = 0;
          filtered.forEach((po) => {
            po.items.forEach((item) => {
              reportItems.push({
                date: po.createdAt,
                id: po.id,
                productName: item.product?.name || "Unknown Product",
                sku: item.product?.sku || "-",
                quantity: item.quantity,
              });
              totalQty += item.quantity;
            });
          });

          setGoodsData({ type: "inbound", items: reportItems, totalQuantity: totalQty, period: { startDate, endDate } });
        } else if (type === "outbound") {
          const orders = await fetchAllOrders();
          const start = startDate ? new Date(startDate) : new Date(0);
          const end = endDate ? new Date(endDate) : new Date();
          end.setHours(23, 59, 59, 999);

          const filtered = orders.filter((o) => {
            const d = new Date(o.createdAt);
            return (o.status === "SHIPPED" || o.status === "COMPLETED") && d >= start && d <= end;
          });

          const reportItems: any[] = [];
          let totalQty = 0;
          filtered.forEach((o) => {
            o.items?.forEach((item) => {
              reportItems.push({
                date: o.createdAt,
                id: o.id,
                productName: item.product?.name || "Unknown Product",
                sku: item.product?.sku || "-",
                quantity: item.quantity,
                status: o.status,
              });
              totalQty += item.quantity;
            });
          });

          setGoodsData({ type: "outbound", items: reportItems, totalQuantity: totalQty, period: { startDate, endDate } });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchData();
  }, [type, startDate, endDate]);

  useEffect(() => {
    if (salesData || goodsData) {
      const timer = setTimeout(() => window.print(), 1500);
      return () => clearTimeout(timer);
    }
  }, [salesData, goodsData]);

  const title =
    type === "sales"
      ? "Sales Report"
      : type === "inbound"
      ? "Incoming Goods Report"
      : "Outgoing Goods Report";

  const periodStr = `${startDate ? new Date(startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "-"} – ${
    endDate ? new Date(endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "-"
  }`;

  if (loading)
    return (
      <div style={{ fontFamily: "Arial, sans-serif", padding: "60px", textAlign: "center", background: "#fff", minHeight: "100vh" }}>
        <div style={{ fontSize: 14, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Preparing Report...
        </div>
      </div>
    );

  if (!salesData && !goodsData)
    return (
      <div style={{ fontFamily: "Arial, sans-serif", padding: "60px", textAlign: "center", background: "#fff", minHeight: "100vh" }}>
        <p style={{ color: "#c00", fontWeight: "bold" }}>No data found for the selected period.</p>
      </div>
    );

  const accentColor = type === "inbound" ? "#16a34a" : type === "outbound" ? "#2563eb" : "#000";

  return (
    <>
      <style global jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff !important; color: #000 !important; }
        @media print {
          @page { margin: 18mm 20mm; size: A4 landscape; }
          body { background: #fff !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "#fff", minHeight: "100vh", color: "#000", padding: "36px 48px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: `4px solid ${accentColor}`, paddingBottom: 20 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: accentColor, marginBottom: 4 }}>
              EMOBO ECOMMERCE PLATFORM
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{title}</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", marginBottom: 4 }}>Report Period</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{periodStr}</div>
            <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
              Generated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at{" "}
              {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {/* ── CONTENT: SALES ── */}
        {type === "sales" && salesData && (
          <>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Total Records: {salesData.orders.length}
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderTop: "2px solid #000", borderBottom: "2px solid #000" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em", width: 80 }}>No</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Date</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Order ID</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Customer</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Total Amount</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Est. Profit</th>
                </tr>
              </thead>
              <tbody>
                {salesData.orders.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "9px 12px", color: "#94a3b8", fontSize: 11 }}>{i + 1}</td>
                    <td style={{ padding: "9px 12px" }}>{new Date(order.date).toLocaleDateString("en-GB")}</td>
                    <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11 }}>#{order.id}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 600 }}>{order.customer}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700 }}>
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: "#16a34a" }}>
                      Rp {order.profit.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #000", background: "#f8fafc" }}>
                  <td colSpan={4} style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.05em" }}>
                    Grand Total
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, fontSize: 14, color: accentColor }}>
                    Rp {salesData.totalSales.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, fontSize: 14, color: "#16a34a" }}>
                    Rp {salesData.totalProfit.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}

        {/* ── CONTENT: GOODS ── */}
        {(type === "inbound" || type === "outbound") && goodsData && (
          <>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Total Records: {goodsData.items.length}
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderTop: "2px solid #000", borderBottom: "2px solid #000" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em", width: 50 }}>No</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Date</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>{type === "inbound" ? "PO ID" : "Order ID"}</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Product</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>SKU</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Qty</th>
                  {type === "outbound" && (
                    <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, textTransform: "uppercase", fontSize: 9, letterSpacing: "0.1em" }}>Status</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {goodsData.items.map((item, i) => (
                  <tr key={`${item.id}-${i}`} style={{ borderBottom: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "9px 12px", color: "#94a3b8", fontSize: 11 }}>{i + 1}</td>
                    <td style={{ padding: "9px 12px" }}>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                    <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 11 }}>#{item.id}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: 10, color: "#64748b" }}>{item.sku}</td>
                    <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700 }}>{item.quantity}</td>
                    {type === "outbound" && (
                      <td style={{ padding: "9px 12px", textAlign: "center" }}>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", background: item.status === "COMPLETED" ? "#dcfce7" : "#dbeafe", color: item.status === "COMPLETED" ? "#16a34a" : "#2563eb" }}>
                          {item.status}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #000", background: "#f8fafc" }}>
                  <td colSpan={type === "outbound" ? 5 : 5} style={{ padding: "12px 12px", textAlign: "right", fontWeight: 900, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.05em" }}>
                    Total {type === "inbound" ? "Items Received" : "Items Shipped"}
                  </td>
                  <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: 900, fontSize: 14, color: accentColor }}>{goodsData.totalQuantity}</td>
                  {type === "outbound" && <td />}
                </tr>
              </tfoot>
            </table>
          </>
        )}

        {/* ── FOOTER / SIGNATURE ── */}
        <div className="no-print" style={{ marginTop: 48, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "center", width: 200 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 64 }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div style={{ borderTop: "1.5px solid #000", paddingTop: 8, fontWeight: 900, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Admin EMOBO
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
