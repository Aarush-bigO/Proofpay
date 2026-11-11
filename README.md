# ProofPay 🛡️⚡

> **AI-Inspected Milestone Escrow & Dispute Shield on PayPal**  
> Built for the **PayPal AI Hackathon 2026**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![PayPal Developer](https://img.shields.io/badge/PayPal-Orders_v2_Escrow-003087?logo=paypal)](https://developer.paypal.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Claude Sonnet 4.5](https://img.shields.io/badge/Claude-Sonnet_4.5-d97706?logo=anthropic)](https://www.anthropic.com/)

---

## 📌 The \$500 Billion Problem

In home services, contracting, and trade jobs (electrical, plumbing, HVAC, remodeling):
* **Homeowners fear being scammed**: Paying large upfront deposits only to receive substandard work, code violations, or contractor abandonment.
* **Contractors fear being stiffed**: Completing \$2,500+ in labor and materials, only to have clients delay payment, dispute invoices, or refuse to pay.
* **PayPal's Opportunity**: While PayPal powers billions in traditional retail checkout, high-value milestone-gated blue-collar commerce remains largely unserved by modern digital escrow.

---

## 💡 The Solution: ProofPay

**ProofPay** bridges homeowner security and contractor trust by pairing **PayPal's Authorization & Capture lifecycle** with **multimodal AI vision inspection**:

```
[Homeowner Deposits Funds]
          │
          ▼
┌─────────────────────────┐
│ PayPal Escrow Hold      │  PayPal Orders v2 (`intent: AUTHORIZE`)
│ (Funds Secured Safely)  │
└─────────┬───────────────┘
          │
          ▼  Contractor completes work & uploads panel photo
┌─────────────────────────┐
│ AI Vision Inspection    │  Claude Sonnet 4.5 checks against
│ (NEC Safety Compliance) │  National Electrical Code (NEC) standards
└─────────┬───────────────┘
          │
          ▼  Inspection Passes (Green Certificate Generated)
┌─────────────────────────┐
│ 1-Click Release Payout  │  Server triggers PayPal `CAPTURE`
│ (Funds in Contractor's) │  (or `VOID` refund if violations unfixed)
└─────────────────────────┘
```

---

## ✨ Core Features

1. **PayPal Milestone Escrow Holds (`Orders v2`)**
   * Uses `intent: "AUTHORIZE"` to lock funds securely in escrow without immediate settlement.
   * Eliminates chargeback disputes before they happen by tying payouts to objective verification.

2. **AI-Powered Code Compliance & Safety Inspection**
   * Inspects electrical panels, wiring, conduits, and circuits using Claude Sonnet 4.5 Vision.
   * Validates against 17+ **National Electrical Code (NEC)** rules (e.g., NEC 408.4 panel labels, NEC 250.50 grounding, NEC 310.16 ampacity).
   * Generates actionable fix recommendations and severity ratings (Critical, Major, Minor).

3. **Cryptographic Proof Dossier & Tamper-Evident Logs**
   * Side-by-side before/after re-verification with resolution audit trails.
   * Downloadable, tamper-evident completion certificates with PayPal transaction references.

4. **Interactive Merchant & Contractor Cockpit**
   * Track portfolio completion rates, compliance trends, and pending escrow balances.
   * Real-time PayPal Sandbox integration with live simulated transactions for flawless demos.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript
* **Styling & UI**: Tailwind CSS 4, shadcn/ui, Lucide Icons, Recharts
* **AI & Vision Engine**: Anthropic Claude Sonnet 4.5 (`@anthropic-ai/sdk`)
* **Payment Engine**: PayPal Orders v2 REST API (Authorization, Capture, Void)
* **Storage & State**: Client-side resilient persistence + Server Actions

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Aarush-bigO/Proofpay.git
cd Proofpay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```bash
# Anthropic API Key for AI Vision Inspection
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# PayPal Sandbox Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Hackathon Submission Checklist

- [x] Fullstack Next.js App Router & TypeScript
- [x] PayPal Orders v2 Authorization & Capture Escrow
- [x] Real-time AI Vision Inspection
- [x] Clean, responsive dark-mode UI
- [x] End-to-end interactive demo flow
