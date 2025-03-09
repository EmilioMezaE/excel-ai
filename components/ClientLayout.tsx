"use client"; // ✅ Ensures this runs as a client component

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  return <>{children}</>;
}
