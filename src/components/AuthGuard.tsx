"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useUser } from "@/lib/useUser";
import Loading from "./Loading";

// Wrap a page with <AuthGuard> to make it visible only to logged-in users.
export default function AuthGuard({ children }: { children: (user: User) => React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <Loading />;
  return <>{children(user)}</>;
}
