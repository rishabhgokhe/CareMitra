"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import LoginForm from "../../components/authForm/LoginForm";

export default function Page() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[url('/svgs/noise.svg')] opacity-10" />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl px-4">
        <LoginForm />
      </div>
    </div>
  );
}
