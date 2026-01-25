export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="container-emobo relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">Redefining the <br /> <span className="text-primary italic">Laptop Shopping Experience.</span></h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              Emobo was born from a simple realization: finding the perfect professional laptop should be as premium as the machine itself.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-emobo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                We believe that technology should empower, not frustrate. That's why we curate only the highest performing laptops from global brands like ASUS, Lenovo, and Apple.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our mission is to provide professionals, creators, and students with the precision tools they need to bring their boldest ideas to life.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5k+</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Happy Clients</div>
                </div>
              </div>
              <div className="aspect-square bg-primary/5 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Brands</div>
                </div>
              </div>
              <div className="aspect-square bg-primary/5 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24h</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Expert Support</div>
                </div>
              </div>
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Genuine Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
