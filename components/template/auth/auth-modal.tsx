"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { useAuthModal } from "@/lib/auth-modal-context";
import Image from "next/image";

export function AuthModal() {
  const { isOpen, view, closeModal } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-surface dark:bg-background border-border/50">
        <div className="bg-slate-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-2xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full -ml-20 -mb-20 blur-2xl opacity-30" />
           <Image
             src="/ic_logo_navbar.svg"
             alt="EMOBO Logo"
             width={120}
             height={40}
             className="relative z-10 brightness-0 invert h-8 w-auto mb-2"
           />
           <p className="text-slate-300 text-xs font-medium relative z-10">
             The Ultimate Laptop Experience
           </p>
        </div>
        <div className="p-6 pt-4">
          <DialogHeader className="mb-4 text-center">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground text-center">
              {view === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
          </DialogHeader>
          {view === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
