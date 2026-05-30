import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  normalizeTakeawayExceptions,
  normalizeTakeawaySchedule,
  resolvePublicOrderConfig,
} from "@/lib/menu-data";
import { AdminShell } from "@/components/admin/admin-shell";
import { PlanningManager } from "./planning-manager";
import type { WeeklyMenuWithDish } from "@/types/database";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function PlanningPage({ searchParams }: Props) {
  const { date } = await searchParams;
  const auth = await checkAdminAuth();
  if (!auth.authorized) redirect("/admin/login");

  const supabase = createAdminClient();
  const config = await resolvePublicOrderConfig({ date });

  const [takeawayActiveRes, scheduleRes, exceptionsRes, dishesRes, weeklyMenuRes] =
    await Promise.all([
      supabase.from("settings").select("value").eq("key", "takeaway_active").single(),
      supabase.from("settings").select("value").eq("key", "takeaway_schedule").single(),
      supabase.from("settings").select("value").eq("key", "takeaway_exceptions").single(),
      supabase.from("dishes").select("*").order("category").order("name_nl"),
      supabase
        .from("weekly_menu")
        .select("*, dishes(*)")
        .eq("available_date", config.date)
        .order("created_at"),
    ]);

  return (
    <AdminShell>
      <PlanningManager
        selectedDate={config.date}
        takeawayActive={takeawayActiveRes.data?.value?.active ?? false}
        schedule={normalizeTakeawaySchedule(scheduleRes.data?.value)}
        exceptions={normalizeTakeawayExceptions(exceptionsRes.data?.value)}
        dishes={dishesRes.data ?? []}
        menuItems={(weeklyMenuRes.data ?? []) as WeeklyMenuWithDish[]}
      />
    </AdminShell>
  );
}
