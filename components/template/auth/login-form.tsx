"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth-service"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginUser(email, password)
      console.log("Login Success:", result)

      // Store token and user info
      localStorage.setItem("emobo-token", result.data.access_token)
      localStorage.setItem("emobo-user", JSON.stringify(result.data.user))

      // Set cookie for middleware
      document.cookie = `emobo-role=${result.data.user.role}; path=/; max-age=604800; samesite=lax`;
      document.cookie = `emobo-token=${result.data.access_token}; path=/; max-age=604800; samesite=lax`;

      // Redirect based on role
      router.push(result.data.user.role === "ADMIN" ? "/admin" : "/customer")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-11"
            required
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
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-border" />
          <span className="text-foreground">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-primary hover:text-primary-dark transition-smooth">
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white h-10 rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground font-medium">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:text-primary-dark font-bold underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
