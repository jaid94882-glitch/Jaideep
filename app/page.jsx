"use client";

import Hero from "@/components/Hero";
import MicroDashboard from "@/components/MicroDashboard";
import LeadForm from "@/components/LeadForm";
import JourneyMap from "@/components/JourneyMap";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <Hero onQuickSubmit={scrollToForm} />
      <MicroDashboard />
      <LeadForm />
      <JourneyMap />
      <Footer />
      <StickyCTA onClick={scrollToForm} />
    </main>
  );
}
