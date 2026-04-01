import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { CustomerDetail } from "./customer-detail";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) redirect("/admin/klanten");

  const { data: orders } = await supabase
    .from("orders")
    .select("order_number, status, total_cents, order_date")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <AdminShell>
      <CustomerDetail customer={customer} orders={orders ?? []} />
    </AdminShell>
  );
}
