# ProofPay API Specification & Reference

This document outlines the REST API endpoints provided by the ProofPay Next.js App Router server.

---

## 1. Escrow Rails

### `POST /api/escrow/authorize`
Locks milestone funds in a secure PayPal escrow authorization hold.

* **Request Body:**
  ```json
  {
    "amount": 1200,
    "jobId": "job-1",
    "jobTitle": "Main Panel Upgrade",
    "currency": "USD"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "orderId": "8X7749204PUZNEC",
    "authorizationId": "AUTH-PP-PUZNEC3841",
    "amount": 1200,
    "currency": "USD",
    "status": "AUTHORIZED",
    "createdAt": "2026-11-12T08:29:03.841Z"
  }
  ```

---

### `POST /api/escrow/capture`
Executes capture of the authorized hold and disburses funds to the contractor's PayPal wallet once AI inspection clears.

* **Request Body:**
  ```json
  {
    "authorizationId": "AUTH-PP-PUZNEC3841",
    "amount": 1200,
    "currency": "USD"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "captureId": "CAP-SL2HN43844",
    "fee": 35.10,
    "netPayout": 1164.90,
    "capturedAt": "2026-11-12T08:29:03.844Z"
  }
  ```

---

### `POST /api/escrow/void`
Voids the authorization hold and returns all funds to the homeowner.

* **Request Body:**
  ```json
  {
    "authorizationId": "AUTH-PP-PUZNEC3841"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "voidedAt": "2026-11-12T08:29:03.844Z",
    "message": "PayPal authorization hold successfully voided."
  }
  ```

---

## 2. Multimodal AI Inspection

### `POST /api/analyze`
Submits a base64-encoded image for multimodal NEC code analysis.

* **Request Body:**
  ```json
  {
    "image": "data:image/jpeg;base64,...",
    "workType": "electrical_panel",
    "userDescription": "Upgraded 200A service panel",
    "jurisdiction": "California"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "id": "analysis-uuid",
    "compliance_score": 94,
    "is_compliant": true,
    "violations": [...],
    "correct_items": [...],
    "skills_demonstrated": [...]
  }
  ```
