import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { CateringKanban } from "./catering-kanban";

export default async function CateringPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: requests } = await supabase
    .from("catering_requests")
    .select("*, customers(first_name, last_name, email, phone)")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <CateringKanban requests={requests ?? []} />
    </AdminShell>
  );
}
