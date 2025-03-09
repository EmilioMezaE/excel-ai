import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/SessionProvider";
import ClientLayout from "@/components/ClientLayout"; // ✅ Import new client layout
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Excel AI Generator",
  description: "Generate custom Excel files with AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout> {/* ✅ Wrap children inside ClientLayout */}
        </AuthProvider>
      </body>
    </html>
  );
}
