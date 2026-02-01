"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function CartButton() {
  const { items, itemCount, totalPrice, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col gap-0 border-l-white/5 bg-slate-950/95 backdrop-blur-xl">
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="text-xl font-bold tracking-tight text-white">Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10 text-slate-700" />
              </div>
              <p className="text-xl font-bold text-white">Your cart is empty</p>
              <p className="text-sm text-slate-400 mt-2 max-w-[200px]">
                Add some premium laptops to your collection to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="group relative flex gap-5 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-smooth">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                      <Image
                        src={item.image || "/no-image.svg"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-smooth duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/no-image.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col pt-1">
                      <h4 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-lg font-black text-primary mt-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Remove</span>
                      <span className="text-lg leading-none">×</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900/50 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 font-medium">Estimated Total:</span>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-white">
                      {totalPrice === 0 ? "Rp 0" : formatPrice(totalPrice)}
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Free Shipping Included</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/cart" className="block w-full">
                    <Button className="w-full h-14 rounded-xl font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 text-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="w-full h-12 text-slate-400 font-bold hover:text-white hover:bg-white/5 rounded-xl">
                      Continue Shopping
                    </Button>
                  </SheetTrigger>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
