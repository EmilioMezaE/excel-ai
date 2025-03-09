"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FilePlus, DownloadCloud } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center text-gray-500 mt-8">You are not authorized. Please sign in.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {session.user?.name}!</h1>
      <p className="text-gray-600">Manage your AI-generated Excel files with ease.</p>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Generate New File */}
        <Link href="/dashboard/excel-generator">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-indigo-600 text-white rounded-lg p-6 flex flex-col items-center shadow-lg cursor-pointer hover:bg-indigo-700 transition"
          >
            <FilePlus size={40} />
            <h2 className="text-xl font-semibold mt-4">Generate New Excel File</h2>
          </motion.div>
        </Link>

        {/* Recent Files */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Files</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
              <span className="text-gray-700">Budget_Report.xlsx</span>
              <motion.a href="#" download whileHover={{ scale: 1.05 }} className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <DownloadCloud size={18} className="mr-1" /> Download
              </motion.a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}