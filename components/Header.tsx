"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  const smoothScrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600"
          onClick={smoothScrollToTop}
        >
          Excel AI
        </Link>
        <nav className="hidden md:flex space-x-8">
          <a href="#explore" className="text-gray-600 hover:text-indigo-600 transition">
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
          {!session && (
            <motion.button
              onClick={() => (window.location.href = '/signin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
