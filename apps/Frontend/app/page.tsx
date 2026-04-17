
import Navbar from "../components/landingPageComponents/Navbar";
import HeroSection from "../components/landingPageComponents/HeroSection";
import FeaturesSection from "../components/landingPageComponents/FeaturesSection";
import Footer from "../components/landingPageComponents/Footer";
import CTASection from "../components/landingPageComponents/CTASection";
import HowItWorks from "@/components/landingPageComponents/HowItWorks";
import DemoVideoSection from "@/components/landingPageComponents/DemoVideoSection";
import LandingGooeyBackground from "@/components/landingPageComponents/LandingGooeyBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      <LandingGooeyBackground />
      <Navbar />
      <div className="relative z-10 bg-black/20 rounded-xl shadow-lg">
        <HeroSection />
        <HowItWorks/>
        <div id="demo">
          <DemoVideoSection/>
        </div>
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
