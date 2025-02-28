"use client"; // Ensure client-side rendering

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  }

  if (!session) {
    return (
      <p className="text-center text-gray-500 mt-8">
        You are not authorized. Please{" "}
        <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => signOut()}>
          Sign Out
        </span>{" "}
        and try again.
      </p>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-gradient">
          Welcome, {session.user?.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your generated Excel files and create new ones easily.
        </p>
        <motion.a
          href="/dashboard/excel-generator"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Create an Excel File
        </motion.a>
        <br />
        <motion.button
          onClick={() => signOut()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition"
        >
          Sign Out
        </motion.button>
      </div>
    </section>
  );
}
