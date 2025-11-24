import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const categories = [
  { name: "Gaming Laptops", icon: "🎮", count: "45+" },
  { name: "Business Laptops", icon: "💼", count: "60+" },
  { name: "Ultrabooks", icon: "✨", count: "35+" },
  { name: "2-in-1 Convertible", icon: "🔄", count: "25+" },
];

export function CategoriesSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container-emobo">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold">Shop by Category</h2>
          <Link href="/catalog" className="text-primary hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={`/catalog?category=${category.name.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl">{category.icon}</div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} Products</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
