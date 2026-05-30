import { AdminShell } from "@/components/admin/admin-shell";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-brand-warm2/60 ${className ?? ""}`} />;
}

export default function CustomersLoading() {
  return (
    <AdminShell>
      <Skeleton className="h-8 w-48" />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="mt-6 rounded-xl bg-white p-1 shadow-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="mx-4 my-3 h-6" />
        ))}
      </div>
    </AdminShell>
  );
}
