"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const error = searchParams.get("error");
      if (error) {
        router.replace("/login"); // canceled or failed → back to login
        return;
      }

      // If we have an OAuth code, exchange it for a session
      const code = searchParams.get("code");
      if (code) {
        const { error: exErr } = await supabase.auth.exchangeCodeForSession({
          code,
        });
        if (exErr) {
          router.replace("/login");
          return;
        }
        router.replace("/dashboard");
        return;
      }

      // Fallback: check if a session already exists (e.g., refresh)
      const { data } = await supabase.auth.getSession();
      if (data?.session) router.replace("/dashboard");
      else router.replace("/login");
    };

    run();
  }, [router, searchParams]);

  return null; // nothing to render, instantly redirects
}
