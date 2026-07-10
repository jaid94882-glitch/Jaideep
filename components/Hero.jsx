import HeroScene from "./HeroScene";

export default function Hero({ onQuickSubmit }) {
  return (
    <section className="bg-gradient-to-b from-brand to-brand-dark text-white px-5 pt-10 pb-14 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-5xl text-center md:text-left md:flex md:items-center md:justify-between md:gap-12">
        <div className="md:max-w-2xl">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium tracking-wide uppercase">
            For Medical Representatives
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold leading-tight">
            Turn your doctor relationships into{" "}
            <span className="text-success">daily commissions.</span>
          </h1>
          <p className="mt-4 text-blue-100 text-base md:text-lg">
            Submit a doctor loan lead in 60 seconds. We handle validation,
            credit and funding — you get paid on every disbursed loan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:justify-start justify-center">
            <button
              onClick={onQuickSubmit}
              className="tap-target rounded-xl bg-success hover:bg-success-dark active:scale-[0.98] transition px-8 py-4 text-lg font-semibold shadow-lg shadow-emerald-900/30"
            >
              ⚡ Quick Submit a Lead
            </button>
            <a
              href="#journey"
              className="tap-target rounded-xl border border-white/30 px-8 py-4 text-lg font-medium text-center hover:bg-white/10 transition"
            >
              How it works
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center md:justify-start gap-5 text-xs text-blue-200">
            <span>🔒 256-bit encrypted</span>
            <span>✔ RBI-registered lending partners</span>
            <span>💸 Instant payout</span>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:shrink-0 md:w-[420px]">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
