"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { fetchAdminContact } from "@/lib/api-service";
import { cn } from "@/lib/utils";

export function WhatsAppCTA() {
  const [adminPhone, setAdminPhone] = useState<string | null>(null);

  useEffect(() => {
    async function getContact() {
      try {
        const data = await fetchAdminContact();
        setAdminPhone(data.phone);
      } catch (error) {
        console.error("Failed to fetch admin contact:", error);
      }
    }
    getContact();
  }, []);

  if (!adminPhone) return null;

  const waLink = `https://wa.me/${adminPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Emobo Support, I have a question about my order...")}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3 transition-all duration-500 ease-out hover:pr-5"
    >
      {/* Label Tooltip */}
      <span className="bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap shadow-2xl">
        Need Help? Chat with us
      </span>

      {/* Button with Pulse */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25 group-hover:opacity-40" />
        <div className="relative w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 border-4 border-black">
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>
      </div>
    </a>
  );
}
