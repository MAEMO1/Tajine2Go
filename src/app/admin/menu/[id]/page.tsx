import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { DishEditor } from "./dish-editor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DishEditPage({ params }: Props) {
  const { id } = await params;
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data: dish } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", id)
    .single();

  if (!dish) redirect("/admin/menu");

  return (
    <AdminShell>
      <DishEditor dish={dish} />
    </AdminShell>
  );
}
