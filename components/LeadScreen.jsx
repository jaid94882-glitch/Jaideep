"use client";

import LeadForm from "./LeadForm";

export default function LeadScreen({ onClose }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success text-white font-bold text-lg">
              ₹
            </span>
            <span className="text-white font-bold text-base">
              Submit Doc Lead
            </span>
          </div>
          <button
            onClick={onClose}
            className="tap-target rounded-xl bg-white/10 border border-white/40 text-white px-4 py-2 text-xs font-semibold hover:bg-white/20 transition"
          >
            ← Back to site
          </button>
        </div>
      </header>

      <LeadForm />
    </div>
  );
}
