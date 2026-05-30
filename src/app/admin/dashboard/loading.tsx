import { AdminShell } from "@/components/admin/admin-shell";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-brand-warm2/60 ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <AdminShell>
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mt-8 h-64 rounded-xl" />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </AdminShell>
  );
}
