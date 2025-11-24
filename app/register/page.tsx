import { RegisterForm } from "@/components/template/auth/register-form"

export const metadata = {
  title: "Sign Up - Emobo",
  description: "Create your Emobo account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-xl shadow-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted mt-2">Join Emobo and start shopping</p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
