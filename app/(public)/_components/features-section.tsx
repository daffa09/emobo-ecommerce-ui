import { Cpu, Battery, Monitor } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-emobo">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Latest Technology</h3>
              <p className="text-sm text-muted-foreground">
                All laptops feature the newest processors and hardware
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Battery className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Official Warranty</h3>
              <p className="text-sm text-muted-foreground">
                Guaranteed authentic products with manufacturer warranty
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Professional technical support and after-sales service
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
