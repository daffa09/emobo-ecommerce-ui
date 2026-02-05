import { Package, Truck } from "lucide-react"
import { formatIDR } from "@/lib/utils"

interface OrderItem {
  id: string | number
  name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  shippingCost?: number
  tax?: number
}

export function OrderSummary({ items, shippingCost = 0, tax = 0 }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + (shippingCost || 0) + (tax || 0)

  return (
    <div className="bg-surface rounded-xl p-6 space-y-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-muted">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-foreground">{formatIDR(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="text-foreground">{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm items-center gap-2">
          <span className="flex items-center gap-1 text-muted">
            <Truck className="w-4 h-4" /> Shipping
          </span>
          <span className="text-foreground">{shippingCost > 0 ? formatIDR(shippingCost) : "-"}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">Tax</span>
            <span className="text-foreground">{formatIDR(tax)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Total</span>
        <span className="text-2xl font-bold text-primary">{formatIDR(total)}</span>
      </div>
    </div>
  )
}

