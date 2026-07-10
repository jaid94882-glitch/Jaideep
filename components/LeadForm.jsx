"use client";

import { useState } from "react";
import UploadSlot from "./UploadSlot";

const LOAN_TYPES = [
  { value: "", label: "Select loan type · लोन प्रकार चुनें" },
  { value: "personal", label: "Doctor Personal Loan" },
  { value: "clinic", label: "Clinic Expansion Loan" },
  { value: "equipment", label: "Medical Equipment / Machinery Loan" },
];

const LOAN_PURPOSES = [
  { value: "", label: "Select purpose · उद्देश्य चुनें" },
  { value: "clinic-expansion", label: "Clinic / Hospital Expansion" },
  { value: "new-equipment", label: "New Medical Equipment" },
  { value: "working-capital", label: "Working Capital" },
  { value: "new-clinic", label: "Setting Up New Clinic" },
  { value: "personal", label: "Personal Use" },
  { value: "other", label: "Other" },
];

const SPECIALITIES = [
  "", "General Physician", "Dentist", "Gynaecologist", "Paediatrician",
  "Orthopaedic", "Cardiologist", "Dermatologist", "ENT", "Ophthalmologist",
  "Radiologist", "Surgeon", "Other",
];

const STEPS = [
  { id: 1, label: "Doctor Info", labelHi: "डॉक्टर जानकारी", icon: "🩺" },
  { id: 2, label: "Loan Requirement", labelHi: "लोन आवश्यकता", icon: "💰" },
  { id: 3, label: "Documents", labelHi: "दस्तावेज़", icon: "📄" },
];

const initialForm = {
  doctorName: "", phone: "", location: "", experience: "", email: "",
  regDate: "", hospital: "", degree: "", speciality: "",
  loanPurpose: "", amount: "", loanType: "",
};

const initialDocs = {
  regCert: null, idProof: null, bankStatement: null, degreeCert: null, clinicProof: null,
};

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [docs, setDocs] = useState(initialDocs);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const setDoc = (key) => (file) => setDocs((d) => ({ ...d, [key]: file }));

  const validateStep = (s) => {
    const err = {};
    if (s === 1) {
      if (form.doctorName.trim().length < 3) err.doctorName = "Enter the doctor's full name.";
      if (!/^[6-9]\d{9}$/.test(form.phone)) err.phone = "Valid 10-digit mobile required (starts 6–9).";
      if (!form.location.trim()) err.location = "Enter city / location.";
      const exp = Number(form.experience);
      if (form.experience === "" || isNaN(exp) || exp < 0 || exp > 60)
        err.experience = "Enter years of practice (0–60).";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Valid email required.";
      if (!form.regDate) err.regDate = "Select the registration date.";
      else if (new Date(form.regDate) > new Date()) err.regDate = "Date cannot be in the future.";
      if (!form.hospital.trim()) err.hospital = "Enter hospital / clinic name.";
      if (!form.degree.trim()) err.degree = "Enter degree (e.g. MBBS, MD).";
      if (!form.speciality) err.speciality = "Select a speciality.";
    }
    if (s === 2) {
      if (!form.loanPurpose) err.loanPurpose = "Select the loan purpose.";
      const amt = Number(form.amount);
      if (!form.amount || isNaN(amt) || amt < 50000) err.amount = "Minimum amount is ₹50,000.";
      if (!form.loanType) err.loanType = "Select a loan type.";
    }
    if (s === 3) {
      if (Object.values(docs).some((f) => f && f.status === "uploading"))
        err.docs = "Please wait for uploads to finish.";
    }
    return err;
  };

  const next = () => {
    const err = validateStep(step);
    setErrors(err);
    if (Object.keys(err).length) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateStep(3);
    setErrors(err);
    if (Object.keys(err).length) return;
    setSubmitting(true);
    // Simulate API submission — replace with your aggregator API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const inputCls = (bad) =>
    `tap-target w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-brand/30 focus:border-brand ${
      bad ? "border-red-400" : "border-slate-300"
    }`;

  const Err = ({ k }) =>
    errors[k] ? <p className="mt-1 text-xs text-red-500">{errors[k]}</p> : null;

  if (submitted) {
    return (
      <section id="lead-form" className="px-5 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-success-light border border-success/30 p-8 text-center shadow-card">
          <div className="text-5xl">🎉</div>
          <h3 className="mt-4 text-2xl font-bold text-success-dark">
            Lead Submitted! · लीड सबमिट हो गई!
          </h3>
          <p className="mt-2 text-slate-600 text-sm">
            Dr. {form.doctorName}&apos;s lead is with the aggregator for validation.
            Commission is credited the moment the loan is disbursed.
          </p>
          <button
            onClick={() => {
              setForm(initialForm);
              setDocs(initialDocs);
              setStep(1);
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

  return (
    <section id="lead-form" className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-brand">Submit a Doctor Lead</h2>
          <p className="mt-1 text-sm text-slate-500">
            3 quick steps · 3 आसान स्टेप — डॉक्टर जानकारी, लोन आवश्यकता, दस्तावेज़
          </p>
        </div>

        {/* Step tabs */}
        <div className="mt-6 flex gap-1.5">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex-1 rounded-xl px-2 py-2.5 text-center transition border-2 ${
                s.id === step
                  ? "bg-brand text-white border-brand"
                  : s.id < step
                  ? "bg-success-light text-success-dark border-success/40"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              <span className="block text-base">{s.id < step ? "✓" : s.icon}</span>
              <span className="block text-[11px] font-bold leading-tight mt-0.5">{s.label}</span>
              <span className="block text-[9px] opacity-80">{s.labelHi}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-4 rounded-2xl bg-white shadow-card p-5 md:p-8">
          {/* ===== STEP 1: Doctor Information ===== */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="doctorName" className="block text-sm font-semibold text-slate-700">
                  Doctor&apos;s Name · डॉक्टर का नाम
                </label>
                <input id="doctorName" type="text" placeholder="Dr. Anil Sharma" value={form.doctorName}
                  onChange={set("doctorName")} className={`mt-1.5 ${inputCls(errors.doctorName)}`} />
                <Err k="doctorName" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                    Mobile Number · मोबाइल
                  </label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">+91</span>
                    <input id="phone" type="tel" inputMode="numeric" maxLength={10} placeholder="98765 43210"
                      value={form.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setForm((f) => ({ ...f, phone: digits }));
                        setErrors((err) => ({ ...err, phone: undefined }));
                      }}
                      className={`${inputCls(errors.phone)} rounded-l-none`} />
                  </div>
                  <Err k="phone" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-700">
                    Location · स्थान
                  </label>
                  <input id="location" type="text" placeholder="Lucknow, UP" value={form.location}
                    onChange={set("location")} className={`mt-1.5 ${inputCls(errors.location)}`} />
                  <Err k="location" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-slate-700">
                    Experience (years) · अनुभव
                  </label>
                  <input id="experience" type="number" inputMode="numeric" min={0} max={60} placeholder="12"
                    value={form.experience} onChange={set("experience")}
                    className={`mt-1.5 ${inputCls(errors.experience)}`} />
                  <Err k="experience" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email · ईमेल
                  </label>
                  <input id="email" type="email" placeholder="dr.anil@example.com" value={form.email}
                    onChange={set("email")} className={`mt-1.5 ${inputCls(errors.email)}`} />
                  <Err k="email" />
                </div>
              </div>

              <div>
                <label htmlFor="regDate" className="block text-sm font-semibold text-slate-700">
                  Medical Registration Date · पंजीकरण तिथि
                </label>
                <input id="regDate" type="date" value={form.regDate} onChange={set("regDate")}
                  className={`mt-1.5 ${inputCls(errors.regDate)}`} />
                <Err k="regDate" />
              </div>

              <UploadSlot
                label="Registration Certificate"
                labelHi="पंजीकरण प्रमाणपत्र (MCI/SMC)"
                file={docs.regCert}
                onChange={setDoc("regCert")}
              />

              <div>
                <label htmlFor="hospital" className="block text-sm font-semibold text-slate-700">
                  Hospital / Clinic Name · अस्पताल / क्लिनिक
                </label>
                <input id="hospital" type="text" placeholder="Sharma Multispeciality Clinic" value={form.hospital}
                  onChange={set("hospital")} className={`mt-1.5 ${inputCls(errors.hospital)}`} />
                <Err k="hospital" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="degree" className="block text-sm font-semibold text-slate-700">
                    Degree · डिग्री
                  </label>
                  <input id="degree" type="text" placeholder="MBBS, MD" value={form.degree}
                    onChange={set("degree")} className={`mt-1.5 ${inputCls(errors.degree)}`} />
                  <Err k="degree" />
                </div>
                <div>
                  <label htmlFor="speciality" className="block text-sm font-semibold text-slate-700">
                    Speciality · विशेषज्ञता
                  </label>
                  <select id="speciality" value={form.speciality} onChange={set("speciality")}
                    className={`mt-1.5 ${inputCls(errors.speciality)} ${form.speciality ? "text-slate-800" : "text-slate-400"}`}>
                    {SPECIALITIES.map((sp) => (
                      <option key={sp} value={sp} disabled={sp === ""}>
                        {sp === "" ? "Select · चुनें" : sp}
                      </option>
                    ))}
                  </select>
                  <Err k="speciality" />
                </div>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Loan Requirement ===== */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="loanPurpose" className="block text-sm font-semibold text-slate-700">
                  Loan Purpose · लोन का उद्देश्य
                </label>
                <select id="loanPurpose" value={form.loanPurpose} onChange={set("loanPurpose")}
                  className={`mt-1.5 ${inputCls(errors.loanPurpose)} ${form.loanPurpose ? "text-slate-800" : "text-slate-400"}`}>
                  {LOAN_PURPOSES.map((p) => (
                    <option key={p.value} value={p.value} disabled={p.value === ""}>{p.label}</option>
                  ))}
                </select>
                <Err k="loanPurpose" />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-slate-700">
                  Loan Amount · लोन राशि
                </label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">₹</span>
                  <input id="amount" type="number" inputMode="numeric" min={50000} step={10000} placeholder="10,00,000"
                    value={form.amount} onChange={set("amount")}
                    className={`${inputCls(errors.amount)} rounded-l-none`} />
                </div>
                {form.amount && Number(form.amount) >= 50000 && (
                  <p className="mt-1 text-xs text-success-dark font-medium">
                    Est. commission on disbursal: ₹{Math.round(Number(form.amount) * 0.005).toLocaleString("en-IN")} (0.5%)
                  </p>
                )}
                <Err k="amount" />
              </div>

              <div>
                <label htmlFor="loanType" className="block text-sm font-semibold text-slate-700">
                  Loan Type · लोन का प्रकार
                </label>
                <select id="loanType" value={form.loanType} onChange={set("loanType")}
                  className={`mt-1.5 ${inputCls(errors.loanType)} ${form.loanType ? "text-slate-800" : "text-slate-400"}`}>
                  {LOAN_TYPES.map((t) => (
                    <option key={t.value} value={t.value} disabled={t.value === ""}>{t.label}</option>
                  ))}
                </select>
                <Err k="loanType" />
              </div>
            </div>
          )}

          {/* ===== STEP 3: Upload Documents ===== */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Attach what you have now — the rest can be collected later. 🔒 Encrypted in transit.
              </p>
              <UploadSlot label="ID Proof (Aadhaar / PAN / Passport)" labelHi="पहचान प्रमाण"
                file={docs.idProof} onChange={setDoc("idProof")} />
              <UploadSlot label="Bank Statement (Last 6 months)" labelHi="बैंक स्टेटमेंट"
                file={docs.bankStatement} onChange={setDoc("bankStatement")} />
              <UploadSlot label="Medical Degree Certificate" labelHi="मेडिकल डिग्री प्रमाणपत्र"
                file={docs.degreeCert} onChange={setDoc("degreeCert")} />
              <UploadSlot label="Clinic / Hospital Proof" labelHi="क्लिनिक / अस्पताल प्रमाण"
                file={docs.clinicProof} onChange={setDoc("clinicProof")} />
              {errors.docs && <p className="text-xs text-red-500">{errors.docs}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button type="button" onClick={back}
                className="tap-target rounded-xl border-2 border-slate-300 text-slate-600 px-6 py-3.5 font-semibold hover:bg-slate-50 transition">
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={next}
                className="tap-target flex-1 rounded-xl bg-brand text-white py-3.5 text-base font-bold hover:bg-brand-dark active:scale-[0.99] transition">
                Next · आगे →
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="tap-target flex-1 rounded-xl bg-success text-white py-3.5 text-base font-bold shadow-lg shadow-emerald-200 hover:bg-success-dark active:scale-[0.99] transition disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting…
                  </>
                ) : (
                  <>Submit Lead &amp; Earn · सबमिट करें →</>
                )}
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            By submitting, you confirm the doctor has consented to share these details for loan processing.
          </p>
        </form>
      </div>
    </section>
  );
}
