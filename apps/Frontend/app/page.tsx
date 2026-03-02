
import Navbar from "../components/landingPageComponents/Navbar";
import HeroSection from "../components/landingPageComponents/HeroSection";
import FeaturesSection from "../components/landingPageComponents/FeaturesSection";
import Footer from "../components/landingPageComponents/Footer";
import CTASection from "../components/landingPageComponents/CTASection";
import { HowItWorks } from "@/components/landingPageComponents/HowItWorks";
import DemoVideoSection from "@/components/landingPageComponents/DemoVideoSection";
import styles from "./LandingBackground.module.css";

function LandingBackground() {
  return (
    <>
      <div className={styles.landingBackground}>
        {/* Glow blobs - dark theme accent colors */}
        <div className={styles.landingGlowBlob} style={{top: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle at 30% 30%, #393e5c88 0%, #23294633 100%)'}} />
        <div className={styles.landingGlowBlob} style={{top: '60%', left: '70%', width: 400, height: 400, background: 'radial-gradient(circle at 70% 70%, #a6b1e199 0%, #23294633 100%)'}} />
        <div className={styles.landingGlowBlob} style={{top: '40%', left: '40%', width: 200, height: 200, background: 'radial-gradient(circle at 50% 50%, #23294666 0%, #393e5c33 100%)'}} />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden">
      <LandingBackground />
      <Navbar />
      {/* Add top padding to prevent content from being hidden behind fixed Navbar */}
      <div className="relative z-10 backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-xl shadow-lg">
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
