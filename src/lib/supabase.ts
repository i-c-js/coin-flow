import { createBrowserClient } from "@supabase/ssr";

// One Supabase client for the whole app (runs in the browser).
// The keys come from .env.local. Row Level Security in the database
// makes sure each user only sees their own rows.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-key"
);
