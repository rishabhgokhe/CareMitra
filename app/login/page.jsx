"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

import LoginForm from "../../components/authForm/LoginForm";

import ThemeToggle from "@/components/elements/ThemeToggle";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400/30 border-t-gray-400 dark:border-white/30 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 bg-[url('/svgs/noise.svg')] opacity-10" />

      <div className="relative z-10 w-full max-w-sm md:max-w-3xl px-4">
        <div className="fixed right-5 top-5">
          <ThemeToggle />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
