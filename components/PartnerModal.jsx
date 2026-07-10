"use client";

import { useState } from "react";

const initial = { name: "", mobile: "", pharma: "", city: "", email: "" };

export default function PartnerModal({ open, onClose }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Enter your full name.";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = "Valid 10-digit mobile required.";
    if (!form.pharma.trim()) err.pharma = "Enter your pharma company.";
    if (!form.city.trim()) err.city = "Enter your city.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Valid email required.";
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1200);
  };

  const close = () => {
    setDone(false);
    setForm(initial);
    setErrors({});
    onClose();
  };

  const inputCls = (bad) =>
    `tap-target w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-brand/30 focus:border-brand ${
      bad ? "border-red-400" : "border-slate-300"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Become a Business Partner"
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="p-8 text-center">
            <div className="text-5xl">🤝</div>
            <h3 className="mt-4 text-2xl font-bold text-success-dark">
              Welcome aboard!
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Thanks {form.name.split(" ")[0]}! Our team will call you on +91{" "}
              {form.mobile} within 24 hours to activate your partner account.
            </p>
            <button
              onClick={close}
              className="tap-target mt-6 w-full rounded-xl bg-success text-white py-3.5 font-semibold hover:bg-success-dark transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-brand">
                  Become a Business Partner
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Register as an MR partner and start earning commissions
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="tap-target px-2 text-2xl text-slate-400 hover:text-slate-600 -mt-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="p-name" className="block text-sm font-semibold text-slate-700">
                  Your Name
                </label>
                <input id="p-name" type="text" placeholder="Rahul Verma" value={form.name}
                  onChange={set("name")} className={`mt-1.5 ${inputCls(errors.name)}`} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="p-mobile" className="block text-sm font-semibold text-slate-700">
                  Mobile Number
                </label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">+91</span>
                  <input id="p-mobile" type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210"
                    value={form.mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm((f) => ({ ...f, mobile: digits }));
                      setErrors((err) => ({ ...err, mobile: undefined }));
                    }}
                    className={`${inputCls(errors.mobile)} rounded-l-none`} />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>

              <div>
                <label htmlFor="p-pharma" className="block text-sm font-semibold text-slate-700">
                  Pharma Company
                </label>
                <input id="p-pharma" type="text" placeholder="Sun Pharma, Cipla…" value={form.pharma}
                  onChange={set("pharma")} className={`mt-1.5 ${inputCls(errors.pharma)}`} />
                {errors.pharma && <p className="mt-1 text-xs text-red-500">{errors.pharma}</p>}
              </div>

              <div>
                <label htmlFor="p-city" className="block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input id="p-city" type="text" placeholder="Lucknow" value={form.city}
                  onChange={set("city")} className={`mt-1.5 ${inputCls(errors.city)}`} />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="p-email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input id="p-email" type="email" placeholder="rahul@example.com" value={form.email}
                  onChange={set("email")} className={`mt-1.5 ${inputCls(errors.email)}`} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="tap-target mt-6 w-full rounded-xl bg-brand text-white py-4 text-base font-bold hover:bg-brand-dark active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting…
                </>
              ) : (
                "Join as Partner →"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
