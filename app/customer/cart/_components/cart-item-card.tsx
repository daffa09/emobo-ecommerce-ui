"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/cart-context";
import Link from "next/link";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/products/${item.id}`} className="relative h-24 w-24 rounded-md overflow-hidden bg-muted shrink-0 block hover:opacity-80 transition-opacity">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </Link>

          <div className="flex-1 space-y-2">
            <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors inline-block">
              <h3 className="font-semibold line-clamp-2">{item.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
            <p className="text-lg font-bold text-primary">
              {formatPrice(item.price)}
            </p>
          </div>

          <div className="flex flex-col items-end justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <p className="text-sm font-semibold">
              Subtotal: {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
