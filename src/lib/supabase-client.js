import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY
)

