"use client";  // 🔹 Ensure this is at the very top
import { motion } from "framer-motion"
import Image from "next/image"
import { Users } from "lucide-react"; 

export default function AboutUs() {
  return (
    <section id="about" className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-lg text-gray-600 mb-6">
              At Excel AI, we're passionate about revolutionizing the way professionals work with spreadsheets. Our
              cutting-edge AI technology transforms complex data tasks into simple, intuitive processes.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Founded by a team of data scientists and Excel enthusiasts, we're on a mission to make data analysis
              accessible to everyone, regardless of their technical background.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Learn More
            </motion.button>
          </div>
          <div className="flex justify-center">
            <Users className="w-48 h-48 text-indigo-600" /> {/* Lucide Users Icon */}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

