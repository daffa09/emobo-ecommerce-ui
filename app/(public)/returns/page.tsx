import { Shield, RotateCcw, Truck, Headphones } from "lucide-react"

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
    <div className="bg-background min-h-screen py-24">
      <div className="container-emobo max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Returns & Warranty</h1>
          <p className="text-muted-foreground text-lg">
            Your peace of mind is our priority. Learn about our commitment to quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {policies.map((policy, i) => (
            <div key={i} className="bg-white p-8 rounded-lg shadow-sm border border-border transition-smooth hover:shadow-md">
              <div className="mb-6">{policy.icon}</div>
              <h2 className="text-xl font-bold mb-3">{policy.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{policy.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-lg p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient bg-linear-to-r from-blue-400 to-blue-200 inline-block">Protection You Can Trust</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                We work directly with brands like ASUS, Lenovo, and HP to ensure every machine we sell is authentic and fully backed by global warranty standards.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Official Authorized Reseller</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Sealed & Genuine Products Only</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Warranty Claim Process</h3>
              <ol className="space-y-4 text-slate-300">
                <li className="flex gap-4">
                  <span className="font-bold text-primary">01.</span>
                  <span>Contact our support team via email or WhatsApp.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">02.</span>
                  <span>Provide your order ID and a description of the issue.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">03.</span>
                  <span>Ship the item back to our facility using our pre-paid label.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">04.</span>
                  <span>Once verified, we'll process your repair, replacement or refund.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
