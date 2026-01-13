import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    <div className="bg-background min-h-screen py-24">
      <div className="container-emobo max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-smooth">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center p-12 bg-primary/5 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is here to help you find the perfect laptop.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-white font-medium transition-smooth hover:bg-primary-dark">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
