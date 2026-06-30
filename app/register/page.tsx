"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/lib/auth-modal-context";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { openModal } = useAuthModal();

  useEffect(() => {
    router.replace("/");
    // Open modal after navigation
    setTimeout(() => openModal("register"), 100);
  }, [router, openModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
