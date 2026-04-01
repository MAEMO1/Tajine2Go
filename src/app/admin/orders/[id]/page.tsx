import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderDetail } from "./order-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();

  const [orderRes, itemsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*, customers(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id),
  ]);

  if (!orderRes.data) redirect("/admin/orders");

  return (
    <AdminShell>
      <OrderDetail order={orderRes.data} items={itemsRes.data ?? []} />
    </AdminShell>
  );
}
