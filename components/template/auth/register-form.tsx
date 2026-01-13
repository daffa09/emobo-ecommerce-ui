"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function RegisterForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic
    console.log("Register:", { fullName, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10 h-11"
            required
          />
        </div>
      </div>

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
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-11"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-11"
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4 rounded border-border" required />
        <span className="text-sm text-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:text-primary-dark">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:text-primary-dark">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white h-10">
        Create Account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-dark font-bold underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
