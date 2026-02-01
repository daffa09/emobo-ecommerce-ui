import { LoginForm } from "@/components/template/auth/login-form"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Login - Emobo",
  description: "Login to your Emobo account",
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">

      <div className="flex flex-1">
        {/* Left Side: Branding & Info (Originally Right Side) */}
        <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center p-12 overflow-hidden border-r border-white/5">
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full -mr-40 -mt-40 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -ml-40 -mb-40 blur-3xl opacity-30" />

          <div className="relative z-10 w-full max-w-lg">
            <Link href="/" className="inline-block mb-12 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/ic_logo_navbar.svg"
                alt="EMOBO Logo"
                width={160}
                height={50}
                className="brightness-0 invert h-12 w-auto"
              />
            </Link>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              The Ultimate Laptop <br />
              <span className="text-primary-light italic">Experience Awaits.</span>
            </h1>

            <p className="text-slate-300 text-xl mb-12 leading-relaxed font-medium">
              Elevate your workflow with premium computing solutions curated for excellence.
            </p>

            <div className="space-y-6">
              {[
                "Exclusive premium collections",
                "Unmatched performance laptops",
                "Secure and seamless transactions"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                    <CheckCircle2 className="w-5 h-5 text-primary-light" />
                  </div>
                  <span className="text-slate-200 text-lg font-medium tracking-wide">{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Side: Form (Originally Left Side) */}
        <div className="flex flex-1 items-center justify-center p-8 bg-surface dark:bg-background transition-colors duration-500">
          <div className="w-full max-w-sm">
            <div className="lg:hidden text-center mb-10">
              <Link href="/" className="inline-block transform hover:scale-105 transition-transform">
                <Image
                  src="/ic_logo_navbar.svg"
                  alt="EMOBO Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto dark:brightness-0 dark:invert transition-all"
                />
              </Link>
            </div>

            <div className="bg-card glass shadow-2xl p-8 sm:p-10 space-y-8 rounded-lg border border-border/50">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Welcome Back</h2>
              </div>

              <LoginForm />
            </div>

            <p className="text-center text-xs text-muted-foreground mt-10 tracking-widest uppercase font-bold opacity-50">
              © 2026 Emobo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
