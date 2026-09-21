// src/app/page.tsx
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Benefits from "@/components/landing/Benefits";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Logos />
        <Benefits />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}