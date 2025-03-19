"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RequestForm from "@/components/RequestForm";
import ExampleTemplates from "@/components/ExampleTemplates";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/signin"); // Redirect signed-in users
    }
  }, [session, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <ExampleTemplates />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
