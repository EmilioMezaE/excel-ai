"use client"; // Ensure client component

import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RequestForm from "@/components/RequestForm";
import ExampleTemplates from "@/components/ExampleTemplates";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        {status === "loading" ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : session ? (
          <RequestForm />
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Please <span className="text-indigo-600 font-semibold">Sign In</span> to generate an Excel file.
          </p>
        )}
        <ExampleTemplates />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
