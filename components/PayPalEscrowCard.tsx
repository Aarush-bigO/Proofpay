"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface PayPalEscrowCardProps {
  jobId: string;
  jobTitle: string;
  budgetAmount: number;
  jobStatus: string;
  assignedWorkerName?: string;
  posterName?: string;
  onStatusChange?: (newStatus: string) => void;
}

interface EscrowRecord {
  orderId: string;
  authorizationId: string;
  amount: number;
  currency: string;
  status: "AUTHORIZED" | "CAPTURED" | "VOIDED";
  createdAt: string;
  captureId?: string;
  capturedAt?: string;
  fee?: number;
  netPayout?: number;
  aiScore?: number;
}

export function PayPalEscrowCard({
  jobId,
  jobTitle,
  budgetAmount,
  jobStatus,
  assignedWorkerName = "Contractor",
  posterName = "Homeowner",
  onStatusChange,
}: PayPalEscrowCardProps) {
  const [escrow, setEscrow] = useState<EscrowRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load persisted escrow state for this job from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(`proofpay_escrow_${jobId}`);
      if (stored) {
        setEscrow(JSON.parse(stored));
      } else if (jobStatus === "in-progress" || jobStatus === "matched") {
        // Pre-initialize demo escrow hold for in-progress jobs
        const initialRecord: EscrowRecord = {
          orderId: `8X77492${jobId.replace(/\D/g, "").slice(0, 4) || "01"}`,
          authorizationId: `AUTH-PP-SANDBOX-${jobId.slice(0, 6).toUpperCase() || "DEMO"}`,
          amount: budgetAmount,
          currency: "USD",
          status: "AUTHORIZED",
          createdAt: new Date().toISOString(),
        };
        setEscrow(initialRecord);
        localStorage.setItem(`proofpay_escrow_${jobId}`, JSON.stringify(initialRecord));
      }
    } catch (e) {
      console.warn("Could not load escrow state from storage:", e);
    }
  }, [jobId, budgetAmount, jobStatus]);

  const saveEscrowState = (record: EscrowRecord | null) => {
    setEscrow(record);
    if (typeof window !== "undefined") {
      if (record) {
        localStorage.setItem(`proofpay_escrow_${jobId}`, JSON.stringify(record));
      } else {
        localStorage.removeItem(`proofpay_escrow_${jobId}`);
      }
    }
  };

  const copyToClipboard = (text: string, idType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idType);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Authorize Escrow Deposit (PayPal Orders v2)
  const handleAuthorizeEscrow = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/escrow/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: budgetAmount,
          jobId,
          jobTitle,
          currency: "USD",
        }),
      });

      const data = await res.json();
      if (data.success) {
        const record: EscrowRecord = {
          orderId: data.orderId,
          authorizationId: data.authorizationId,
          amount: data.amount,
          currency: data.currency,
          status: "AUTHORIZED",
          createdAt: data.createdAt,
        };
        saveEscrowState(record);
        if (onStatusChange) onStatusChange("in-progress");
      }
    } catch (err) {
      console.error("Authorize error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Simulate AI Inspection Verification Pass (Claude 4.5 Vision)
  const handleSimulateAiPass = () => {
    if (!escrow) return;
    const updated: EscrowRecord = {
      ...escrow,
      aiScore: 94,
    };
    saveEscrowState(updated);
  };

  // 3. Capture Escrow Release (PayPal Payments v2)
  const handleCaptureEscrow = async () => {
    if (!escrow) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/escrow/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorizationId: escrow.authorizationId,
          amount: escrow.amount,
          currency: escrow.currency,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updated: EscrowRecord = {
          ...escrow,
          status: "CAPTURED",
          captureId: data.captureId,
          capturedAt: data.capturedAt,
          fee: data.fee,
          netPayout: data.netPayout,
        };
        saveEscrowState(updated);
        if (onStatusChange) onStatusChange("completed");
      }
    } catch (err) {
      console.error("Capture error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Void Hold (Dispute/Cancellation)
  const handleVoidEscrow = async () => {
    if (!escrow) return;
    if (!confirm("Are you sure you want to void this escrow hold and return funds to the homeowner?")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/escrow/void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorizationId: escrow.authorizationId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updated: EscrowRecord = {
          ...escrow,
          status: "VOIDED",
        };
        saveEscrowState(updated);
      }
    } catch (err) {
      console.error("Void error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4 border-2 border-blue-600/30 shadow-md bg-gradient-to-br from-white via-slate-50 to-blue-50/20 overflow-hidden">
      {/* Top Banner with PayPal FinTech Badge */}
      <div className="bg-[#003087] px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          {/* PayPal Monogram Logo */}
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-black text-xs text-[#003087]">
            P
          </div>
          <span className="font-bold text-sm tracking-wide">
            PayPal Milestone Escrow Vault
          </span>
        </div>
        <Badge className="bg-[#0079C1] hover:bg-[#0079C1] text-white text-[10px] font-semibold tracking-wider uppercase border-0">
          Orders v2 Sandbox
        </Badge>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* STATE 1: PENDING DEPOSIT */}
        {!escrow && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-semibold mb-0.5">Dual-Sided Financial Protection</p>
                Funds are held in a secure PayPal <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">AUTHORIZE</code> hold.
                The contractor is guaranteed payment upon verified completion; the homeowner’s funds are never released without AI proof.
              </div>
            </div>

            <Button
              onClick={handleAuthorizeEscrow}
              disabled={isLoading}
              className="w-full bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-bold py-6 text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Lock className="w-4 h-4 text-[#003087]" />
              {isLoading ? "Connecting to PayPal Sandbox..." : `Authorize $${budgetAmount.toLocaleString()} Escrow Deposit with PayPal`}
            </Button>
          </div>
        )}

        {/* STATE 2: HELD IN ESCROW (LOCKED) */}
        {escrow && escrow.status === "AUTHORIZED" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-lg border border-blue-200">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Funds Locked in Escrow
                </div>
                <div className="text-xl font-black text-slate-900">
                  ${escrow.amount.toLocaleString()}.00 <span className="text-xs font-medium text-slate-500">USD</span>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1">
                HELD
              </Badge>
            </div>

            {/* Authorization ID & Metadata */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">PayPal Authorization ID:</span>
                <button
                  onClick={() => copyToClipboard(escrow.authorizationId, "auth")}
                  className="flex items-center gap-1 font-mono font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded"
                >
                  {escrow.authorizationId}
                  {copiedId === "auth" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Release Condition:</span>
                <span className="font-semibold text-slate-800">
                  Claude 4.5 Vision NEC Score ≥ 80%
                </span>
              </div>
            </div>

            {/* AI Inspection Status Card */}
            {escrow.aiScore ? (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI Inspection Passed ({escrow.aiScore}% Certified)
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[10px]">
                    NEC Compliant
                  </Badge>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Verified NEC Article 408.4 panel labeling & NEC 250.50 bonding standards. Release authorization unlocked.
                </p>

                <Button
                  onClick={handleCaptureEscrow}
                  disabled={isLoading}
                  className="w-full bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-bold py-5 text-xs flex items-center justify-center gap-2 mt-2 shadow-sm"
                >
                  <Unlock className="w-4 h-4 text-[#003087]" />
                  {isLoading ? "Executing PayPal Capture..." : `Release $${escrow.amount.toLocaleString()} Payout to ${assignedWorkerName} (CAPTURE)`}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-snug">
                    <span className="font-semibold">Payout Guard Active: </span>
                    Funds cannot be released until the contractor uploads job photos and passes the multimodal AI inspection.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/analyze" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1 border-blue-300 text-blue-700 hover:bg-blue-50">
                      <Zap className="w-3.5 h-3.5" />
                      Run AI Scan
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSimulateAiPass}
                    className="w-full text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Simulate AI Pass
                  </Button>
                </div>
              </div>
            )}

            {/* Void Button */}
            <div className="text-right pt-1">
              <button
                onClick={handleVoidEscrow}
                disabled={isLoading}
                className="text-[11px] text-red-600 hover:text-red-800 hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Void Hold & Refund Homeowner
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: CAPTURED & COMPLETED */}
        {escrow && escrow.status === "CAPTURED" && (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Milestone Payout Disbursed
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      Processed via PayPal Payments v2
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-700 text-white text-xs">
                  COMPLETED
                </Badge>
              </div>

              <div className="border-t border-emerald-200/70 pt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-emerald-900">
                  <span>Gross Payout:</span>
                  <span className="font-bold">${escrow.amount.toLocaleString()}.00 USD</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>PayPal Standard Processing Fee:</span>
                  <span>-${escrow.fee?.toFixed(2) || "35.10"} USD</span>
                </div>
                <div className="flex justify-between text-emerald-950 font-bold border-t border-emerald-200 pt-1 text-sm">
                  <span>Net to {assignedWorkerName}:</span>
                  <span className="text-emerald-700 font-extrabold">
                    ${escrow.netPayout?.toFixed(2) || (escrow.amount - 35.1).toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="p-2 bg-white/80 rounded border border-emerald-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">PayPal Capture ID:</span>
                <span className="font-mono font-bold text-emerald-800">
                  {escrow.captureId || "CAP-SANDBOX-9LP332014"}
                </span>
              </div>
            </div>

            <Link href="/results/demo-analysis-15" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-slate-300 text-slate-700">
                <ExternalLink className="w-3.5 h-3.5" />
                View Cryptographic Proof Dossier & Certificate
              </Button>
            </Link>
          </div>
        )}

        {/* STATE 4: VOIDED */}
        {escrow && escrow.status === "VOIDED" && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Escrow Hold Voided (Refund Complete)
            </div>
            <p className="text-red-700 leading-relaxed">
              The PayPal authorization hold was voided. No funds were debited, and the full escrow balance of ${escrow.amount.toLocaleString()} has been safely retained by {posterName}.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveEscrowState(null)}
              className="text-xs text-slate-600"
            >
              Reset Escrow State
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
