import { Navbar } from "@/components/template/layout/navbar";
import { Footer } from "@/components/template/layout/footer";
import { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Emobo - Premium Gadget Store",
  description: "Your one-stop shop for premium gadgets and accessories.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}

