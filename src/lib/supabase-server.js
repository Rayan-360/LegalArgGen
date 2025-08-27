"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: async (cookiesToSet) => {
          const c = await cookies();
          cookiesToSet.forEach(({ name, value, options }) => {
            c.set(name, value, options);
          });
        },
      },
    }
  );
}
