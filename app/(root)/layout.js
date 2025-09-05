"use client";
import Navbarblock from "@/components/Navbar";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutesLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center">
        <div className="text-slate-100">Redirecting...</div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <main>
        <Navbarblock />
        {children}
      </main>
    );
  }

  return null;
}
