const PIPELINE = [
  { label: "Submitted", count: 8, color: "bg-blue-400" },
  { label: "Validating", count: 5, color: "bg-amber-400" },
  { label: "Funded", count: 3, color: "bg-success" },
];

export default function MicroDashboard() {
  const total = PIPELINE.reduce((s, p) => s + p.count, 0);

  return (
    <section className="px-5 -mt-8 relative z-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Total commission */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-success">
            <p className="text-xs text-slate-500 font-medium">
              Total Earned Commission
            </p>
            <p className="mt-1 text-2xl md:text-3xl font-bold text-success">
              ₹1,24,500
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Lifetime payouts</p>
          </div>

          {/* Pending approvals */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-amber-400">
            <p className="text-xs text-slate-500 font-medium">
              Pending Lead Approvals
            </p>
            <p className="mt-1 text-2xl md:text-3xl font-bold text-slate-800">
              5
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Awaiting aggregator review
            </p>
          </div>

          {/* Pipeline */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-brand col-span-2 md:col-span-1">
            <p className="text-xs text-slate-500 font-medium">
              Active Pipeline ({total} leads)
            </p>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              {PIPELINE.map((p) => (
                <div
                  key={p.label}
                  className={`${p.color} h-full transition-all`}
                  style={{ width: `${(p.count / total) * 100}%` }}
                  title={`${p.label}: ${p.count}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              {PIPELINE.map((p) => (
                <span key={p.label} className="flex items-center gap-1">
                  <span className={`inline-block h-2 w-2 rounded-full ${p.color}`} />
                  {p.label} {p.count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
