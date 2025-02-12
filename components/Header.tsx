"use client";  // 🔹 Ensure this is at the very top
import Link from "next/link"
import { motion } from "framer-motion"

export default function Header() {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Excel AI
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/explore" className="text-gray-600 hover:text-indigo-600 transition">
            Explore
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition"
          >
            Sign In
          </motion.button>
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
  )
}

