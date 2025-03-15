"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, DownloadCloud } from "lucide-react";

// LoaderDots component for a standalone loading animation
function LoaderDots() {
  const dotVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: [0.3, 1, 0.3] }
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        variants={dotVariants}
        animate="animate"
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        variants={dotVariants}
        animate="animate"
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-gray-600 rounded-full"
        variants={dotVariants}
        animate="animate"
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

interface ChatResponse {
  reply: string;
  done: boolean;
  file_link: string;
}

export default function ExcelGenerator() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).substring(7));

  // For the typing effect on AI messages (if you still want it for longer messages)
  const [typingText, setTypingText] = useState("");

  // If the server returns a file link, store it
  const [fileLink, setFileLink] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000";

  // Ref for the input field to maintain focus
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---------------------------
  // 1. On Mount: Add a Local Welcome
  // ---------------------------
  useEffect(() => {
    setMessages([
      {
        text: "👋 Hi! I'm Excel AI. Let's create your Excel file—choose an option below or tell me what you need!",
        sender: "ai",
      },
    ]);
  }, []);

  // ---------------------------
  // 2. Typing Effect for the Last AI Message (if message text exists)
  // ---------------------------
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender === "ai" && lastMsg.text !== "") {
      let text = lastMsg.text;
      // Sanitize text
      text = text.replaceAll("undefined", "");
      text = text.replace(/\r?\n/g, "");
      text = text.replace(/\uFEFF|\u200B|\u200C|\u200D|\u200E|\u200F/g, "");
      text = text.trim();

      setTypingText("");
      let i = 0;
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
      setTypingText("");
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive or typingText updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // ---------------------------
  // 3. Handle User Send (clear text immediately)
  // ---------------------------
  const handleSendMessage = async (e: React.FormEvent | { preventDefault: () => void }, predefinedMessage?: string) => {
    e.preventDefault();

    const messageToSend = predefinedMessage || currentMessage;

    if (!messageToSend.trim()) return;

    if (!predefinedMessage) {
      setCurrentMessage(""); // Clear input only for manually typed messages
      setMessages((prev) => [...prev, { text: messageToSend, sender: "user" }]);
    }

    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: messageToSend }),
      });
      const data: ChatResponse = await resp.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
      }
      if (data.done && data.file_link) {
        setFileLink(data.file_link);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
          AI-Powered Excel Builder
        </h2>

        {/* Chat Window */}
        <div className="flex-1 w-full overflow-y-auto border border-gray-300 rounded-3xl p-4 bg-gray-50 shadow-inner max-h-[70vh]">
          {messages.map((msg, idx) => {
            const isLastAi = msg.sender === "ai" && idx === messages.length - 1;
            const displayText = isLastAi && msg.text !== "" ? typingText : msg.text;

            const bubbleStyles =
              msg.sender === "user"
                ? "bg-indigo-500 text-white self-end ml-auto rounded-l-2xl rounded-br-2xl"
                : "bg-gray-200 text-gray-800 self-start mr-auto rounded-r-2xl rounded-bl-2xl";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`p-4 my-2 max-w-md shadow-md ${bubbleStyles}`}
              >
                {displayText}
              </motion.div>
            );
          })}

          {/* Loader animation below messages */}
          {loading && (
            <div className="flex justify-start py-2">
              <div className="bg-gray-200 rounded-r-2xl rounded-bl-2xl px-4 py-2 shadow-md">
                <LoaderDots />
              </div>
            </div>
          )}

          {/* Auto-scroll helper div */}
          <div ref={messagesEndRef} />
        </div>

        {/* Pre-defined responses above text field with slower, smoother animation */}
        {messages.length === 1 && !loading && typingText === messages[0].text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5 }}
            className="flex justify-center gap-3 py-3"
          >
            {['Create Budget Sheet', 'Generate Invoice', 'Make Inventory List'].map((preset, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setMessages((prev) => [...prev, { text: preset, sender: "user" }]);
                  handleSendMessage({ preventDefault: () => {} } as any, preset);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
              >
                {preset}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="relative w-full mt-4">
          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 
                      focus:border-indigo-500 focus:ring-indigo-300 shadow-md 
                      bg-gray-100 text-gray-800 transition duration-300"
            placeholder="Type your response..."
            value={currentMessage}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length === 1) {
                setCurrentMessage(value.toUpperCase());
              } else {
                setCurrentMessage(value);
              }
            }}
          />
          <motion.button
            type="submit"
            disabled={loading || (messages[messages.length - 1]?.sender === "ai" && typingText.length !== messages[messages.length - 1].text.length)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-3 bg-indigo-600 text-white p-2 rounded-full 
                      shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </form>

        {/* Download Section */}
        {fileLink && (
          <div className="mt-6 flex flex-col items-center">
            <a
              href={fileLink}
              download
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3
                         rounded-full font-medium shadow-lg hover:bg-indigo-700 transition"
            >
              <DownloadCloud size={20} />
              Download Excel File
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
}
