"use client";

import { AdminSidebar } from "./sidebar";
import { ToastProvider } from "./toast";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 md:pt-6">{children}</main>
      </div>
    </ToastProvider>
  );
}
