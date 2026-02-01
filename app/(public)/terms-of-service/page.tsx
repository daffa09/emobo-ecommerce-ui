import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: "Welcome to Emobo. By accessing and using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding to use our services. If you do not agree with these terms, you are not permitted to use our services."
    },
    {
      id: "definitions",
      title: "2. Definitions",
      content: "In these Terms and Conditions, 'We', 'Us', 'Emobo' refers to the operator of this e-commerce platform. 'You', 'User' refers to the individual or entity accessing the services. 'Services' refers to all features and facilities provided by Emobo."
    },
    {
      id: "eligibility",
      title: "3. Eligibility",
      content: "Our services are intended for individuals who are at least 18 years of age or have attained the legal age of majority in their jurisdiction. Users under the age of 18 must obtain permission from a parent or legal guardian to use our services, in accordance with applicable child protection regulations."
    },
    {
      id: "account",
      title: "4. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account information and password. You agree to provide accurate, complete, and up-to-date information. We reserve the right to suspend or terminate your account if any illegal activity or activity harmful to others is detected."
    },
    {
      id: "transactions",
      title: "5. Transactions and Payments",
      content: "All prices listed are in Indonesian Rupiah (IDR). Orders are considered final after payment is verified. Emobo uses secure and licensed third-party payment systems in Indonesia. We reserve the right to cancel orders in case of pricing errors or stock unavailability."
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property Rights",
      content: "All content on this site, including text, graphics, logos, and images, is the property of Emobo or its licensors and is protected by copyright laws in Indonesia. Any use without our prior written consent is prohibited."
    },
    {
      id: "limitation-liability",
      title: "7. Limitation of Liability",
      content: "Emobo is not liable for any indirect losses arising from the use of the services, unless mandated by applicable law. The services are provided 'as is' without any express or implied warranties."
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: "These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Republic Indonesia, including the Law on Electronic Information and Transactions (UU ITE). Any disputes arising shall be resolved through amicable settlement, and if not reached, shall be submitted to the competent District Court."
    },
    {
      id: "changes",
      title: "9. Changes to Terms",
      content: "We reserve the right to update these Terms and Conditions at any time. Changes will be effective immediately upon publication on this site. Continued use after changes constitutes your agreement."
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-24 text-foreground dark:bg-slate-950">
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="container-emobo relative z-10">
          <div className="flex items-center gap-2 text-primary-light mb-4 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Terms and Conditions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms and Conditions</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Rules for using the Emobo platform. Last updated: February 1, 2026.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-emobo">
          <div className="grid lg:grid-cols-4 gap-12 text-foreground">
            <aside className="lg:col-span-1 hidden lg:block sticky top-24 h-fit">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <main className="lg:col-span-3 prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-8 md:p-12 shadow-sm">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="mb-12 last:mb-0">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{section.title}</h2>
                    <p className="text-muted-foreground dark:text-slate-400 leading-relaxed text-lg">
                      {section.content}
                    </p>
                  </div>
                ))}

                <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-3 dark:text-white">Contact Us</h3>
                  <p className="text-muted-foreground dark:text-slate-400 mb-1">
                    If you have any questions regarding these Terms and Conditions, please contact our team:
                  </p>
                  <p className="font-semibold text-primary">admin@daffathan-labs.my.id</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
