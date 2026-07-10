"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MicroDashboard from "@/components/MicroDashboard";
import LeadForm from "@/components/LeadForm";
import JourneyMap from "@/components/JourneyMap";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import PartnerModal from "@/components/PartnerModal";
import PartnerDashboard from "@/components/PartnerDashboard";

export default function Home() {
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (dashboardOpen) {
    return <PartnerDashboard onClose={() => setDashboardOpen(false)} />;
  }

  return (
    <main>
      <Header
        onPartnerClick={() => setPartnerOpen(true)}
        onLeadClick={scrollToForm}
        onLoginClick={() => setDashboardOpen(true)}
      />
      <Hero onQuickSubmit={scrollToForm} />
      <MicroDashboard />
      <LeadForm />
      <JourneyMap />
      <Footer />
      <StickyCTA onClick={scrollToForm} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </main>
  );
}
