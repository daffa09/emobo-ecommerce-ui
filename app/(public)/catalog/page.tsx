import { CatalogFilters } from "./_components/catalog-filters";
import { CatalogGrid } from "./_components/catalog-grid";

export default function CatalogPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12">
        <div className="container-emobo">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Laptop Catalog</h1>
          <p className="text-muted-foreground">
            Browse our extensive collection of premium laptops from top brands
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-emobo py-8 lg:py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block">
            <CatalogFilters />
          </aside>

          {/* Products Grid */}
          <main>
            <CatalogGrid />
          </main>
        </div>
      </div>
    </div>
  );
}
