import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersList } from "./orders-list";

export default async function OrdersPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, customers(first_name, last_name, email)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminShell>
      <OrdersList orders={orders ?? []} />
    </AdminShell>
  );
}
