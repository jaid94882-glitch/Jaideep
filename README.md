# MR Lead Portal

Mobile-first landing page for Medical Representatives to submit doctor loan leads (with documents) to aggregators.

## Stack

Next.js 14 (App Router) · React 18 · Tailwind CSS 3

## Run locally

```bash
cd mr-lead-portal
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `app/page.jsx` — single-page layout
- `components/Hero.jsx` — value proposition + Quick Submit CTA
- `components/MicroDashboard.jsx` — commission earned, pending approvals, pipeline bar
- `components/LeadForm.jsx` — validated lead capture (name, phone, loan type, amount)
- `components/DocumentUpload.jsx` — drag-drop + mobile camera capture with upload progress
- `components/JourneyMap.jsx` — 4-step lead-to-payout tracker
- `components/StickyCTA.jsx` — mobile-only sticky bottom submit button

## Wiring to your backend

`LeadForm.jsx` simulates submission with `setTimeout` — replace with a POST to your aggregator API. `DocumentUpload.jsx` simulates upload progress — replace with real uploads (e.g., S3 presigned URLs). Dashboard numbers in `MicroDashboard.jsx` are placeholders — fetch per-MR data after login.
