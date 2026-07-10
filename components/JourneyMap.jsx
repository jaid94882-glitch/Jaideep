const STEPS = [
  {
    icon: "📱",
    title: "You Submit Lead",
    desc: "Doctor's name, phone, loan type & documents — 60 seconds from your phone.",
  },
  {
    icon: "🔍",
    title: "Aggregator Validates",
    desc: "Lead is qualified and matched with the right RBI-registered lending partner.",
  },
  {
    icon: "🏦",
    title: "Lender Assessment",
    desc: "Lending company runs credit analysis and approves the loan.",
  },
  {
    icon: "🏥",
    title: "Doctor Funded",
    desc: "Approved amount is disbursed directly to the doctor's account.",
  },
  {
    icon: "💰",
    title: "You Get Paid Instantly",
    desc: "Commission credited to your account the moment the loan is disbursed.",
  },
];

export default function JourneyMap() {
  return (
    <section id="journey" className="bg-white px-5 py-12 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand">
            From Lead to Payout in 5 Steps
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            From lead to commission — a fully transparent process
          </p>
        </div>

        {/* Vertical on mobile, horizontal on desktop */}
        <ol className="mt-10 flex flex-col md:flex-row md:items-start gap-0 md:gap-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex md:flex-col md:flex-1 md:items-center">
              {/* Connector — vertical (mobile) */}
              {i < STEPS.length - 1 && (
                <span className="md:hidden absolute left-[27px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-brand/40 to-success/40" />
              )}
              {/* Connector — horizontal (desktop) */}
              {i < STEPS.length - 1 && (
                <span className="hidden md:block absolute top-7 left-[calc(50%+36px)] right-[calc(-50%+36px)] h-0.5 bg-gradient-to-r from-brand/40 to-success/40" />
              )}

              <div className="flex md:flex-col md:items-center md:text-center gap-4 pb-10 md:pb-0 w-full">
                <div
                  className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-card z-10 ${
                    i === STEPS.length - 1
                      ? "bg-success-light border-2 border-success"
                      : "bg-brand-light border-2 border-brand/30"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="md:mt-4">
                  <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Step {i + 1}
                  </p>
                  <h3
                    className={`text-base font-bold ${
                      i === STEPS.length - 1 ? "text-success-dark" : "text-brand"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-xs">{step.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
