"use client"

import { QrCode, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QRPaymentProps {
  amount: number
  status?: "waiting" | "paid"
  onConfirm?: () => void
}

export function QRPayment({ amount, status = "waiting", onConfirm }: QRPaymentProps) {
  return (
    <div className="space-y-6">
      {/* QR Code Section */}
      <div className="bg-surface rounded-xl p-8 text-center space-y-4">
        <p className="text-sm font-medium text-muted">Scan with QRIS Compatible App</p>

        {/* Placeholder QR Code */}
        <div className="bg-white border-2 border-border rounded-lg p-8 inline-block mx-auto">
          <div className="w-48 h-48 bg-surface flex items-center justify-center rounded-lg">
            <QrCode className="w-24 h-24 text-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold">Amount Due</p>
          <p className="text-3xl font-bold text-primary">${amount.toLocaleString()}</p>
        </div>
      </div>

      {/* Status */}
      <div
        className={`rounded-xl p-4 ${
          status === "paid" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <p className={`text-sm font-medium ${status === "paid" ? "text-green-700" : "text-yellow-700"}`}>
          {status === "paid" ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Payment Received - Thank you!
            </span>
          ) : (
            "Waiting for payment..."
          )}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-900">Payment Instructions:</p>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open your QRIS-compatible payment app</li>
          <li>Select "Scan QR Code"</li>
          <li>Point at the QR code above</li>
          <li>Confirm and complete the payment</li>
        </ol>
      </div>

      {status === "paid" && (
        <Button onClick={onConfirm} className="w-full bg-primary hover:bg-primary-dark">
          Continue to Confirmation
        </Button>
      )}
    </div>
  )
}
