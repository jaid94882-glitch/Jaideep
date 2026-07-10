"use client";

import { useRef } from "react";

/**
 * One labeled document slot with browse + camera capture and
 * simulated upload progress. `file` is null or
 * { name, size, progress, status: "uploading" | "done" }.
 */
export default function UploadSlot({ label, labelHi, file, onChange }) {
  const browseRef = useRef(null);
  const cameraRef = useRef(null);

  const start = (f) => {
    const entry = { name: f.name, size: f.size, progress: 0, status: "uploading" };
    onChange(entry);
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(progress + 14 + Math.random() * 16, 100);
      onChange({
        ...entry,
        progress: Math.round(progress),
        status: progress >= 100 ? "done" : "uploading",
      });
      if (progress >= 100) clearInterval(timer);
    }, 220);
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
          <span className="text-lg shrink-0">{file.status === "done" ? "✅" : "⏳"}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-600 truncate">{file.name}</p>
            {file.status === "uploading" ? (
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all duration-200"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">{formatSize(file.size)} · Uploaded</p>
            )}
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
          if (e.target.files?.[0]) start(e.target.files[0]);
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
          if (e.target.files?.[0]) start(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
