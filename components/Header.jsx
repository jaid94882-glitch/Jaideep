"use client";

export default function Header({ onPartnerClick, onLeadClick }) {
  return (
    <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-2">
        <a href="#" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success text-white font-bold text-lg">
            ₹
          </span>
          <span className="text-white font-bold text-base hidden sm:block">
            MR Lead Portal
          </span>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={onPartnerClick}
            className="tap-target rounded-xl border border-white/40 text-white px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold hover:bg-white/10 active:scale-[0.98] transition"
          >
            🤝 Become a Business Partner
          </button>
          <button
            onClick={onLeadClick}
            className="tap-target rounded-xl bg-success text-white px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-bold hover:bg-success-dark active:scale-[0.98] transition shadow-lg shadow-emerald-900/30"
          >
            📋 Submit Doc Lead
          </button>
        </div>
      </div>
    </header>
  );
}
