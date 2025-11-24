import Link from "next/link";
import { ProductCard } from "./product-card";

const featuredLaptops = [
  {
    id: 1,
    name: "Lenovo ThinkPad X1 Carbon",
    price: "$1,299",
    image: "/lenovo-thinkpad-laptop.jpg",
    rating: 4.8,
    reviews: 234,
    discount: "25%",
    specs: ["Intel i7", "16GB RAM", "512GB SSD"]
  },
  {
    id: 2,
    name: "ASUS Vivobook Pro",
    price: "$899",
    image: "/asus-vivobook-laptop.jpg",
    rating: 4.6,
    reviews: 189,
    discount: "15%",
    specs: ["AMD Ryzen 7", "8GB RAM", "512GB SSD"]
  },
  {
    id: 3,
    name: "HP Pavilion 15",
    price: "$749",
    image: "/hp-pavilion-laptop.jpg",
    rating: 4.5,
    reviews: 156,
    discount: "20%",
    specs: ["Intel i5", "8GB RAM", "256GB SSD"]
  },
  {
    id: 4,
    name: "Acer Swift 3",
    price: "$649",
    image: "/acer-swift-laptop.jpg",
    rating: 4.7,
    reviews: 201,
    discount: "30%",
    specs: ["Intel i5", "8GB RAM", "512GB SSD"]
  }
];

export function FeaturedProductsSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-emobo">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Grab the Best Deal on <span className="text-primary">Premium Laptops</span>
          </h2>
          <Link href="/catalog" className="text-primary hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLaptops.map((laptop) => (
            <ProductCard key={laptop.id} {...laptop} />
          ))}
        </div>
      </div>
    </section>
  );
}
