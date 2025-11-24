import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const brands = ["Lenovo", "ASUS", "HP", "Acer", "Dell", "MSI"];

export function BrandsSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container-emobo">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
          Top Laptop Brands
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <Link key={index} href={`/catalog?brand=${brand.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardContent className="p-6 flex items-center justify-center">
                  <span className="font-bold text-lg">{brand}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
