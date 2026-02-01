"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { resetUserPassword } from "@/lib/api-service";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Token reset tidak valid atau hilang.");
    }
  }, [token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return toast.error("Token reset tidak valid.");
    if (password !== confirmPassword) return toast.error("Password tidak cocok.");
    if (password.length < 8) return toast.error("Password minimal 8 karakter.");

    setIsLoading(true);

    try {
      await resetUserPassword({ token, password });
      setIsSuccess(true);
      toast.success("Password berhasil diperbarui!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Gagal mereset password");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-destructive">Invalid Link</h3>
          <p className="text-muted-foreground">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Button className="w-full h-12 rounded-xl" onClick={() => router.push("/forgot-password")}>
          Back to Forgot Password
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Setup New Password</h1>
        <p className="text-muted-foreground">Please enter your new password below. Make sure it's strong and secure.</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-6 space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-muted-foreground">
              Your password has been reset successfully. Redirecting you to login page...
            </p>
          </div>
          <Button className="w-full h-12 rounded-xl" onClick={() => router.push("/login")}>
            Login Now
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" size="sm" className="font-bold">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" size="sm" className="font-bold">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-primary/5 border border-slate-100 dark:border-white/5 overflow-hidden">
          <Suspense fallback={
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Checking token...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
