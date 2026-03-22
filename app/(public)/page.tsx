import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { FeaturedProductsSection } from "./_components/featured-products-section";
import { BrandsSection } from "./_components/brands-section";
import { FeaturesSection } from "./_components/features-section";
import { fetchPublicProducts } from "@/lib/api-service";

export default async function HomePage() {
  // Fetch the latest product for the Hero section
  let newArrival = null;
  try {
    const response = await fetchPublicProducts({ limit: 1, sortBy: "newest" });
    if (response.products && response.products.length > 0) {
      newArrival = response.products[0];
    }
  } catch (error) {
    console.error("Failed to fetch new arrival:", error);
  }

  return (
    <div className="flex flex-col gap-0">
      <HeroSection newArrival={newArrival} />
      <div className="bg-slate-50">
        <CategoriesSection />
      </div>
      <FeaturedProductsSection
        sortBy="newest"
        title={<>Fresh <span className="text-primary italic">New Arrivals</span></>}
        subtitle="Be the first to experience the latest in computing innovation."
      />
      {/* <PerformanceAnalytics /> - Hidden until BE data is available */}
      <BrandsSection />
      <div className="bg-slate-50">
        <FeaturesSection />
      </div>
    </div>
  );
}

