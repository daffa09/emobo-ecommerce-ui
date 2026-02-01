import { RegisterForm } from "@/components/template/auth/register-form"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, Zap, Heart } from "lucide-react"

export const metadata = {
  title: "Register - Emobo",
  description: "Create your Emobo account",
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">

      <div className="flex flex-1">
        {/* Left Side: Branding & Info (Originally Right Side) */}
        <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-primary/20 rounded-full -ml-40 -mt-40 blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full -mr-40 -mb-40 blur-3xl opacity-50" />

          <div className="relative z-10 w-full max-w-lg text-white">
            <Link href="/" className="inline-block mb-12">
              <Image
                src="/ic_logo_navbar.svg"
                alt="EMOBO Logo"
                width={160}
                height={50}
                className="brightness-0 invert h-12 w-auto"
              />
            </Link>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Start Your Journey <br />
              <span className="text-primary italic">to Professionalism.</span>
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "Premium Warranty",
                  desc: "Every purchase comes with a comprehensive protection plan for your peace of mind."
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Next-Day Delivery",
                  desc: "Get your powerful new machine delivered to your doorstep with our express shipping."
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Expert Support",
                  desc: "Our technical experts are available 24/7 to help you optimize your laptop's performance."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-lg bg-white/5 border border-white/10 transition-smooth hover:bg-white/10">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form (Originally Left Side) */}
        <div className="flex flex-1 items-center justify-center p-8 bg-surface dark:bg-background transition-colors duration-500">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/ic_logo_navbar.svg"
                  alt="EMOBO Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto dark:brightness-0 dark:invert transition-all"
                />
              </Link>
            </div>

            <div className="bg-background rounded-lg shadow-xl p-10 space-y-8 border border-border">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Join Emobo</h1>
              </div>

              <RegisterForm />
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              By signing up, you agree to our <Link href="/terms-of-service" className="hover:underline text-primary">Terms of Service</Link> and <Link href="/privacy-policy" className="hover:underline text-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
