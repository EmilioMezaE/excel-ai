"use client";  // 🔹 Ensure this is at the very top

import { useState } from "react"
import { motion } from "framer-motion"
import type React from "react" // Added import for React

export default function RequestForm() {
  const [request, setRequest] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Generating Excel file for:", request)
    setRequest("")
  }

  return (
    <section id="request-form" className="w-full max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Describe Your Ideal Excel File</h2>
        <div className="mb-6">
          <textarea
            id="request"
            name="request"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
            placeholder="E.g., A monthly budget tracker with income and expense categories, and automatic calculations for savings"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          ></textarea>
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300"
        >
          Generate Excel File
        </motion.button>
      </motion.form>
    </section>
  )
}

