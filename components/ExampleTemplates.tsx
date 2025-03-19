"use client";  // 🔹 Ensure this is at the very top

import { motion } from "framer-motion"
import Image from "next/image"

const templates = [
  {
    name: "Smart Budget Tracker",
    image: "/placeholder.svg?height=300&width=400",
    description: "Automatically categorize expenses and visualize spending patterns.",
  },
  {
    name: "Dynamic Financial Report",
    image: "/placeholder.svg?height=300&width=400",
    description: "Real-time data integration with customizable charts and KPIs.",
  },
  {
    name: "Interactive Sales Dashboard",
    image: "/placeholder.svg?height=300&width=400",
    description: "Track sales performance with advanced filtering and forecasting.",
  },
]

export default function ExampleTemplates() {
  return (
    <section id="explore" className="w-full py-16 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Discover What's Possible</h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <Image
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
                <p className="text-gray-600">{template.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

