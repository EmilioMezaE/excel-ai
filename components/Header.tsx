"use client";  // 🔹 Make sure this is at the very top
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react"; // Import NextAuth hooks

export default function Header() {
  const { data: session } = useSession(); // Get session data

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Excel AI
        </Link>
        <nav className="hidden md:flex space-x-8">
          <a href="#request-form" className="text-gray-600 hover:text-indigo-600 transition">
            Explore
          </a>
          <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">
            About Us
          </a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition">
            Contact
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <p className="text-gray-700">{session.user?.name}</p>
              <motion.button
                onClick={() => signOut()} // 🔹 Logout button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => window.location.href = '/signin'}// 🔹 Sign in button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition"
            >
              Sign In
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </header>
  );
}
