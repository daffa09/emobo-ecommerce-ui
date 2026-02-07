"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { registerUser } from "@/lib/auth-service"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Password tidak cocok!")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await registerUser(email, password, fullName)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "Gagal melakukan pendaftaran")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Cek Email Kamu!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Link konfirmasi sudah dikirim ke <span className="font-bold text-foreground">{email}</span>.
            Silakan klik link tersebut untuk mengaktifkan akun kamu sebelum login.
          </p>
        </div>
        <Button asChild className="w-full bg-primary hover:bg-primary-dark transition-smooth text-white">
          <Link href="/login">Kembali ke Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <PasswordInput
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-border"
          required
          disabled={isLoading}
        />
        <span className="text-sm text-foreground">
          I agree to the{" "}
          <Link href="/terms-of-service" className="text-primary hover:text-primary-dark underline-offset-4 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-primary hover:text-primary-dark underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white h-11 rounded-lg transition-smooth shadow-lg shadow-primary/20"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-dark font-bold underline-offset-4 hover:underline transition-colors">
          Login
        </Link>
      </p>
    </form>
  )
}
