import Link from "next/link";
import { Laptop, Briefcase, Zap, Cpu } from "lucide-react";

const categories = [
  { name: "Gaming Laptops", icon: <Zap className="w-8 h-8" />, count: "45+" },
  { name: "Business Laptops", icon: <Briefcase className="w-8 h-8" />, count: "60+" },
  { name: "Workstations", icon: <Cpu className="w-8 h-8" />, count: "35+" },
  { name: "Ultrabooks", icon: <Laptop className="w-8 h-8" />, count: "25+" },
];

export function CategoriesSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container-emobo">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Precision machines tailored for every workflow.</p>
          </div>
          <Link href="/catalog" className="group flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-smooth">
            Explore All Categories <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/catalog?category=${category.name.toLowerCase()}`}>
              <div className="group relative bg-white p-8 rounded-3xl border border-border transition-smooth hover:shadow-2xl hover:border-primary hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 transition-smooth group-hover:bg-primary group-hover:text-white">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-muted-foreground font-medium">{category.count} Products</p>
                <div className="absolute top-8 right-8 text-slate-200 group-hover:text-primary/20 transition-smooth">
                  <Zap className="w-12 h-12 fill-current" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
