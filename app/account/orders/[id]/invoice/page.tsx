"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { API_URL } from "@/lib/auth-service"
import { formatIDR } from "@/lib/utils"
import { getCookie } from "@/lib/cookie-utils"

export default function InvoicePage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getCookie("emobo-token")
        const res = await fetch(`${API_URL}/orders/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) {
          setOrder(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch order", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  useEffect(() => {
    if (!loading && order) {
      // Trigger print dialog automatically after a short delay for rendering
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loading, order])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat Invoice...</div>
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Pesanan tidak ditemukan</div>
  }

  return (
    <div className="bg-white min-h-screen p-8 text-black print:p-0 print:bg-white max-w-4xl mx-auto">
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">EMOBO E-Commerce</h1>
          <p className="text-sm text-gray-500 mt-1">Solusi Laptop Terbaik & Terpercaya</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-sm text-gray-600 mt-1 font-mono">#{order.id}</p>
        </div>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase">Ditagihkan Kepada:</p>
          <div className="mt-2 text-gray-800">
            <p className="font-medium">{order.user?.name || "Pelanggan"}</p>
            <p className="text-sm mt-1 max-w-xs">{order.shippingAddress || "Alamat Pengiriman"}</p>
            <p className="text-sm">{order.phone || "-"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500 uppercase">Tanggal Invoice:</p>
            <p className="text-gray-800">{new Date(order.createdAt).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Status Pembayaran:</p>
            <p className="font-bold text-green-600">{order.status === "PENDING" ? "BELUM DIBAYAR" : "LUNAS"}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left">
            <th className="py-3 px-2 text-sm font-semibold text-gray-600">No.</th>
            <th className="py-3 px-2 text-sm font-semibold text-gray-600">Produk</th>
            <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-center">Kuantitas</th>
            <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-right">Harga Satuan</th>
            <th className="py-3 px-2 text-sm font-semibold text-gray-600 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item: any, index: number) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-4 px-2 text-sm text-gray-800">{index + 1}</td>
              <td className="py-4 px-2 text-sm font-medium text-gray-800">{item.product?.name || "Produk Laptop"}</td>
              <td className="py-4 px-2 text-sm text-gray-800 text-center">{item.quantity}</td>
              <td className="py-4 px-2 text-sm text-gray-800 text-right">{formatIDR(item.unitPrice)}</td>
              <td className="py-4 px-2 text-sm text-gray-800 text-right font-medium">{formatIDR(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end border-t-2 border-gray-200 pt-4">
        <div className="w-1/2 max-w-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800 font-medium">{formatIDR(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-100">
            <span className="font-bold text-gray-800">Total Pembayaran:</span>
            <span className="font-bold text-xl text-blue-600">{formatIDR(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>Terima kasih telah berbelanja di Emobo E-Commerce.</p>
        <p>Invoice ini sah dan diproses oleh sistem komputer.</p>
      </div>
      
      {/* Tombol cetak manual (disembunyikan saat di-print) */}
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Cetak Ulang / Simpan PDF
        </button>
      </div>
    </div>
  )
}
