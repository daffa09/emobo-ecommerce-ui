import { ChevronRight, Eye, Shield, Lock, Bell } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "data-collection",
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "1. Data We Collect",
      content: "We collect information that you provide directly to us when you register, make a purchase, or interact with our services. This includes your name, shipping address, phone number, email address, and payment information. We also collect technical data such as your IP address, device type, and browsing history through cookies."
    },
    {
      id: "data-usage",
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "2. How We Use Your Data",
      content: "We use your data to: (a) Process orders and deliveries, (b) Communicate about your account or transactions, (c) Provide customer support, (d) Personalize your shopping experience, and (e) Comply with legal and regulatory obligations in Indonesia."
    },
    {
      id: "data-storage",
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "3. Data Retention and Security",
      content: "We store your personal data only as long as necessary for the purposes stated above. We implement strict technical and organizational security measures to protect your data from unauthorized access, loss, or disclosure, in accordance with the Indonesian Personal Data Protection (UU PDP) standards."
    },
    {
      id: "rights",
      icon: <Bell className="w-6 h-6 text-primary" />,
      title: "4. Your Rights (PDP Compliance)",
      content: "As a user, you have rights over your data, including the right to: (a) Access your information, (b) Correct inaccurate data, (c) Delete data (Right to be Forgotten), (d) Withdraw consent for marketing, and (e) Obtain a copy of your data (Data Portability)."
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-24 text-foreground dark:bg-slate-950">
      {/* Hero Section */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="container-emobo relative z-10">
          <div className="flex items-center gap-2 text-primary-light mb-4 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-400">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 italic">Privacy <span className="text-primary italic">Policy</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Our commitment to protecting and managing your personal data in accordance with Indonesian Personal Data Protection (UU PDP) laws.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-emobo">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="p-8 md:p-12 border-b border-border bg-slate-50/50 dark:bg-slate-800/30">
                <p className="text-muted-foreground italic text-sm">
                  Last updated: February 1, 2026. By using our services, you are deemed to have read and agreed to the data practices described in this policy.
                </p>
              </div>

              <div className="p-8 md:p-12 space-y-12">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="flex gap-6 group">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                      {section.icon}
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold dark:text-white">{section.title}</h2>
                      <p className="text-muted-foreground dark:text-slate-400 leading-relaxed text-lg">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-12" />

                <div className="p-8 bg-primary/5 dark:bg-slate-800 rounded-2xl border border-primary/10 dark:border-slate-700">
                  <h3 className="text-xl font-bold mb-4 dark:text-white">Contact & Data Protection Officer</h3>
                  <p className="text-muted-foreground dark:text-slate-400 mb-4 text-lg">
                    If you wish to exercise your data rights or have questions about our data practices, please contact our Data Protection Officer (DPO):
                  </p>
                  <div className="space-y-2">
                    <p className="font-bold text-primary text-xl">admin@daffathan-labs.my.id</p>
                    <p className="text-sm text-slate-500">Subject: Data Privacy Request</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
