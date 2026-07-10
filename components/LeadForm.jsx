"use client";

import { useState } from "react";
import DocumentUpload from "./DocumentUpload";

const LOAN_TYPES = [
  { value: "", label: "Select loan type · लोन प्रकार चुनें" },
  { value: "personal", label: "Doctor Personal Loan" },
  { value: "clinic", label: "Clinic Expansion Loan" },
  { value: "equipment", label: "Medical Equipment / Machinery Loan" },
];

const initialForm = {
  doctorName: "",
  phone: "",
  loanType: "",
  amount: "",
};

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!form.doctorName.trim() || form.doctorName.trim().length < 3)
      err.doctorName = "Enter the doctor's full name (min 3 characters).";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s|-/g, "")))
      err.phone = "Enter a valid 10-digit Indian mobile number (starts 6–9).";
    if (!form.loanType) err.loanType = "Please select a loan type.";
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt < 50000)
      err.amount = "Enter an amount of at least ₹50,000.";
    if (files.some((f) => f.status === "uploading"))
      err.files = "Please wait for documents to finish uploading.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setSubmitting(true);
    // Simulate API submission — replace with your aggregator API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <section id="lead-form" className="px-5 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-success-light border border-success/30 p-8 text-center shadow-card">
          <div className="text-5xl">🎉</div>
          <h3 className="mt-4 text-2xl font-bold text-success-dark">
            Lead Submitted! · लीड सबमिट हो गई!
          </h3>
          <p className="mt-2 text-slate-600 text-sm">
            Dr. {form.doctorName}&apos;s lead is now with the aggregator for
            validation. Track status in your pipeline — commission is credited
            the moment the loan is disbursed.
          </p>
          <button
            onClick={() => {
              setForm(initialForm);
              setFiles([]);
              setSubmitted(false);
            }}
            className="tap-target mt-6 rounded-xl bg-success text-white px-8 py-3.5 font-semibold hover:bg-success-dark transition"
          >
            + Submit Another Lead
          </button>
        </div>
      </section>
    );
  }

  const inputBase =
    "tap-target w-full rounded-xl border bg-white px-4 py-3.5 text-base outline-none transition focus:ring-2 focus:ring-brand/30 focus:border-brand";
  const errClass = "border-red-400";
  const okClass = "border-slate-300";

  return (
    <section id="lead-form" className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-brand">
            Submit a Doctor Lead
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            60 seconds. 4 fields. Documents optional at this stage. ·
            सिर्फ 4 फ़ील्ड, 60 सेकंड।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 rounded-2xl bg-white shadow-card p-5 md:p-8 space-y-5"
        >
          {/* Doctor name */}
          <div>
            <label htmlFor="doctorName" className="block text-sm font-semibold text-slate-700">
              Doctor&apos;s Name · डॉक्टर का नाम
            </label>
            <input
              id="doctorName"
              type="text"
              placeholder="Dr. Anil Sharma"
              value={form.doctorName}
              onChange={set("doctorName")}
              className={`mt-1.5 ${inputBase} ${errors.doctorName ? errClass : okClass}`}
              aria-invalid={!!errors.doctorName}
            />
            {errors.doctorName && (
              <p className="mt-1 text-xs text-red-500">{errors.doctorName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
              Doctor&apos;s Phone Number · फ़ोन नंबर
            </label>
            <div className="mt-1.5 flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98765 43210"
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm((f) => ({ ...f, phone: digits }));
                  setErrors((err) => ({ ...err, phone: undefined }));
                }}
                className={`${inputBase} rounded-l-none ${errors.phone ? errClass : okClass}`}
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Loan type */}
          <div>
            <label htmlFor="loanType" className="block text-sm font-semibold text-slate-700">
              Loan Type · लोन का प्रकार
            </label>
            <select
              id="loanType"
              value={form.loanType}
              onChange={set("loanType")}
              className={`mt-1.5 ${inputBase} appearance-none ${errors.loanType ? errClass : okClass} ${form.loanType ? "text-slate-800" : "text-slate-400"}`}
              aria-invalid={!!errors.loanType}
            >
              {LOAN_TYPES.map((t) => (
                <option key={t.value} value={t.value} disabled={t.value === ""}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.loanType && (
              <p className="mt-1 text-xs text-red-500">{errors.loanType}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-slate-700">
              Estimated Loan Amount · अनुमानित राशि
            </label>
            <div className="mt-1.5 flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                ₹
              </span>
              <input
                id="amount"
                type="number"
                inputMode="numeric"
                min={50000}
                step={10000}
                placeholder="10,00,000"
                value={form.amount}
                onChange={set("amount")}
                className={`${inputBase} rounded-l-none ${errors.amount ? errClass : okClass}`}
                aria-invalid={!!errors.amount}
              />
            </div>
            {form.amount && Number(form.amount) >= 50000 && (
              <p className="mt-1 text-xs text-success-dark font-medium">
                Est. commission on disbursal: ₹
                {Math.round(Number(form.amount) * 0.005).toLocaleString("en-IN")}{" "}
                (0.5%)
              </p>
            )}
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Documents */}
          <div className="pt-2 border-t border-slate-100">
            <DocumentUpload files={files} setFiles={setFiles} />
            {errors.files && (
              <p className="mt-1 text-xs text-red-500">{errors.files}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="tap-target w-full rounded-xl bg-success text-white py-4 text-lg font-bold shadow-lg shadow-emerald-200 hover:bg-success-dark active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting…
              </>
            ) : (
              <>Submit Lead &amp; Earn · लीड सबमिट करें →</>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400">
            By submitting, you confirm the doctor has consented to share these
            details for loan processing.
          </p>
        </form>
      </div>
    </section>
  );
}
