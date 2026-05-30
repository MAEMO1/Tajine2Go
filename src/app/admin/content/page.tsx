import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { fetchAdminContentSettings } from "@/lib/site-content";
import { ContentManager } from "./content-manager";

export default async function AdminContentPage() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const content = await fetchAdminContentSettings();

  return (
    <AdminShell>
      <ContentManager initialContent={content} />
    </AdminShell>
  );
}
