"use client";

import { useRef, useState, useCallback } from "react";

const DOC_HINTS = [
  "KYC (Aadhaar / PAN)",
  "Medical Registration Certificate",
  "Bank Statements (6 months)",
];

export default function DocumentUpload({ files, setFiles }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (fileList) => {
      const incoming = Array.from(fileList).map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size,
        status: "uploading",
        progress: 0,
      }));
      setFiles((prev) => [...prev, ...incoming]);

      // Simulated upload with progress
      incoming.forEach((file) => {
        let progress = 0;
        const timer = setInterval(() => {
          progress = Math.min(progress + 12 + Math.random() * 18, 100);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress: Math.round(progress),
                    status: progress >= 100 ? "done" : "uploading",
                  }
                : f
            )
          );
          if (progress >= 100) clearInterval(timer);
        }, 250);
      });
    },
    [setFiles]
  );

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes) =>
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">
        Doctor&apos;s Documents · डॉक्टर के दस्तावेज़
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {DOC_HINTS.join(" · ")}
      </p>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        className={`mt-3 rounded-2xl border-2 border-dashed p-6 text-center transition ${
          dragOver
            ? "border-success bg-success-light"
            : "border-slate-300 bg-slate-50"
        }`}
      >
        <div className="text-3xl">📄</div>
        <p className="mt-2 text-sm text-slate-600">
          Drag &amp; drop files here, or
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="tap-target rounded-xl bg-brand text-white px-6 py-3 text-sm font-semibold hover:bg-brand-dark active:scale-[0.98] transition"
          >
            Browse Files · फ़ाइल चुनें
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="tap-target rounded-xl border-2 border-brand text-brand px-6 py-3 text-sm font-semibold hover:bg-brand-light active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Take a Photo · फोटो लें
          </button>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          PDF, JPG, PNG · Max 10 MB per file · 🔒 Encrypted in transit
        </p>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="rounded-xl bg-white border border-slate-200 p-3 flex items-center gap-3"
            >
              <span className="text-xl shrink-0">
                {f.status === "done" ? "✅" : "⏳"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {f.name}
                </p>
                {f.status === "uploading" ? (
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-200"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    {formatSize(f.size)} · Uploaded
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(f.id)}
                aria-label={`Remove ${f.name}`}
                className="tap-target px-3 text-slate-400 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
