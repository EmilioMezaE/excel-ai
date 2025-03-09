"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, DownloadCloud } from "lucide-react";

export default function ExcelGenerator() {
  // We'll store chat messages, but the server provides next question
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).substring(7));

  // For the typing effect
  const [typingText, setTypingText] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const API_BASE_URL = "http://127.0.0.1:8000";

  // ---------------------------
  // 1. On Mount: Fetch First Question
  // ---------------------------
  useEffect(() => {
    const startConversation = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, message: "start" }),
        });
        const data = await resp.json();
        if (data.reply) {
          // Show the server's first question
          setMessages([{ text: data.reply, sender: "ai" }]);
        }
      } catch (err) {
        console.error("Error starting conversation:", err);
      } finally {
        setLoading(false);
      }
    };

    startConversation();
  }, [API_BASE_URL, userId]);

  // ---------------------------
  // 2. Typing Effect for Last AI Message
  // ---------------------------
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "ai") {
      // Sanitize text to remove "undefined" or hidden chars
      let text = lastMsg.text ?? "";
      text = text.replaceAll("undefined", "");
      text = text.replace(/\r?\n/g, "");
      text = text.replace(/\uFEFF|\u200B|\u200C|\u200D|\u200E|\u200F/g, ""); // remove BOM & zero-width
      text = text.trim();

      setTypingText("");
      let i = 0;

      // Use substring(0, i+1) to avoid skipping or partial chars
      const interval = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      // If last message is from the user, no typed effect
      setTypingText("");
    }
  }, [messages]);

  // ---------------------------
  // 3. Handle User Send
  // ---------------------------
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    // Append user message to chat
    setMessages((prev) => [...prev, { text: currentMessage, sender: "user" }]);
    setCurrentMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: currentMessage }),
      });
      const data = await response.json();

      // If the server returns a reply, display it
      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
      }

      // If all questions answered, generate Excel
      if (data.done) {
        await generateExcelFile();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 4. Generate Excel
  // ---------------------------
  const generateExcelFile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate_excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error("Failed to generate Excel file.");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Show "file ready" message
      setMessages((prev) => [
        ...prev,
        { text: "✅ Your Excel file is ready! Click below to download.", sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error generating file:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="bg-white shadow-xl rounded-3xl p-8 flex flex-col items-center w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Describe Your Ideal Excel File
        </h2>

        {/* Chat Window */}
        <div className="flex-1 w-full overflow-y-auto border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-inner max-h-[70vh]">
          {messages.map((msg, index) => {
            // For the last AI message, use typed text
            const isLastAi = msg.sender === "ai" && index === messages.length - 1;
            const displayText = isLastAi ? typingText : msg.text;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 my-1 max-w-2xl rounded-lg ${
                  msg.sender === "user"
                    ? "bg-indigo-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {displayText}
              </motion.div>
            );
          })}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="relative w-full mt-4">
          <input
            type="text"
            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-300 
                       focus:border-indigo-500 focus:ring-indigo-300 shadow-md 
                       bg-gray-100 text-gray-800 transition duration-300"
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
            className="absolute right-4 top-3 bg-indigo-600 text-white p-2 rounded-full 
                       shadow-md hover:bg-indigo-700 transition duration-300"
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
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3
                         rounded-full font-medium shadow-lg hover:bg-indigo-700 transition"
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
