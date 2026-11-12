# ProofPay Dispute Resolution Playbook

## Overview
Traditional home improvement disputes take 30 to 90 days to adjudicate through financial dispute bureaus. ProofPay collapses this window to **under 5 minutes** by utilizing deterministic cryptographic dossiers.

---

## The 4-Step Non-Repudiation Model

1. **Pre-Work Baseline:**
   Original high-resolution photos and timestamps are bound to the PayPal Authorization ID (`AUTH-PP-...`).

2. **Automated Citation Grounding:**
   Any detected deviation is matched against explicit National Electrical Code articles (e.g. *NEC 314.16 Box Overfill*). Subjective aesthetic complaints are separated from objective code non-compliance.

3. **Remediation Window:**
   The contractor receives exact code-grounded instructions to fix the issue and submits a side-by-side corrected photo.

4. **Cryptographic Settlement:**
   * **If fixed:** AI verifies compliance $\ge$ 80%, unlocking the PayPal `CAPTURE` payout.
   * **If ignored:** The homeowner can click "Void Hold & Refund", calling PayPal Payments v2 `VOID` to release the hold back to their balance.
