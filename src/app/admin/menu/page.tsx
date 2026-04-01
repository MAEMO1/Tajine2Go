import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { DishesManager } from "./dishes-manager";

export default async function AdminMenuPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: dishes } = await supabase
    .from("dishes")
    .select("*")
    .order("category")
    .order("name_nl");

  return (
    <AdminShell>
      <DishesManager dishes={dishes ?? []} />
    </AdminShell>
  );
}
