"use client";

import { useState } from "react";
import UploadSlot from "./UploadSlot";
import { insertRow, uploadDocument, callRpc, callEdge, newId } from "@/lib/supabase";

const LOAN_TYPES = [
  { value: "", label: "Select loan type" },
  { value: "personal", label: "Doctor Personal Loan" },
  { value: "clinic", label: "Clinic Expansion Loan" },
  { value: "equipment", label: "Medical Equipment / Machinery Loan" },
];

const LOAN_PURPOSES = [
  { value: "", label: "Select purpose" },
  { value: "clinic-expansion", label: "Clinic / Hospital Expansion" },
  { value: "new-equipment", label: "New Medical Equipment" },
  { value: "working-capital", label: "Working Capital" },
  { value: "new-clinic", label: "Setting Up New Clinic" },
  { value: "personal", label: "Personal Use" },
  { value: "other", label: "Other" },
];

const DEGREES = ["", "MBBS", "MD", "MS", "DM", "MCh", "DNB", "BDS", "MDS"];

const SPECIALITIES = [
  "", "General Physician", "Dentist", "Gynaecologist", "Paediatrician",
  "Orthopaedic", "Cardiologist", "Dermatologist", "ENT", "Ophthalmologist",
  "Radiologist", "Surgeon", "Other",
];

const STEPS = [
  { id: 1, label: "Doctor Info", icon: "🩺" },
  { id: 2, label: "Loan Requirement", icon: "💰" },
  { id: 3, label: "Documents", icon: "📄" },
];

const initialForm = {
  partnerCode: "",
  doctorName: "", phone: "", location: "", experience: "", email: "",
  regDate: "", regNumber: "", medicalCouncil: "", qualYear: "",
  hospital: "", degree: "", speciality: "",
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
  const [leadCode, setLeadCode] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [nmc, setNmc] = useState({ loading: false, rows: null, error: "" });

  // Pre-verification flow: mobile OTP -> registration check -> form
  const [stage, setStage] = useState("mobile"); // "mobile" | "otp" | "reg" | "form"
  const [preMobile, setPreMobile] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [preErr, setPreErr] = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const setDoc = (key) => (file) => setDocs((d) => ({ ...d, [key]: file }));

  const validateStep = (s) => {
    const err = {};
    if (s === 1) {
      if (form.partnerCode.trim() && !/^MR\d{5}$/i.test(form.partnerCode.trim()))
        err.partnerCode = "Partner code looks like MR00001. Leave blank if you don't have one.";
      if (form.doctorName.trim().length < 3) err.doctorName = "Enter the doctor's full name.";
      if (!/^[6-9]\d{9}$/.test(form.phone)) err.phone = "Valid 10-digit mobile required (starts 6–9).";
      if (!form.location.trim()) err.location = "Enter city / location.";
      const exp = Number(form.experience);
      if (form.experience === "" || isNaN(exp) || exp < 0 || exp > 60)
        err.experience = "Enter years of practice (0–60).";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Valid email required.";
      if (!form.regDate) err.regDate = "Select the registration date.";
      else if (new Date(form.regDate) > new Date()) err.regDate = "Date cannot be in the future.";
      if (!form.regNumber.trim() || form.regNumber.trim().length < 3)
        err.regNumber = "Enter the medical registration number.";
      if (!form.medicalCouncil.trim())
        err.medicalCouncil = "Enter the State Medical Council.";
      if (form.qualYear !== "") {
        const y = Number(form.qualYear);
        if (isNaN(y) || y < 1950 || y > new Date().getFullYear())
          err.qualYear = "Enter a valid year (e.g. 2015).";
      }
      if (!form.hospital.trim()) err.hospital = "Enter hospital / clinic name.";
      if (!form.degree) err.degree = "Select a degree.";
      if (!form.speciality) err.speciality = "Select a speciality.";
    }
    if (s === 2) {
      if (!form.loanPurpose) err.loanPurpose = "Select the loan purpose.";
      const amt = Number(form.amount);
      if (!form.amount || isNaN(amt) || amt < 50000) err.amount = "Minimum amount is ₹50,000.";
      if (!form.loanType) err.loanType = "Select a loan type.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enter key on steps 1–2 advances to the next step; only the
    // Documents step can actually submit the lead.
    if (step < 3) {
      next();
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const leadId = newId();
      const attachedDocs = Object.entries(docs).filter(([, f]) => f?.fileObj);
      const row = {
        id: leadId,
        partner_code: form.partnerCode.trim()
          ? form.partnerCode.trim().toUpperCase()
          : null,
        docs_collected: attachedDocs.length,
        doctor_name: form.doctorName.trim(),
        phone: `+91${form.phone}`,
        location: form.location.trim(),
        experience_years: Number(form.experience),
        email: form.email.trim(),
        registration_date: form.regDate,
        registration_number: form.regNumber.trim(),
        medical_council: form.medicalCouncil.trim(),
        qualification_year: form.qualYear === "" ? null : Number(form.qualYear),
        hospital: form.hospital.trim(),
        degree: form.degree,
        speciality: form.speciality,
        loan_purpose: form.loanPurpose,
        loan_amount: Number(form.amount),
        loan_type: form.loanType,
      };
      try {
        // Preferred: RPC returns the generated lead code.
        const res = await callRpc("submit_lead", { p: row });
        setLeadCode(res?.lead_code || "");
      } catch {
        // Fallback: plain insert (code visible only in Supabase).
        await insertRow("leads", row);
      }
      for (const [key, f] of attachedDocs) {
        const safeName = f.name.replace(/[^\w.\-]+/g, "_");
        await uploadDocument(`${leadId}/${key}-${safeName}`, f.fileObj);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        "Submission failed — please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sendOtp = () => {
    setPreErr("");
    if (!/^[6-9]\d{9}$/.test(preMobile)) {
      setPreErr("Enter the doctor's valid 10-digit mobile number.");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDemoOtp(code);
    setOtpInput("");
    setStage("otp");
  };

  const verifyOtpCode = () => {
    setPreErr("");
    if (otpInput !== demoOtp) {
      setPreErr("Incorrect OTP — please check and try again.");
      return;
    }
    setForm((f) => ({ ...f, phone: preMobile }));
    setStage("reg");
  };

  const titleCase = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // NMC row: [slNo, yearOfInfo, regNo, council, name, fatherName, actionHtml]
  const verifyNmc = async () => {
    const regNo = form.regNumber.trim();
    if (regNo.length < 3) {
      setNmc({ loading: false, rows: null, error: "Enter the registration number first." });
      return;
    }
    setNmc({ loading: true, rows: null, error: "" });
    try {
      const res = await callEdge("rapid-function", { reg_no: regNo });
      if (res?.error) throw new Error(res.error);
      const rows = Array.isArray(res?.data) ? res.data : [];
      setNmc({ loading: false, rows, error: "" });
    } catch {
      setNmc({
        loading: false,
        rows: null,
        error: "Could not reach the NMC register right now.",
      });
    }
  };

  const useNmcRow = (r) => {
    setForm((f) => ({
      ...f,
      doctorName: `Dr. ${titleCase(r[4])}`,
      medicalCouncil: r[3] || f.medicalCouncil,
    }));
    setNmc({ loading: false, rows: null, error: "" });
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
            Congratulations! Lead Submitted
          </h3>
          {leadCode && (
            <div className="mt-4 rounded-xl bg-white border-2 border-dashed border-success/50 py-4">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Your Lead ID
              </p>
              <p className="mt-1 text-3xl font-mono font-bold text-success-dark tracking-widest">
                {leadCode}
              </p>
            </div>
          )}
          <p className="mt-3 text-slate-600 text-sm">
            Dr. {form.doctorName}&apos;s lead is with the aggregator for validation.
            {leadCode && " Note this Lead ID to track it in your dashboard."}
            {" "}Commission is credited the moment the loan is disbursed.
          </p>
          <button
            onClick={() => {
              setForm(initialForm);
              setDocs(initialDocs);
              setStep(1);
              setLeadCode("");
              setSubmitted(false);
              setStage("mobile");
              setPreMobile("");
              setDemoOtp("");
              setOtpInput("");
              setPreErr("");
              setNmc({ loading: false, rows: null, error: "" });
            }}
            className="tap-target mt-6 rounded-xl bg-success text-white px-8 py-3.5 font-semibold hover:bg-success-dark transition"
          >
            + Submit Another Lead
          </button>
        </div>
      </section>
    );
  }

  /* ===== Pre-verification: mobile OTP + registration check ===== */
  if (stage !== "form") {
    return (
      <section id="lead-form" className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-brand">
              Verify the Doctor First
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mobile OTP → Registration check → Lead form
            </p>
          </div>

          {/* Progress dots */}
          <div className="mt-5 flex gap-1.5">
            {["Mobile OTP", "Doctor Verify", "Lead Details"].map((label, i) => {
              const active =
                (i === 0 && (stage === "mobile" || stage === "otp")) ||
                (i === 1 && stage === "reg");
              const done = i === 0 && stage === "reg";
              return (
                <div key={label}
                  className={`flex-1 rounded-xl px-2 py-2 text-center text-[11px] font-bold border-2 ${
                    active ? "bg-brand text-white border-brand"
                    : done ? "bg-success-light text-success-dark border-success/40"
                    : "bg-white text-slate-400 border-slate-200"
                  }`}>
                  {done ? "✓ " : ""}{label}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-white shadow-card p-5 md:p-8">
            {/* Stage 1: mobile */}
            {stage === "mobile" && (
              <div>
                <label htmlFor="preMobile" className="block text-sm font-semibold text-slate-700">
                  Doctor&apos;s Mobile Number
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  An OTP will be sent to verify this number belongs to the doctor.
                </p>
                <div className="mt-3 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">+91</span>
                  <input id="preMobile" type="tel" inputMode="numeric" maxLength={10}
                    placeholder="98765 43210" value={preMobile}
                    onChange={(e) => { setPreMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setPreErr(""); }}
                    className="tap-target w-full rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                </div>
                {preErr && <p className="mt-2 text-xs text-red-500">{preErr}</p>}
                <button type="button" onClick={sendOtp}
                  className="tap-target mt-5 w-full rounded-xl bg-brand text-white py-3.5 font-bold hover:bg-brand-dark active:scale-[0.99] transition">
                  Send OTP →
                </button>
              </div>
            )}

            {/* Stage 2: OTP */}
            {stage === "otp" && (
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Enter the OTP sent to +91 {preMobile}
                </p>
                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  🧪 <b>Demo mode</b> — SMS gateway not connected yet. Your OTP is:{" "}
                  <span className="font-mono font-bold text-base">{demoOtp}</span>
                </div>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="6-digit OTP"
                  value={otpInput}
                  onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setPreErr(""); }}
                  className="tap-target mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                {preErr && <p className="mt-2 text-xs text-red-500">{preErr}</p>}
                <button type="button" onClick={verifyOtpCode}
                  className="tap-target mt-4 w-full rounded-xl bg-success text-white py-3.5 font-bold hover:bg-success-dark active:scale-[0.99] transition">
                  Verify OTP ✓
                </button>
                <div className="mt-3 flex justify-between text-xs">
                  <button type="button" onClick={sendOtp} className="text-brand underline">Resend OTP</button>
                  <button type="button" onClick={() => { setStage("mobile"); setPreErr(""); }} className="text-slate-500 underline">Change number</button>
                </div>
              </div>
            )}

            {/* Stage 3: registration check */}
            {stage === "reg" && (
              <div>
                <div className="rounded-xl bg-success-light border border-success/30 px-3 py-2 text-xs text-success-dark font-semibold">
                  ✅ Mobile verified: +91 {preMobile}
                </div>
                <label htmlFor="preReg" className="mt-4 block text-sm font-semibold text-slate-700">
                  Doctor&apos;s Medical Registration Number
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  We check this against the Indian Medical Register (NMC).
                </p>
                <div className="mt-3 flex gap-2">
                  <input id="preReg" type="text" placeholder="10087" value={form.regNumber}
                    onChange={set("regNumber")}
                    className="tap-target w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
                  <button type="button" onClick={verifyNmc} disabled={nmc.loading}
                    className="tap-target shrink-0 rounded-xl bg-brand text-white px-4 text-sm font-bold hover:bg-brand-dark transition disabled:opacity-60">
                    {nmc.loading ? "Checking…" : "🔍 Verify"}
                  </button>
                </div>
                {nmc.loading && (
                  <p className="mt-2 text-xs text-slate-500">
                    Searching the Indian Medical Register — takes about 15 seconds…
                  </p>
                )}
                {(nmc.rows || nmc.error) && (
                  <div className="mt-3 rounded-xl border border-brand/20 bg-brand-light/60 p-3">
                    {nmc.error ? (
                      <p className="text-xs text-slate-600">
                        ⚠️ {nmc.error}{" "}
                        <a href="https://www.nmc.org.in/information-desk/indian-medical-register/"
                          target="_blank" rel="noopener noreferrer" className="text-brand underline">
                          Search manually on NMC
                        </a>
                      </p>
                    ) : nmc.rows.length === 0 ? (
                      <p className="text-xs text-slate-600">
                        ❌ No doctor found with this registration number.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-brand">
                          ✅ Found in the Indian Medical Register — tap the correct doctor:
                        </p>
                        <ul className="mt-2 space-y-2">
                          {nmc.rows.slice(0, 5).map((r, i) => (
                            <li key={i}>
                              <button type="button"
                                onClick={() => { useNmcRow(r); setStage("form"); }}
                                className="w-full text-left rounded-lg bg-white border border-slate-200 p-2.5 hover:border-brand transition">
                                <p className="text-sm font-semibold text-slate-800">{titleCase(r[4])}</p>
                                <p className="text-[11px] text-slate-500">
                                  Reg. {r[2]} · {r[3]} · Year {r[1]}
                                  {r[5] ? ` · Father: ${titleCase(r[5])}` : ""}
                                </p>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
                <button type="button" onClick={() => setStage("form")}
                  className="tap-target mt-4 w-full rounded-xl border-2 border-slate-300 text-slate-600 py-3 text-sm font-semibold hover:bg-slate-50 transition">
                  Skip verification — fill details manually →
                </button>
              </div>
            )}
          </div>
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
            3 quick steps — doctor info, loan requirement, documents
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
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-4 rounded-2xl bg-white shadow-card p-5 md:p-8">
          {/* ===== STEP 1: Doctor Information ===== */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="partnerCode" className="block text-sm font-semibold text-slate-700">
                  Your Partner Code{" "}
                  <span className="font-normal text-slate-400">(optional — links this lead to your dashboard)</span>
                </label>
                <input id="partnerCode" type="text" placeholder="MR00001" value={form.partnerCode}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setForm((f) => ({ ...f, partnerCode: v }));
                    setErrors((err) => ({ ...err, partnerCode: undefined }));
                  }}
                  className={`mt-1.5 ${inputCls(errors.partnerCode)} uppercase tracking-wider`} />
                <Err k="partnerCode" />
              </div>

              <div>
                <label htmlFor="doctorName" className="block text-sm font-semibold text-slate-700">
                  Doctor&apos;s Name
                </label>
                <input id="doctorName" type="text" placeholder="Dr. Anil Sharma" value={form.doctorName}
                  onChange={set("doctorName")} className={`mt-1.5 ${inputCls(errors.doctorName)}`} />
                <Err k="doctorName" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                    Mobile Number
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
                    Location
                  </label>
                  <input id="location" type="text" placeholder="Lucknow, UP" value={form.location}
                    onChange={set("location")} className={`mt-1.5 ${inputCls(errors.location)}`} />
                  <Err k="location" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-slate-700">
                    Experience — Medical Practice (years)
                  </label>
                  <input id="experience" type="number" inputMode="numeric" min={0} max={60} placeholder="12"
                    value={form.experience} onChange={set("experience")}
                    className={`mt-1.5 ${inputCls(errors.experience)}`} />
                  <Err k="experience" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input id="email" type="email" placeholder="dr.anil@example.com" value={form.email}
                    onChange={set("email")} className={`mt-1.5 ${inputCls(errors.email)}`} />
                  <Err k="email" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="regNumber" className="block text-sm font-semibold text-slate-700">
                    Medical Registration Number
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input id="regNumber" type="text" placeholder="10087" value={form.regNumber}
                      onChange={set("regNumber")} className={`${inputCls(errors.regNumber)}`} />
                    <button type="button" onClick={verifyNmc} disabled={nmc.loading}
                      className="tap-target shrink-0 rounded-xl border-2 border-brand text-brand px-3 text-xs font-bold hover:bg-brand-light transition disabled:opacity-60">
                      {nmc.loading ? "…" : "🔍 Verify"}
                    </button>
                  </div>
                  <Err k="regNumber" />
                </div>
                <div>
                  <label htmlFor="regDate" className="block text-sm font-semibold text-slate-700">
                    Medical Registration Date
                  </label>
                  <input id="regDate" type="date" value={form.regDate} onChange={set("regDate")}
                    className={`mt-1.5 ${inputCls(errors.regDate)}`} />
                  <Err k="regDate" />
                </div>
              </div>

              {/* NMC verification results */}
              {(nmc.rows || nmc.error) && (
                <div className="rounded-xl border border-brand/20 bg-brand-light/60 p-3">
                  {nmc.error ? (
                    <p className="text-xs text-slate-600">
                      ⚠️ {nmc.error}{" "}
                      <a href="https://www.nmc.org.in/information-desk/indian-medical-register/"
                        target="_blank" rel="noopener noreferrer"
                        className="text-brand underline">
                        Search manually on NMC
                      </a>
                    </p>
                  ) : nmc.rows.length === 0 ? (
                    <p className="text-xs text-slate-600">
                      ❌ No doctor found with this registration number.{" "}
                      <a href="https://www.nmc.org.in/information-desk/indian-medical-register/"
                        target="_blank" rel="noopener noreferrer"
                        className="text-brand underline">
                        Check on NMC
                      </a>
                    </p>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-brand">
                        ✅ Found {nmc.rows.length} record{nmc.rows.length > 1 ? "s" : ""} in the Indian Medical Register — tap one to autofill:
                      </p>
                      <ul className="mt-2 space-y-2">
                        {nmc.rows.slice(0, 5).map((r, i) => (
                          <li key={i}>
                            <button type="button" onClick={() => useNmcRow(r)}
                              className="w-full text-left rounded-lg bg-white border border-slate-200 p-2.5 hover:border-brand transition">
                              <p className="text-sm font-semibold text-slate-800">
                                {titleCase(r[4])}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Reg. {r[2]} · {r[3]} · Year {r[1]}
                                {r[5] ? ` · Father: ${titleCase(r[5])}` : ""}
                              </p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="medicalCouncil" className="block text-sm font-semibold text-slate-700">
                    State Medical Council
                  </label>
                  <input id="medicalCouncil" type="text" placeholder="Uttarakhand Medical Council"
                    value={form.medicalCouncil} onChange={set("medicalCouncil")}
                    className={`mt-1.5 ${inputCls(errors.medicalCouncil)}`} />
                  <Err k="medicalCouncil" />
                </div>
                <div>
                  <label htmlFor="qualYear" className="block text-sm font-semibold text-slate-700">
                    Qualification Year{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input id="qualYear" type="number" inputMode="numeric" placeholder="2015"
                    value={form.qualYear} onChange={set("qualYear")}
                    className={`mt-1.5 ${inputCls(errors.qualYear)}`} />
                  <Err k="qualYear" />
                </div>
              </div>

              <UploadSlot
                label="Registration Certificate"
                labelHi="MCI / State Medical Council"
                file={docs.regCert}
                onChange={setDoc("regCert")}
              />

              <div>
                <label htmlFor="hospital" className="block text-sm font-semibold text-slate-700">
                  Hospital / Clinic Name
                </label>
                <input id="hospital" type="text" placeholder="Sharma Multispeciality Clinic" value={form.hospital}
                  onChange={set("hospital")} className={`mt-1.5 ${inputCls(errors.hospital)}`} />
                <Err k="hospital" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="degree" className="block text-sm font-semibold text-slate-700">
                    Degree
                  </label>
                  <select id="degree" value={form.degree} onChange={set("degree")}
                    className={`mt-1.5 ${inputCls(errors.degree)} ${form.degree ? "text-slate-800" : "text-slate-400"}`}>
                    {DEGREES.map((d) => (
                      <option key={d} value={d} disabled={d === ""}>
                        {d === "" ? "Select degree" : d}
                      </option>
                    ))}
                  </select>
                  <Err k="degree" />
                </div>
                <div>
                  <label htmlFor="speciality" className="block text-sm font-semibold text-slate-700">
                    Speciality
                  </label>
                  <select id="speciality" value={form.speciality} onChange={set("speciality")}
                    className={`mt-1.5 ${inputCls(errors.speciality)} ${form.speciality ? "text-slate-800" : "text-slate-400"}`}>
                    {SPECIALITIES.map((sp) => (
                      <option key={sp} value={sp} disabled={sp === ""}>
                        {sp === "" ? "Select speciality" : sp}
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
                  Loan Purpose
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
                  Loan Amount
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
                  Loan Type
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
              <UploadSlot label="ID Proof (Aadhaar / PAN / Passport)"
                file={docs.idProof} onChange={setDoc("idProof")} />
              <UploadSlot label="Bank Statement (Last 6 months)"
                file={docs.bankStatement} onChange={setDoc("bankStatement")} />
              <UploadSlot label="Medical Degree Certificate"
                file={docs.degreeCert} onChange={setDoc("degreeCert")} />
              <UploadSlot label="Clinic / Hospital Proof"
                file={docs.clinicProof} onChange={setDoc("clinicProof")} />
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
                Next →
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
                  <>Submit Lead &amp; Earn →</>
                )}
              </button>
            )}
          </div>
          {submitError && (
            <p className="mt-3 text-center text-sm text-red-500">{submitError}</p>
          )}
          <p className="mt-3 text-center text-[11px] text-slate-400">
            By submitting, you confirm the doctor has consented to share these details for loan processing.
          </p>
        </form>
      </div>
    </section>
  );
}
