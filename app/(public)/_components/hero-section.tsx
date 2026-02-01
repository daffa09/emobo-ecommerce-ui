import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-48 -mb-48 opacity-60" />

      <div className="container-emobo relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border-white/10 text-blue-200 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Premium Laptop Collections 2026</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Engineered for <br />
              <span className="text-gradient">Professional Excellence.</span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed">
              Experience the pinnacle of computing power with our curated selection of high-performance laptops. Unleash your potential with Emobo.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link href="/catalog">
                <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-lg gap-2 shadow-lg shadow-primary/20 transition-smooth hover:scale-105">
                  Explore Catalog <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-lg border-white/20 text-white hover:bg-white/5 transition-smooth">
                  View Special Deals
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">500+</span>
                <span className="text-sm text-slate-500">Models Available</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-sm text-slate-500">Expert Support</span>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden glass-card p-4 border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent pointer-events-none" />
              <div className="relative h-full w-full rounded-lg overflow-hidden">
                <Image
                  src="/lenovo-thinkpad-laptop.jpg"
                  alt="Featured High Performance Laptop"
                  fill
                  className="object-cover transform hover:scale-110 transition-smooth duration-700"
                />
              </div>
            </div>

            {/* Floating Info Badge */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-lg border-white/10 shadow-2xl animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">New Arrival</p>
                  <p className="text-white font-bold">Zenbook Duo 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
