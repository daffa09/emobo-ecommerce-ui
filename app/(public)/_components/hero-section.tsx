import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 lg:py-20">
      <div className="container-emobo">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 border-primary text-primary hover:bg-primary/20">
              🔥 Up to 60% OFF on Selected Laptops
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Best Deal on
              <span className="text-primary block">Premium Laptops</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the latest laptops from top brands with unbeatable prices and official warranty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  Shop Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/catalog?category=deals">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  View All Deals
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 p-8">
              <Image
                src="/lenovo-thinkpad-laptop.jpg"
                alt="Featured Laptop"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
