"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-service";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleLogout() {
      try {
        await logoutUser();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        router.push("/login");
        router.refresh();
      }
    }

    handleLogout();
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-slate-400 font-medium">Signing you out...</p>
    </div>
  );
}
