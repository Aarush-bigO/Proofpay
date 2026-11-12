# Multimodal AI Vision & Code Compliance Specification

## Model Foundation
ProofPay utilizes **Anthropic Claude Sonnet 4.5 Vision** (`claude-sonnet-4-5-20250929`) combined with dynamic prompt injection of the **National Electrical Code (NEC 2023)** and **California Building Standards Code (Title 24)**.

## Hallucination Guard Architecture
To ensure zero hallucinations in high-stakes payment environments:
1. **Deterministic Citations Only:** Claude is instructed to cite *only* code sections present in `lib/codes/nec.ts`.
2. **Visual Evidence Grounding:** Every identified violation requires an exact visual anchor string describing what is visible in the pixels (e.g. *"Neutral conductor tag on right terminal bar slightly tilted"*).
3. **Structured JSON Output:** Responses are constrained to strict TypeScript interfaces with automated syntax fallback.
