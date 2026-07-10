import "./globals.css";

export const metadata = {
  title: "MR Lead Portal | Doctor Loan Leads, Daily Commissions",
  description:
    "Medical Representatives: submit doctor loan leads in 60 seconds and earn commissions on every funded loan.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1E3A8A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
