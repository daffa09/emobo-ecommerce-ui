import Link from "next/link";

const brands = [
  { name: "Lenovo", logoText: "LENOVO" },
  { name: "ASUS", logoText: "ASUS" },
  { name: "HP", logoText: "HP" },
  { name: "Acer", logoText: "ACER" },
  { name: "Dell", logoText: "DELL" },
  { name: "MSI", logoText: "MSI" }
];

export function BrandsSection() {
  return (
    <section className="py-24 bg-slate-950 border-y border-slate-800 transition-colors duration-500">
      <div className="container-emobo">
        <p className="text-center text-sm font-bold text-slate-500 tracking-[0.3em] uppercase mb-12">
          Authorized Premium Partners
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <Link key={index} href={`/catalog?brand=${brand.name.toLowerCase()}`}>
              <div className="group flex items-center justify-center transition-smooth">
                <span className="text-2xl font-black italic tracking-tighter text-primary transition-smooth">
                  {brand.logoText}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
