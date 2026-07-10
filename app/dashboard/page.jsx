"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The dashboard now lives on the home page (Login button in the header).
// This route only redirects old links.
export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">
        Redirecting to the home page — use the Login button there.
      </p>
    </main>
  );
}
