import { createSupabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  // If OAuth was canceled or errored, redirect to login
  if (error) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  // If we have a code, exchange it for a session (server-side)
  if (code) {
    const supabase = await createSupabaseServer();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(new URL("/login", requestUrl.origin));
    }

    // Session is now set in cookies—redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  }

  // No code and no error—shouldn't happen, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
