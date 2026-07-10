"use client";

export default function StickyCTA({ onClick }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden p-3 bg-white/90 backdrop-blur border-t border-slate-200">
      <button
        onClick={onClick}
        className="tap-target w-full rounded-xl bg-success text-white py-4 text-base font-bold shadow-lg active:scale-[0.99] transition"
      >
        ⚡ Quick Submit a Lead
      </button>
    </div>
  );
}
