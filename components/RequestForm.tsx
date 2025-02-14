"use client"; // 🔹 Ensure this is at the very top

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadCloud, Send } from "lucide-react"; // 🔹 Import Lucide Icons
import type React from "react"; // Import React

export default function RequestForm() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(() => Math.random().toString(36).substring(7)); // Generate unique session ID
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const API_BASE_URL = "http://127.0.0.1:8000"; // Change if hosted

  // Function to handle user message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: currentMessage, sender: "user" }]);
    setCurrentMessage("");
    setLoading(true);

    try {
      // Send message to backend
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: currentMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);

      if (data.done) {
        await generateExcelFile(); // If all questions are answered, generate Excel
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate Excel file after all inputs are collected
  const generateExcelFile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate_excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) throw new Error("Failed to generate Excel file.");

      // Convert response to a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessages((prev) => [...prev, { text: "✅ Your Excel file is ready! Click below to download.", sender: "ai" }]);
    } catch (error) {
      console.error("Error generating file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request-form" className="w-full max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="bg-white shadow-xl rounded-3xl p-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Describe Your Ideal Excel File</h2>

        {/* AI Chat UI */}
        <div className="w-full mb-6 h-64 overflow-y-auto border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-inner">
          {messages.length === 0 ? (
            <p className="text-gray-500">💬 AI: Let's create a custom Excel file! Answer a few quick questions to get started.</p>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`p-3 my-1 max-w-xs rounded-lg ${
                  msg.sender === "user" ? "bg-indigo-500 text-white self-end ml-auto" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </motion.div>
            ))
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="relative w-full mb-6">
          <input
            type="text"
            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-300 shadow-md bg-gray-100 text-gray-800 transition duration-300"
            placeholder="Type your response..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            disabled={loading}
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-3 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
          >
            <Send size={20} />
          </motion.button>
        </form>

        {/* Download Section */}
        {downloadUrl && (
          <div className="mt-6 flex flex-col items-center">
            <motion.a
              href={downloadUrl}
              download="Generated_Excel.xlsx"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-indigo-700 transition"
            >
              <DownloadCloud size={20} />
              Download Excel File
            </motion.a>
          </div>
        )}
      </motion.div>
    </section>
  );
}
