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
import LeadScreen from "@/components/LeadScreen";

export default function Home() {
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [view, setView] = useState("home"); // "home" | "dashboard" | "lead"

  if (view === "dashboard") {
    return <PartnerDashboard onClose={() => setView("home")} />;
  }

  if (view === "lead") {
    return <LeadScreen onClose={() => setView("home")} />;
  }

  return (
    <main>
      <Header
        onPartnerClick={() => setPartnerOpen(true)}
        onLeadClick={() => setView("lead")}
        onLoginClick={() => setView("dashboard")}
      />
      <Hero onQuickSubmit={() => setView("lead")} />
      <MicroDashboard />
      <LeadForm />
      <JourneyMap />
      <Footer />
      <StickyCTA onClick={() => setView("lead")} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </main>
  );
}
