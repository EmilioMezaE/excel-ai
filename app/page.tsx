import Header from "@/components/Header"
import Hero from "@/components/Hero"
import RequestForm from "@/components/RequestForm"
import ExampleTemplates from "@/components/ExampleTemplates"
import AboutUs from "@/components/AboutUs"
import ContactUs from "@/components/ContactUs"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <RequestForm />
        <ExampleTemplates />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  )
}

