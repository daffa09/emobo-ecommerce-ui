import { LoginForm } from "@/components/template/auth/login-form"

export const metadata = {
  title: "Sign In - Emobo",
  description: "Sign in to your Emobo account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-xl shadow-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted mt-2">Sign in to your Emobo account</p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
