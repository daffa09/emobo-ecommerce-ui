import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { FeaturedProductsSection } from "./_components/featured-products-section";
import { BrandsSection } from "./_components/brands-section";
import { FeaturesSection } from "./_components/features-section";
import { PerformanceAnalytics } from "./_components/performance-analytics";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
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
