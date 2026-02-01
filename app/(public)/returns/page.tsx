import { Shield, RotateCcw, Truck, Headphones, ChevronRight, Check } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  const policies = [
    {
      icon: <RotateCcw className="w-8 h-8 text-primary" />,
      title: "7-Day Easy Returns",
      desc: "If your product is defective or doesn't match the description, you can return it within 7 days of delivery for a full refund or exchange."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Manufacturer Warranty",
      desc: "All laptops sold at Emobo are covered by official manufacturer warranties, typically ranging from 1 to 3 years depending on the brand."
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Free Return Shipping",
      desc: "We cover the return shipping costs for all valid warranty claims and defective product returns within the 7-day window."
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary" />,
      title: "Lifetime Tech Support",
      desc: "Get free basic technical support for the lifetime of your device. Our experts are just a message away."
    }
  ]

  return (
    <div className="bg-background min-h-screen pb-24 text-foreground dark:bg-slate-950">
      {/* Hero Section */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="container-emobo relative z-10">
          <div className="flex items-center gap-2 text-primary-light mb-4 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Returns & Warranty</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 italic">Returns & <span className="text-primary italic">Warranty</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Your peace of mind is our priority. Learn about our commitment to quality, authenticity, and customer satisfaction.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-emobo max-w-6xl mx-auto">
          {/* Main Policies Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {policies.map((policy, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-border transition-smooth hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 group">
                <div className="mb-8 w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary/10">
                  {policy.icon}
                </div>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{policy.title}</h2>
                <p className="text-muted-foreground dark:text-slate-400 leading-relaxed text-lg">{policy.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Info Card */}
          <div className="bg-slate-900 dark:bg-slate-900/50 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-3xl opacity-40" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1.5 bg-primary/20 rounded-full text-primary-light font-bold text-xs tracking-wider uppercase mb-6">
                  Authenticity Guarantee
                </div>
                <h2 className="text-4xl font-bold mb-8 leading-tight">Protection You <br /><span className="text-primary italic">Can Trust</span></h2>
                <p className="text-slate-400 text-xl leading-relaxed mb-10">
                  We work directly with industrial giants like ASUS, Lenovo, and HP to ensure every machine we sell is 100% authentic and fully backed by global warranty standards.
                </p>
                <div className="space-y-5">
                  {[
                    "Official Authorized Reseller",
                    "Brand New Sealed & Genuine Products",
                    "Global Service Network Support",
                    "Verified Hardware Components"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-primary font-bold" />
                      </div>
                      <span className="text-slate-200 text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-inner">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  Warranty Claim Process
                </h3>
                <ol className="space-y-8">
                  {[
                    { step: "01", text: "Contact our support team via email or WhatsApp for a quick diagnostics." },
                    { step: "02", text: "Provide your order ID and a brief description/video of the technical issue." },
                    { step: "03", text: "Ship the item back or bring it to the nearest authorized service center." },
                    { step: "04", text: "Receive your repaired, replaced, or refunded item within 7-14 business days." }
                  ].map((s, i) => (
                    <li key={i} className="flex gap-6 relative group">
                      <span className="font-black text-3xl text-slate-800 transition-colors group-hover:text-primary/30 tabular-nums">{s.step}</span>
                      <span className="text-slate-300 text-lg leading-snug pt-1">{s.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
