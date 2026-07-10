"use client";

import { useEffect, useState } from "react";
import { callRpc } from "@/lib/supabase";

export default function MicroDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    callRpc("get_dashboard_stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const submitted = Number(stats?.submitted ?? 0);
  const inProcess = Number(stats?.in_process ?? 0);
  const funded = Number(stats?.funded ?? 0);
  const commission = Number(stats?.total_commission ?? 0);
  const total = submitted + inProcess + funded;

  const pipeline = [
    { label: "Submitted", count: submitted, color: "bg-blue-400" },
    { label: "In Process", count: inProcess, color: "bg-amber-400" },
    { label: "Funded", count: funded, color: "bg-success" },
  ];

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
              ₹{commission.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Paid on funded loans
            </p>
          </div>

          {/* Pending approvals */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-amber-400">
            <p className="text-xs text-slate-500 font-medium">
              Pending Lead Approvals
            </p>
            <p className="mt-1 text-2xl md:text-3xl font-bold text-slate-800">
              {submitted}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Awaiting aggregator review
            </p>
          </div>

          {/* Pipeline */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-brand col-span-2 md:col-span-1">
            <p className="text-xs text-slate-500 font-medium">
              Active Pipeline ({total} {total === 1 ? "lead" : "leads"})
            </p>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              {total > 0 &&
                pipeline.map((p) => (
                  <div
                    key={p.label}
                    className={`${p.color} h-full transition-all`}
                    style={{ width: `${(p.count / total) * 100}%` }}
                    title={`${p.label}: ${p.count}`}
                  />
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              {pipeline.map((p) => (
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
