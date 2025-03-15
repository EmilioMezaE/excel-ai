"use client";

import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Confirm correct path here!
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Sign-in Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 text-center">
              Sign in to Excel-AI
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Welcome back! Choose your preferred method to sign in.
            </p>
          </div>

          <motion.button
            onClick={() => signIn("google")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center w-full bg-gray-100 shadow-md rounded-lg py-3 px-4 text-sm font-semibold text-gray-700 hover:shadow-lg transition duration-300"
          >
            <Image
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google logo"
              width={24}
              height={24}
              className="mr-2"
            />
            Continue with Google
          </motion.button>

          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            disabled
            className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg shadow-sm cursor-not-allowed"
          >
            Continue with Email (Coming Soon)
          </button>
        </motion.div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-10">
        <div className="max-w-lg">
        <Image
            src="/smartdocs_logo.jpg"
            alt="Excel AI Illustration"
            width={400}
            height={300}
            className="mb-6 rounded-xl" // 👈 added rounded-xl
            />
          <h3 className="text-3xl font-bold mb-4">Simplify Your Excel Workflow</h3>
          <p className="mb-6 text-white text-opacity-80">
            Generate powerful Excel files instantly with Excel-AI. Save time and increase productivity—let AI handle the heavy lifting!
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white text-opacity-80">
            <li>AI-generated Excel templates</li>
            <li>Real-time customization</li>
            <li>Easy-to-use interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
