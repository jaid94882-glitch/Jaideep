"use client";

import { useState } from "react";
import { callRpc } from "@/lib/supabase";

const STATUS_LABELS = {
  submitted: "Submitted",
  validating: "Validating",
  login: "Login",
  mtc: "MTC",
  sanctioned: "Sanctioned",
  funded: "Funded",
  rejected: "Rejected",
};

const STATUS_STYLES = {
  submitted: "bg-blue-50 text-blue-700",
  validating: "bg-amber-50 text-amber-700",
  login: "bg-indigo-50 text-indigo-700",
  mtc: "bg-purple-50 text-purple-700",
  sanctioned: "bg-emerald-50 text-emerald-700",
  funded: "bg-success-light text-success-dark",
  rejected: "bg-red-50 text-red-600",
};

// Funnel order — a lead at a later stage counts toward all earlier ones.
const STAGE_RANK = {
  submitted: 0,
  validating: 1,
  login: 1,
  mtc: 2,
  sanctioned: 3,
  funded: 4,
};

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function PartnerDashboard({ onClose }) {
  const [code, setCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^MR\d{5}$/i.test(code.trim())) {
      setError("Enter a valid partner code, e.g. MR00001.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter your registered 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await callRpc("get_partner_dashboard", {
        p_code: code.trim().toUpperCase(),
        p_mobile: mobile,
      });
      if (!res) {
        setError("No partner found with that code and mobile number.");
      } else {
        setData(res);
      }
    } catch {
      setError("Could not load your dashboard — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const leads = data?.leads ?? [];
  const rank = (s) => STAGE_RANK[s] ?? 0;
  const disAmtOf = (l) =>
    Number(l.disbursed_amount) ||
    (rank(l.status) >= 4 ? Number(l.sanction_amount) || 0 : 0);
  const commissionOf = (l) =>
    Number(l.commission_amount) || Math.round(disAmtOf(l) * 0.005);

  const stats = {
    total: leads.length,
    docs: leads.reduce((s, l) => s + (Number(l.docs_collected) || 0), 0),
    login: leads.filter((l) => rank(l.status) >= 1).length,
    mtc: leads.filter((l) => rank(l.status) >= 2).length,
    sanctionCount: leads.filter((l) => rank(l.status) >= 3).length,
    sanctionAmt: leads.reduce((s, l) => s + (Number(l.sanction_amount) || 0), 0),
    disCount: leads.filter((l) => rank(l.status) >= 4).length,
    disAmt: leads.reduce((s, l) => s + disAmtOf(l), 0),
    commission: leads.reduce((s, l) => s + commissionOf(l), 0),
  };

  const cards = [
    { label: "Number of Leads", value: stats.total, icon: "📋" },
    { label: "Docs Collected", value: stats.docs, icon: "📄" },
    { label: "Login", value: stats.login, icon: "🏦" },
    { label: "MTC", value: stats.mtc, icon: "📑" },
    { label: "Sanction #", value: stats.sanctionCount, icon: "✅" },
    { label: "Sanction Amt", value: inr(stats.sanctionAmt), icon: "💰" },
    { label: "Dis #", value: stats.disCount, icon: "🏥" },
    { label: "Dis Amt", value: inr(stats.disAmt), icon: "💸" },
  ];

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
              Partner Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <button
                onClick={() => {
                  setData(null);
                  setCode("");
                  setMobile("");
                }}
                className="tap-target rounded-xl border border-white/40 text-white px-4 py-2 text-xs font-semibold hover:bg-white/10 transition"
              >
                Log out
              </button>
            )}
            <button
              onClick={onClose}
              className="tap-target rounded-xl bg-white/10 border border-white/40 text-white px-4 py-2 text-xs font-semibold hover:bg-white/20 transition"
            >
              ← Back to site
            </button>
          </div>
        </div>
      </header>

      {!data ? (
        /* ===== Login ===== */
        <div className="px-5 py-16">
          <form
            onSubmit={login}
            className="mx-auto max-w-sm rounded-2xl bg-white shadow-card p-6 sm:p-8"
          >
            <h1 className="text-xl font-bold text-brand">Partner Login</h1>
            <p className="mt-1 text-xs text-slate-500">
              Track your leads, sanctions and commissions. Use the partner code
              (MR00001…) given after registration and your registered mobile.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="pcode" className="block text-sm font-semibold text-slate-700">
                  Partner Code
                </label>
                <input
                  id="pcode"
                  type="text"
                  placeholder="MR00001"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="tap-target mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base uppercase tracking-wider outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
              <div>
                <label htmlFor="pmobile" className="block text-sm font-semibold text-slate-700">
                  Registered Mobile
                </label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                    +91
                  </span>
                  <input
                    id="pmobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="tap-target w-full rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="tap-target mt-5 w-full rounded-xl bg-brand text-white py-3.5 font-bold hover:bg-brand-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Loading…
                </>
              ) : (
                "View My Dashboard →"
              )}
            </button>
            <p className="mt-4 text-center text-[11px] text-slate-400">
              Not a partner yet?{" "}
              <button type="button" onClick={onClose} className="text-brand underline">
                Register from the home page
              </button>
              .
            </p>
          </form>
        </div>
      ) : (
        /* ===== Dashboard ===== */
        <div className="px-5 py-8 mx-auto max-w-5xl">
          <h1 className="text-xl md:text-2xl font-bold text-brand">
            Welcome, {data.partner_name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {code.toUpperCase()} · Live view of your lead pipeline
          </p>

          {/* Commission highlight */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-success to-success-dark text-white shadow-card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-100">
                Total Commission Earned
              </p>
              <p className="mt-1 text-3xl font-bold">{inr(stats.commission)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>

          {/* Stat cards */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cards.map((c) => (
              <div key={c.label} className="rounded-2xl bg-white shadow-card p-4">
                <div className="text-xl">{c.icon}</div>
                <p className="mt-2 text-lg font-bold text-slate-800 truncate">{c.value}</p>
                <p className="text-[11px] text-slate-500">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Leads table */}
          <div className="mt-8 rounded-2xl bg-white shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-700 text-sm">My Leads</h2>
            </div>
            {leads.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 text-center">
                No leads yet. Go back to the home page and submit your first
                doctor lead — enter your partner code on the form so it appears
                here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                      <th className="px-4 py-2.5">Lead ID</th>
                      <th className="px-4 py-2.5">Doctor</th>
                      <th className="px-4 py-2.5">Loan Amt</th>
                      <th className="px-4 py-2.5">Docs</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Sanction Amt</th>
                      <th className="px-4 py-2.5">Dis Amt</th>
                      <th className="px-4 py-2.5">Commission</th>
                      <th className="px-4 py-2.5">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.lead_code} className="border-b border-slate-50">
                        <td className="px-4 py-3 font-mono font-semibold text-brand">
                          {l.lead_code}
                        </td>
                        <td className="px-4 py-3">{l.doctor_name}</td>
                        <td className="px-4 py-3">{inr(l.loan_amount)}</td>
                        <td className="px-4 py-3">{l.docs_collected || 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              STATUS_STYLES[l.status] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {STATUS_LABELS[l.status] || l.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {l.sanction_amount ? inr(l.sanction_amount) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {disAmtOf(l) ? inr(disAmtOf(l)) : "—"}
                        </td>
                        <td className="px-4 py-3 text-success-dark font-semibold">
                          {commissionOf(l) ? inr(commissionOf(l)) : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {l.created_at
                            ? new Date(l.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
