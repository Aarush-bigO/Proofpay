# PayPal Orders v2 & Payments v2 FinTech Architecture

## Background
ProofPay uses PayPal's two-step authorization and capture architecture to implement an automated, non-custodial milestone escrow mechanism for skilled residential contracting trades.

## Transaction Sequence

```
Homeowner                       ProofPay Server                   PayPal Sandbox
   │                                  │                                  │
   │─── 1. Book & Deposit ───────────>│                                  │
   │                                  │─── 2. POST /v2/checkout/orders ─>│
   │                                  │       (intent: AUTHORIZE)        │
   │                                  │<── 3. 201 Created (Order ID) ────│
   │                                  │                                  │
   │                                  │─── 4. POST /authorize ──────────>│
   │                                  │<── 5. 201 Authorized (Auth ID) ──│
   │<── 6. Escrow Vault Locked ───────│                                  │
   │                                  │                                  │
   │   [Contractor Work Completed & AI NEC Vision Inspection >= 80%]     │
   │                                  │                                  │
   │─── 7. 1-Click Release Payout ───>│                                  │
   │                                  │─── 8. POST /capture ────────────>│
   │                                  │<── 9. 201 Captured (Capture ID) ─│
   │<── 10. Live Receipt Generated ───│                                  │
```

## Economic Model
* **Gross Milestone:** Paid by Homeowner.
* **PayPal Standard Processing:** 2.9% + $0.30 deducted directly by PayPal upon capture.
* **Net Balance:** Disbursed instantly to the Contractor's wallet without 5-day wire delays.
