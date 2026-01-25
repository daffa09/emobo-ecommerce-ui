import { CatalogGrid } from "../catalog/_components/catalog-grid"

export default function DealsPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full -ml-40 -mb-40 blur-3xl opacity-50" />

        <div className="container-emobo relative z-10 text-center">
          <div className="inline-block bg-primary/20 text-blue-200 px-4 py-1 rounded-lg text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm border border-blue-400/20">
            Limited Time Offers
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Special Deals</h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto leading-relaxed">
            Premium performance at exceptional value. Discover our handpicked selection of professional laptops on sale.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-emobo">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold">Today's Highlights</h2>
              <p className="text-muted-foreground mt-2">Offers valid until stock lasts</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-6 py-2 bg-white rounded-lg shadow-sm text-sm font-bold">Best Sellers</button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">Highest Discount</button>
            </div>
          </div>

          {/* Reusing CatalogGrid but we might want filters for deals specifically in a real app */}
          <div className="min-h-[400px]">
            <CatalogGrid />
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container-emobo">
          <div className="bg-white rounded-lg p-12 md:p-20 shadow-xl border border-border flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="flex-1 z-10">
              <h2 className="text-4xl font-bold mb-6">Never miss a <br /> <span className="text-primary italic">Great Opportunity.</span></h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Join our premium newsletter to receive early access to new collections and exclusive discounts tailored for professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-100 border-none rounded-lg px-8 py-4 focus:ring-2 focus:ring-primary transition-smooth"
                />
                <button className="bg-primary text-white rounded-lg px-10 py-4 font-bold transition-smooth hover:bg-primary-dark shadow-lg shadow-primary/20">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex-1 relative h-[300px] w-full hidden md:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              {/* Simplified visual representative */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-50 rounded-lg p-6 shadow-soft border border-border animate-float">
                  <div className="w-12 h-1 bg-primary rounded-full mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="bg-slate-50 rounded-lg p-6 shadow-soft border border-border animate-float mt-12" style={{ animationDelay: '1s' }}>
                  <div className="w-12 h-1 bg-primary rounded-full mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
