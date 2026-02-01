"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { fetchAdminContact } from "@/lib/api-service";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const getContact = async () => {
      try {
        const data = await fetchAdminContact();
        // Remove non-numeric characters for wa.me link
        const cleanPhone = data.phone.replace(/\D/g, '');
        // If it starts with 0, replace with 62 (assuming Indonesia as per context)
        const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;
        setPhone(waPhone);
      } catch (error) {
        console.error("Failed to fetch admin contact:", error);
      }
    };
    getContact();
  }, []);

  if (!phone) return null;

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] md:h-16 md:w-16"
      )}
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={32} fill="currentColor" className="text-white" />
      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold md:h-6 md:w-6 md:text-xs">
        1
      </span>
    </a>
  );
}
