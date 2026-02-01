import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { FeaturedProductsSection } from "./_components/featured-products-section";
import { BrandsSection } from "./_components/brands-section";
import { FeaturesSection } from "./_components/features-section";
import { SalesChartSection } from "./_components/sales-chart-section";
import { PerformanceAnalytics } from "./_components/performance-analytics";
import { WhatsAppButton } from "@/components/template/whatsapp-button";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <div className="bg-slate-50">
        <CategoriesSection />
      </div>
      <FeaturedProductsSection />
      <PerformanceAnalytics />
      <SalesChartSection />
      <BrandsSection />
      <div className="bg-slate-50">
        <FeaturesSection />
      </div>
      <WhatsAppButton />
    </div>
  );
}
