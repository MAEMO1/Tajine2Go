import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { CustomersList } from "./customers-list";

export default async function CustomersPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: customers } = await supabase
    .from("customer_value")
    .select("*")
    .limit(50);

  // Get full customer data
  const { data: fullCustomers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <AdminShell>
      <CustomersList
        customers={fullCustomers ?? []}
        customerValues={customers ?? []}
      />
    </AdminShell>
  );
}
