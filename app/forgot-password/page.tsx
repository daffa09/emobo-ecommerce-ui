"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { requestForgotPassword } from "@/lib/api-service";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestForgotPassword(email);
      setIsSubmitted(true);
      toast.success("Link reset password telah dikirim!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses permintaan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-primary/5 border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">Don't worry, it happens. Enter your email and we'll send you a link to reset your password.</p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Check your email</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to <span className="font-bold text-foreground">{email}</span>.
                  </p>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setIsSubmitted(false)}>
                  Didn't receive the email? Try again
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Reset Link"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
