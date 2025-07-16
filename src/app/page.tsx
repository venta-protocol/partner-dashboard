import CompanyLogo from "@/components/homepage/CompanyLogo";
import Calculator from "@/components/homepage/Earn/Calculator";
import FaqSection from "@/components/homepage/Faq";
import Footer from "@/components/homepage/Footer";
import GrowWithVenta from "@/components/homepage/Growth/GrowWithVenta";
import Hero from "@/components/homepage/Hero";
import Navbar from "@/components/homepage/Navbar";

export default function Home() {
  return (
    <main className="text-white">
      <Navbar />
      <Hero />
      <CompanyLogo />
      <GrowWithVenta />
      <Calculator />
      <FaqSection />
      <Footer />
    </main>
  );
}
