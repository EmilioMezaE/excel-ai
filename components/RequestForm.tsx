"use client"; // 🔹 Ensure this is at the very top

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadCloud } from "lucide-react"; // 🔹 Import Lucide Icon
import type React from "react"; // Import React

export default function RequestForm() {
  const [request, setRequest] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); // Store file URL
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling

  // API Base URL (Make sure FastAPI is running locally or deployed)
  const API_BASE_URL = "http://127.0.0.1:8000"; // Change if hosted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl(null);
    setError(null);

    console.log("📤 Sending request:", request); // Debugging output

    try {
      const response = await fetch(`${API_BASE_URL}/generate_excel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: request }), // Send user input
      });

      console.log("📥 Response received:", response); // Debugging output

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("❌ Server error:", errorResponse);
        throw new Error(`Failed to generate file: ${response.statusText}`);
      }

      // Convert response to a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url); // Store file URL for download

      console.log("✅ Excel file generated successfully!");

    } catch (error: any) {
      console.error("⚠️ Error fetching Excel file:", error.message);
      setError("Failed to generate Excel file. Please try again.");
    } finally {
      setLoading(false);
      setRequest(""); // Reset input field
    }
  };

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

        {/* Submit Button with Loading State */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Generate Excel File"}
        </motion.button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Download Section */}
        {downloadUrl && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-green-600 font-medium mb-2">✅ File Ready! Click below to download:</p>
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
      </motion.form>
    </section>
  );
}
