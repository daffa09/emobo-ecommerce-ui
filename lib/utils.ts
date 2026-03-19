import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getImageUrl(url?: string): string {
  if (!url) return "/no-image.svg";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`;
}
