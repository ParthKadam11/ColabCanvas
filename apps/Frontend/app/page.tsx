"use client"

import Navbar from "../components/landingPageComponents/Navbar";
import HeroSection from "../components/landingPageComponents/HeroSection";
import FeaturesSection from "../components/landingPageComponents/FeaturesSection";
import Footer from "../components/landingPageComponents/Footer";
import CTASection from "../components/landingPageComponents/CTASection";
import { HowItWorks } from "@/components/landingPageComponents/HowItWorks";
import DemoVideoSection from "@/components/landingPageComponents/DemoVideoSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-500 dark:from-black dark:via-zinc-900 dark:to-zlandiinc-800 font-sans">
      <Navbar />
      <HeroSection />
      <HowItWorks/>
      <DemoVideoSection videoUrl="../public/ColabCanvas.mov"/>
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
