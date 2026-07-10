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

  const partners = Number(stats?.total_partners ?? 0);
  const funded = Number(stats?.doctors_funded ?? 0);

  return (
    <section className="px-5 -mt-8 relative z-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {/* Total business partners */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-brand">
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Total Became Business Partner
            </p>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-brand">
              {partners.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              MRs earning with us
            </p>
          </div>

          {/* Total lending partners (fixed) */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-amber-400">
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Total Lending Partners
            </p>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-amber-500">
              10
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              RBI-registered lenders
            </p>
          </div>

          {/* Total doctors funded */}
          <div className="rounded-2xl bg-white shadow-card p-4 md:p-6 border-t-4 border-success">
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Total Doctors Funded
            </p>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-success">
              {funded.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Loans disbursed to doctors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
