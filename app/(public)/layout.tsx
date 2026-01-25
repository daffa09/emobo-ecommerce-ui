import { Navbar } from "@/components/template/layout/navbar";
import { Footer } from "@/components/template/layout/footer";
import { Metadata } from "next";

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
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

