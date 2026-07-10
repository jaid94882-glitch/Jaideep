"use client";

import { useState } from "react";
import { callRpc } from "@/lib/supabase";

const STATUSES = ["submitted", "validating", "login", "mtc", "sanctioned", "funded", "rejected"];

const STATUS_STYLES = {
  submitted: "bg-blue-50 text-blue-700",
  validating: "bg-amber-50 text-amber-700",
  login: "bg-indigo-50 text-indigo-700",
  mtc: "bg-purple-50 text-purple-700",
  sanctioned: "bg-emerald-50 text-emerald-700",
  funded: "bg-success-light text-success-dark",
  rejected: "bg-red-50 text-red-600",
};

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function AdminDashboard({ onClose }) {
  const [mobile, setMobile] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("leads");
  const [edits, setEdits] = useState({}); // lead_code -> {status, sanction, disbursed, commission}
  const [savingRow, setSavingRow] = useState("");
  const [newAdmin, setNewAdmin] = useState({ name: "", mobile: "", passcode: "", role: "admin" });
  const [adminMsg, setAdminMsg] = useState("");

  const refresh = async (m = mobile, p = passcode) => {
    const res = await callRpc("admin_get_data", { p_mobile: m, p_passcode: p });
    if (!res) throw new Error("bad-credentials");
    setData(res);
    setEdits({});
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter the admin's 10-digit mobile number.");
      return;
    }
    if (!passcode) {
      setError("Enter your passcode.");
      return;
    }
    setLoading(true);
    try {
      await refresh();
    } catch {
      setError("Wrong mobile number or passcode.");
    } finally {
      setLoading(false);
    }
  };

  const leads = data?.leads ?? [];
  const partners = data?.partners ?? [];
  const admins = data?.admins ?? [];
  const isSuper = data?.role === "superadmin";

  const totals = {
    leads: leads.length,
    partners: partners.length,
    funded: leads.filter((l) => l.status === "funded").length,
    disbursed: leads.reduce((s, l) => s + (Number(l.disbursed_amount) || 0), 0),
    commission: leads.reduce((s, l) => s + (Number(l.commission_amount) || 0), 0),
  };

  const editOf = (l) =>
    edits[l.lead_code] ?? {
      status: l.status || "submitted",
      sanction: l.sanction_amount ?? "",
      disbursed: l.disbursed_amount ?? "",
      commission: l.commission_amount ?? "",
    };

  const setEdit = (code, patch) =>
    setEdits((e) => ({ ...e, [code]: { ...editOf({ lead_code: code, ...leadByCode(code) }), ...e[code], ...patch } }));

  const leadByCode = (code) => leads.find((l) => l.lead_code === code) || {};

  const saveLead = async (l) => {
    const e = editOf(l);
    setSavingRow(l.lead_code);
    try {
      await callRpc("admin_update_lead", {
        p_mobile: mobile,
        p_passcode: passcode,
        p_lead_code: l.lead_code,
        p_status: e.status,
        p_sanction: e.sanction === "" ? null : Number(e.sanction),
        p_disbursed: e.disbursed === "" ? null : Number(e.disbursed),
        p_commission: e.commission === "" ? null : Number(e.commission),
      });
      await refresh();
    } catch {
      alert("Save failed — try again.");
    } finally {
      setSavingRow("");
    }
  };

  const deleteLead = async (l) => {
    if (!confirm(`Delete lead ${l.lead_code} (${l.doctor_name})? This cannot be undone.`)) return;
    setSavingRow(l.lead_code);
    try {
      await callRpc("admin_delete_lead", {
        p_mobile: mobile,
        p_passcode: passcode,
        p_lead_code: l.lead_code,
      });
      await refresh();
    } catch {
      alert("Delete failed — try again.");
    } finally {
      setSavingRow("");
    }
  };

  const manageAdmin = async (action, target) => {
    setAdminMsg("");
    try {
      const ok = await callRpc("admin_manage_admin", {
        p_mobile: mobile,
        p_passcode: passcode,
        p_action: action,
        p_target_name: target.name || "",
        p_target_mobile: target.mobile,
        p_target_passcode: target.passcode || "",
        p_target_role: target.role || "admin",
      });
      if (!ok) {
        setAdminMsg("Not allowed — check the details.");
        return;
      }
      setNewAdmin({ name: "", mobile: "", passcode: "", role: "admin" });
      await refresh();
      setAdminMsg(action === "add" ? "Admin added." : "Admin removed.");
    } catch {
      setAdminMsg("Action failed — try again.");
    }
  };

  const inputSm =
    "w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white font-bold text-lg">
              ⚙️
            </span>
            <span className="text-white font-bold text-base">
              {isSuper ? "Super Admin" : "Admin"} Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <button
                onClick={() => {
                  setData(null);
                  setMobile("");
                  setPasscode("");
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
          <form onSubmit={login} className="mx-auto max-w-sm rounded-2xl bg-white shadow-card p-6 sm:p-8">
            <h1 className="text-xl font-bold text-slate-800">Admin Login</h1>
            <p className="mt-1 text-xs text-slate-500">
              Restricted area — for the business team only.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="amobile" className="block text-sm font-semibold text-slate-700">
                  Mobile
                </label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                    +91
                  </span>
                  <input
                    id="amobile" type="tel" inputMode="numeric" maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="tap-target w-full rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="apass" className="block text-sm font-semibold text-slate-700">
                  Passcode
                </label>
                <input
                  id="apass" type="password" value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="tap-target mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="tap-target mt-5 w-full rounded-xl bg-slate-800 text-white py-3.5 font-bold hover:bg-slate-900 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Checking…
                </>
              ) : (
                "Enter Dashboard →"
              )}
            </button>
          </form>
        </div>
      ) : (
        /* ===== Dashboard ===== */
        <div className="px-5 py-8 mx-auto max-w-6xl">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Hello, {data.name} 👋
          </h1>

          {/* Totals */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total Leads", value: totals.leads },
              { label: "Partners", value: totals.partners },
              { label: "Funded", value: totals.funded },
              { label: "Disbursed Amt", value: inr(totals.disbursed) },
              { label: "Commission Paid", value: inr(totals.commission) },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-white shadow-card p-4">
                <p className="text-lg font-bold text-slate-800 truncate">{c.value}</p>
                <p className="text-[11px] text-slate-500">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2">
            {["leads", "partners", ...(isSuper ? ["admins"] : [])].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`tap-target rounded-xl px-5 py-2.5 text-sm font-semibold capitalize transition ${
                  tab === t ? "bg-slate-800 text-white" : "bg-white text-slate-600 shadow-card"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ===== Leads tab ===== */}
          {tab === "leads" && (
            <div className="mt-4 rounded-2xl bg-white shadow-card overflow-hidden">
              {leads.length === 0 ? (
                <p className="p-6 text-sm text-slate-500 text-center">No leads yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-3 py-2.5">Lead</th>
                        <th className="px-3 py-2.5">Doctor</th>
                        <th className="px-3 py-2.5">Phone</th>
                        <th className="px-3 py-2.5">MR</th>
                        <th className="px-3 py-2.5">Loan Amt</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5">Sanction</th>
                        <th className="px-3 py-2.5">Disbursed</th>
                        <th className="px-3 py-2.5">Commission</th>
                        <th className="px-3 py-2.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l) => {
                        const e = editOf(l);
                        return (
                          <tr key={l.lead_code} className="border-b border-slate-50 align-middle">
                            <td className="px-3 py-2.5 font-mono font-semibold text-brand whitespace-nowrap">
                              {l.lead_code}
                            </td>
                            <td className="px-3 py-2.5">
                              <p className="font-medium">{l.doctor_name}</p>
                              <p className="text-[10px] text-slate-400">
                                {l.speciality} · {l.location}
                              </p>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">{l.phone}</td>
                            <td className="px-3 py-2.5 font-mono">{l.partner_code || "—"}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">{inr(l.loan_amount)}</td>
                            <td className="px-3 py-2.5">
                              <select
                                value={e.status}
                                onChange={(ev) => setEdit(l.lead_code, { status: ev.target.value })}
                                className={`rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-semibold ${
                                  STATUS_STYLES[e.status] || ""
                                }`}
                              >
                                {STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2.5">
                              <input type="number" placeholder="—" value={e.sanction}
                                onChange={(ev) => setEdit(l.lead_code, { sanction: ev.target.value })}
                                className={inputSm} />
                            </td>
                            <td className="px-3 py-2.5">
                              <input type="number" placeholder="—" value={e.disbursed}
                                onChange={(ev) => setEdit(l.lead_code, { disbursed: ev.target.value })}
                                className={inputSm} />
                            </td>
                            <td className="px-3 py-2.5">
                              <input type="number" placeholder="—" value={e.commission}
                                onChange={(ev) => setEdit(l.lead_code, { commission: ev.target.value })}
                                className={inputSm} />
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <button
                                onClick={() => saveLead(l)}
                                disabled={savingRow === l.lead_code}
                                className="rounded-lg bg-success text-white px-3 py-1.5 text-xs font-bold hover:bg-success-dark transition disabled:opacity-60"
                              >
                                {savingRow === l.lead_code ? "…" : "Save"}
                              </button>
                              {isSuper && (
                                <button
                                  onClick={() => deleteLead(l)}
                                  disabled={savingRow === l.lead_code}
                                  className="ml-1.5 rounded-lg border border-red-300 text-red-500 px-2.5 py-1.5 text-xs font-bold hover:bg-red-50 transition"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== Partners tab ===== */}
          {tab === "partners" && (
            <div className="mt-4 rounded-2xl bg-white shadow-card overflow-hidden">
              {partners.length === 0 ? (
                <p className="p-6 text-sm text-slate-500 text-center">No partners yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                        <th className="px-3 py-2.5">Code</th>
                        <th className="px-3 py-2.5">Name</th>
                        <th className="px-3 py-2.5">Mobile</th>
                        <th className="px-3 py-2.5">Pharma Co.</th>
                        <th className="px-3 py-2.5">City</th>
                        <th className="px-3 py-2.5">Email</th>
                        <th className="px-3 py-2.5">Leads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((p) => (
                        <tr key={p.partner_code} className="border-b border-slate-50">
                          <td className="px-3 py-2.5 font-mono font-semibold text-brand">{p.partner_code}</td>
                          <td className="px-3 py-2.5 font-medium">{p.name}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap">{p.mobile}</td>
                          <td className="px-3 py-2.5">{p.pharma_company}</td>
                          <td className="px-3 py-2.5">{p.city}</td>
                          <td className="px-3 py-2.5">{p.email}</td>
                          <td className="px-3 py-2.5">
                            {leads.filter((l) => l.partner_code === p.partner_code).length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== Admins tab (super admin only) ===== */}
          {tab === "admins" && isSuper && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white shadow-card p-5">
                <h2 className="font-bold text-slate-700 text-sm">Team</h2>
                <ul className="mt-3 space-y-2">
                  {admins.map((a) => (
                    <li key={a.mobile} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {a.mobile} · {a.role}
                        </p>
                      </div>
                      {a.role !== "superadmin" && (
                        <button
                          onClick={() => manageAdmin("remove", { mobile: a.mobile })}
                          className="rounded-lg border border-red-300 text-red-500 px-3 py-1.5 text-xs font-bold hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white shadow-card p-5">
                <h2 className="font-bold text-slate-700 text-sm">Add Admin</h2>
                <div className="mt-3 space-y-3">
                  <input type="text" placeholder="Name" value={newAdmin.name}
                    onChange={(e) => setNewAdmin((a) => ({ ...a, name: e.target.value }))}
                    className="tap-target w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
                  <input type="tel" placeholder="Mobile (10 digits)" maxLength={10} value={newAdmin.mobile}
                    onChange={(e) => setNewAdmin((a) => ({ ...a, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    className="tap-target w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
                  <input type="text" placeholder="Passcode" value={newAdmin.passcode}
                    onChange={(e) => setNewAdmin((a) => ({ ...a, passcode: e.target.value }))}
                    className="tap-target w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
                  <select value={newAdmin.role}
                    onChange={(e) => setNewAdmin((a) => ({ ...a, role: e.target.value }))}
                    className="tap-target w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30">
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!newAdmin.name || !/^[6-9]\d{9}$/.test(newAdmin.mobile) || !newAdmin.passcode) {
                        setAdminMsg("Fill name, valid mobile and passcode.");
                        return;
                      }
                      manageAdmin("add", newAdmin);
                    }}
                    className="tap-target w-full rounded-xl bg-slate-800 text-white py-3 text-sm font-bold hover:bg-slate-900 transition"
                  >
                    + Add Admin
                  </button>
                </div>
                {adminMsg && <p className="mt-2 text-xs text-slate-500">{adminMsg}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
