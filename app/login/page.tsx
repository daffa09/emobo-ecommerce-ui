import { LoginForm } from "@/components/template/auth/login-form"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Sign In - Emobo",
  description: "Sign in to your Emobo account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Branding & Info */}
      <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center p-12 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full -ml-40 -mb-40 blur-3xl" />

        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="inline-block mb-12">
            <Image
              src="/ic_logo_navbar.svg"
              alt="EMOBO Logo"
              width={160}
              height={50}
              className="brightness-0 invert h-12 w-auto"
            />
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The Ultimate Laptop <br />
            <span className="text-blue-200">Experience Awaits.</span>
          </h1>

          <p className="text-blue-50 text-xl mb-12 leading-relaxed">
            Elevate your workflow with premium computing solutions curated for excellence.
          </p>

          <div className="space-y-6">
            {[
              "Exclusive premium collections",
              "Unmatched performance laptops",
              "Secure and seamless transactions"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-smooth group-hover:bg-white/30">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-lg font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-blue-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p className="text-white/80 text-sm">
                Joined by <span className="text-white font-bold">10k+</span> professionals worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-1 items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ic_logo_navbar.svg"
                alt="EMOBO Logo"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0"
              />
            </Link>
          </div>

          <div className="bg-background rounded-2xl shadow-xl p-10 space-y-8 border border-border">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
              <p className="text-muted-foreground mt-2 font-medium">
                New to Emobo? <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">Create an account</Link>
              </p>
            </div>

            <LoginForm />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2025 Emobo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
