"use client"
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      router.push("/login"); // canceled login → back to login
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard"); // success → dashboard
      else router.push("/login"); // fallback
    });
  }, [router, searchParams]);

  return null; // nothing to render, instantly redirects
}
