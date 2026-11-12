import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#003087",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ProofPay — Autonomous Milestone Escrow & AI Code Compliance",
  description:
    "Dual-sided milestone escrow powered by PayPal Orders v2 & Claude AI Vision. Autonomous payment release upon verified electrical code compliance (IS 732 / NEC).",
  keywords: [
    "PayPal Hackathon",
    "PayPal Escrow",
    "Orders v2",
    "Payments v2",
    "AI Code Compliance",
    "Claude Vision",
    "Skilled Trades",
    "Electrician Verification",
    "IS 732",
    "Trade Passport",
  ],
  authors: [{ name: "Aarush Bharti", url: "https://github.com/Aarush-bigO/Proofpay" }],
  creator: "Aarush Bharti (IIIT Bhopal)",
  publisher: "ProofPay",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://proofpay.vercel.app",
    title: "ProofPay — Autonomous Milestone Escrow & AI Code Compliance",
    description:
      "Autonomous milestone escrow for skilled trades. Powered by PayPal Orders v2 & Claude Multimodal AI Vision.",
    siteName: "ProofPay",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofPay — Autonomous Milestone Escrow & AI Code Compliance",
    description:
      "Dual-sided escrow powered by PayPal Orders v2 & Claude AI Vision. Autonomous payment release upon verified electrical code compliance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900`}
      >
        <div className="pb-20 min-h-screen">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
