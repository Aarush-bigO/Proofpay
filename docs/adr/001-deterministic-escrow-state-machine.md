# ADR 001: Deterministic Escrow State Machine

## Context
Payment disputes in home remodeling often result in arbitrary chargebacks because escrow agents make subjective evaluations without technical knowledge of trade craftsmanship.

## Decision
We enforce a strict finite state machine (FSM) where payment transitions cannot bypass AI code verification:
* `PENDING` ➔ `AUTHORIZED` (Requires homeowner approval via PayPal Orders v2)
* `AUTHORIZED` ➔ `CAPTURED` (Programmatically blocked until AI Compliance Score $\ge$ 80% with 0 Critical safety violations)
* `AUTHORIZED` ➔ `VOIDED` (Permitted if defects remain unaddressed)

## Consequences
* Eliminates arbitrary non-payment by homeowners.
* Protects homeowners from substandard contractor workmanship.
