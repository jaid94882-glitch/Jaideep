"use client";

import { useRef } from "react";

/**
 * One labeled document slot with browse + camera capture.
 * The file is held locally and uploaded to Supabase Storage on final submit.
 * `file` is null or { name, size, fileObj, status: "ready" }.
 */
export default function UploadSlot({ label, labelHi, file, onChange }) {
  const browseRef = useRef(null);
  const cameraRef = useRef(null);

  const MAX_BYTES = 10 * 1024 * 1024;

  const pick = (f) => {
    if (f.size > MAX_BYTES) {
      alert("File is larger than 10 MB. Please choose a smaller file.");
      return;
    }
    onChange({ name: f.name, size: f.size, fileObj: f, status: "ready" });
  };

  const formatSize = (bytes) =>
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {labelHi && <p className="text-[11px] text-slate-400">{labelHi}</p>}
        </div>
        {!file && (
          <div className="flex gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => browseRef.current?.click()}
              className="tap-target rounded-lg bg-brand text-white px-3 py-2 text-xs font-semibold hover:bg-brand-dark transition"
            >
              📎 Upload
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              aria-label={`Take a photo of ${label}`}
              className="tap-target rounded-lg border border-brand text-brand px-3 py-2 text-xs font-semibold hover:bg-brand-light transition"
            >
              📷
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg shrink-0">✅</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-600 truncate">{file.name}</p>
            <p className="text-[10px] text-slate-400">
              {formatSize(file.size)} · Attached — sent securely on submit
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label}`}
            className="tap-target px-2 text-slate-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      <input
        ref={browseRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) pick(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) pick(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
