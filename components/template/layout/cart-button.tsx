"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative hover:bg-white/5 transition-smooth rounded-lg">
        <ShoppingCart className="h-5 w-5 text-slate-300" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold border-2 border-background"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
