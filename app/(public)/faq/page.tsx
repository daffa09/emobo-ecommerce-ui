import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronRight, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      q: "How long does shipping take?",
      a: "We offer express next-day delivery for major cities. Standard shipping typically takes 2-4 business days depending on your location."
    },
    {
      q: "Are the laptops brand new or refurbished?",
      a: "At Emobo, we only sell brand new, genuine products with full manufacturer warranties. We do not sell refurbished or used laptops."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, bank transfers, and various digital payment methods including QRIS and GoPay."
    },
    {
      q: "Can I customize the specifications of my laptop?",
      a: "The laptops we sell come in standard manufacturer configurations. However, for certain models, we offer RAM and SSD upgrade services performed by certified technicians."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day easy return policy for products that arrive damaged or do not match the specifications. Please see our Return & Warranty page for full details."
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
            <span className="text-slate-400">FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked <span className="text-primary italic">Questions</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Find answers to common questions about our products, shipping, and services.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-emobo max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 md:p-12">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b dark:border-slate-800 last:border-0 border-slate-100">
                    <AccordionTrigger className="text-left text-lg font-bold py-6 hover:text-primary transition-smooth dark:text-white dark:no-underline">
                      <div className="flex items-center gap-4">
                        <HelpCircle className="w-5 h-5 text-primary shrink-0 opacity-70" />
                        {faq.q}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground dark:text-slate-400 text-lg leading-relaxed pb-8 pl-9">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="mt-16 text-center p-12 bg-primary/5 dark:bg-slate-900 rounded-3xl border border-primary/10 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Still have questions?</h2>
            <p className="text-muted-foreground dark:text-slate-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Our support team is ready to help you find the best tech for your needs.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-white font-bold transition-smooth hover:bg-primary-dark shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 gap-2">
              Contact Support <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
