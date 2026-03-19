import { CatalogFilters } from "@/app/(public)/catalog/_components/catalog-filters";
import { CatalogGrid } from "@/app/(public)/catalog/_components/catalog-grid";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function CustomerCatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Browse Catalog</h1>
        <p className="text-muted-foreground mt-1">Find your perfect laptop from our collection.</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-fit">
            <CatalogFilters />
          </div>
        </aside>

        {/* Products Grid */}
        <main>
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }>
            <CatalogGrid />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
