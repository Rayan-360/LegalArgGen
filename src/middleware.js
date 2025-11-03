import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function middleware(req) {
  const cookieStore = await cookies(); // this is async-safe

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll().map(c => ({
          name: c.name,
          value: c.value,
          options: { path: "/" },
        })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl.clone();

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (user && (url.pathname === "/" || url.pathname === "/login" || url.pathname === "/signup")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If no user and trying to access protected pages, redirect to home
  if (!user && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};
