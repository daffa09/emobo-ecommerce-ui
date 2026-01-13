import Link from "next/link";
import { ProductCard } from "./product-card";
import { Sparkles } from "lucide-react";

const featuredLaptops = [
  {
    id: 1,
    name: "Lenovo ThinkPad X1 Carbon",
    price: "19500000",
    image: "/lenovo-thinkpad-laptop.jpg",
    rating: 4.8,
    reviews: 234,
    discount: "25%",
    specs: ["Intel i7", "16GB RAM", "512GB SSD"]
  },
  {
    id: 2,
    name: "ASUS Vivobook Pro",
    price: "13500000",
    image: "/asus-vivobook-laptop.jpg",
    rating: 4.6,
    reviews: 189,
    discount: "15%",
    specs: ["AMD Ryzen 7", "8GB RAM", "512GB SSD"]
  },
  {
    id: 3,
    name: "HP Pavilion 15",
    price: "11250000",
    image: "/hp-pavilion-laptop.jpg",
    rating: 4.5,
    reviews: 156,
    discount: "20%",
    specs: ["Intel i5", "8GB RAM", "256GB SSD"]
  },
  {
    id: 4,
    name: "Acer Swift 3",
    price: "9750000",
    image: "/acer-swift-laptop.jpg",
    rating: 4.7,
    reviews: 201,
    discount: "30%",
    specs: ["Intel i5", "8GB RAM", "512GB SSD"]
  }
];

export function FeaturedProductsSection() {
  return (
    <section className="py-24">
      <div className="container-emobo">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> Featured Collection
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            Curated <span className="text-primary italic">High-Performance</span> Selection
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our handpicked premium laptops that blend power with sophisticated design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredLaptops.map((laptop, i) => (
            <div key={laptop.id} className="animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              <ProductCard {...laptop} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/catalog">
            <button className="px-12 py-4 bg-slate-900 text-white font-bold rounded-full transition-smooth hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1">
              View Full Catalog
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
