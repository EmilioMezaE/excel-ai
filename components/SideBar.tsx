"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, FileText, LogOut } from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-indigo-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Excel AI</h2>
      <nav className="space-y-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-800">
          <Home size={20} /> Dashboard
        </Link>
        <Link href="/dashboard/excel-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-800">
          <FileText size={20} /> Generate Excel
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-3 rounded-lg bg-red-500 hover:bg-red-600 w-full text-left"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </nav>
    </aside>
  );
}