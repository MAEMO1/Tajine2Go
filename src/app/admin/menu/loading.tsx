import { AdminShell } from "@/components/admin/admin-shell";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-brand-warm2/60 ${className ?? ""}`} />;
}

export default function MenuLoading() {
  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </AdminShell>
  );
}
