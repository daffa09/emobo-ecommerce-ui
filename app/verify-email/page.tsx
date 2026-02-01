"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { verifyEmail } from "@/lib/auth-service"
import { CheckCircle, XCircle, Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token verifikasi tidak ditemukan.")
      return
    }

    const verify = async () => {
      try {
        await verifyEmail(token)
        setStatus("success")
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "Gagal memverifikasi email.")
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-xl p-10 md:p-16 space-y-8">
        <Link href="/" className="inline-block mb-4">
          <div className="text-3xl font-black text-slate-900 tracking-tighter italic">
            EMOBO<span className="text-primary italic">.</span>
          </div>
        </Link>

        {status === "loading" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Memverifikasi...</h1>
              <p className="text-muted-foreground">Sabar ya bos, lagi dicek datanya.</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Berhasil!</h1>
              <p className="text-muted-foreground text-lg">
                Email kamu udah dikonfirmasi. Sekarang kamu bisa login dan mulai belanja laptop premium.
              </p>
            </div>
            <Button asChild className="w-full bg-primary hover:bg-primary-dark transition-smooth h-12 text-lg font-bold shadow-lg shadow-primary/20">
              <Link href="/login" className="flex items-center justify-center gap-2">
                Login Sekarang <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-red-600">Gagal Verifikasi</h1>
              <p className="text-muted-foreground">{message}</p>
            </div>
            <div className="grid gap-4">
              <Button asChild variant="outline" className="w-full h-12 font-bold">
                <Link href="/contact">Hubungi Support</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/register">Coba Daftar Lagi</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        Loading...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
