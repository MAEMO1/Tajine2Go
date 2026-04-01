import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { authorized: true; email: string }
  | { authorized: false; status: 401 | 403 };

export async function checkAdminAuth(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { authorized: false, status: 401 };
  }

  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowlist.includes(user.email.toLowerCase())) {
    return { authorized: false, status: 403 };
  }

  return { authorized: true, email: user.email };
}
