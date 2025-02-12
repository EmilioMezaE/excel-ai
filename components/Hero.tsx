"use client";  // 🔹 Ensure this is at the very top

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-gradient">
          Excel Magic with AI
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-8">
          Transform your ideas into powerful spreadsheets in seconds.
        </p>
        <motion.a
          href="#request-form"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          Create Your Excel File
        </motion.a>
      </motion.div>
    </section>
  );
}
