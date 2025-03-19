"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-between gap-16"
      >
        {/* Left side */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-gradient">
            Excel Magic with AI
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10">
            Transform your ideas into powerful spreadsheets effortlessly in seconds.
          </p>
          <motion.a
            href="#explore"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </motion.a>
        </div>

        {/* Right side (Video placeholder) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full aspect-video bg-gray-200 rounded-2xl shadow-md flex items-center justify-center">
            <span className="text-gray-400">Your Video Here</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
