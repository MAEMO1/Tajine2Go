import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: rows } = await supabase.from("settings").select("*");

  const settings: Record<string, unknown> = {};
  for (const row of rows ?? []) {
    settings[row.key] = row.value;
  }

  return (
    <AdminShell>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
