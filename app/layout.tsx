import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
import Script from "next/script"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Emobo - Premium Laptop Store",
  description: "Discover premium laptops from top brands with the best prices and specifications.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
  openGraph: {
    title: "Emobo - Premium Laptop Store",
    description: "Discover premium laptops from top brands with the best prices and specifications.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emobo - Premium Laptop Store",
    description: "Discover premium laptops from top brands with the best prices and specifications.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1D4ED8",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="top-right" />
            <Script
              src="https://app.sandbox.midtrans.com/snap/snap.js"
              data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
              strategy="afterInteractive"
            />
          </CartProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
