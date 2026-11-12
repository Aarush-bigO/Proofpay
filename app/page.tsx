"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Shield,
  TrendingUp,
  Globe,
  MapPin,
  ArrowRight,
  Zap,
  Lock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { isDemoLoaded, loadDemoDataFromSeed } from "@/lib/storage";
import {
  DEMO_PROFILE,
  DEMO_ANALYSES,
  DEMO_SKILL_SCORES,
} from "@/data/demo-data";

const features = [
  {
    icon: Lock,
    title: "PayPal Milestone Escrow",
    description:
      "Funds locked safely via PayPal Orders v2 AUTHORIZE hold. Programmatically released to contractors via Payments v2 once AI confirms code compliance.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    highlight: true,
  },
  {
    icon: Zap,
    title: "Multimodal AI Inspection",
    description:
      "Snap before/after photos of wiring, conduit, and breaker panels. Claude 4.5 Vision flags IS 732 / NEC violations with interactive coordinate markers.",
    color: "text-amber-500",
    bg: "bg-amber-50",
    highlight: false,
  },
  {
    icon: Globe,
    title: "Cross-Jurisdiction Skills Passport",
    description:
      "Automatic reciprocity mapping across Indian state DISCOMs (BESCOM Karnataka, MSEDCL Maharashtra, TPDDL Delhi, TSSPDCL Telangana) and international codes.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Cryptographic Skill Portfolio",
    description:
      "Build a tamper-proof track record of verified electrical jobs with public verification URLs and detailed compliance certificates.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    highlight: false,
  },
];

export default function Home() {
  useEffect(() => {
    if (!isDemoLoaded()) {
      loadDemoDataFromSeed(DEMO_PROFILE, DEMO_ANALYSES, DEMO_SKILL_SCORES);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hackathon Evaluator Fast-Track Banner */}
      <div className="bg-gradient-to-r from-[#003087] via-[#0070BA] to-[#003087] text-white px-4 py-2.5 text-xs shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PayPal AI Hackathon Demo</span>
          </div>
          <Link
            href="/marketplace/jobs/job-1"
            className="flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors"
          >
            <span>Live Escrow Demo</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 pb-8">
        {/* Location & Jurisdiction Chip */}
        <div className="flex justify-center mb-5">
          <Badge className="bg-white text-slate-700 border border-slate-200 text-xs gap-1.5 px-3 py-1 shadow-sm">
            <MapPin className="w-3 h-3 text-blue-600" />
            Bengaluru, Karnataka (BESCOM / IS 732)
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ProofPay
            </h1>
          </div>
          <p className="text-base font-bold text-slate-800 mb-2">
            Autonomous Milestone Escrow & AI Code Compliance
          </p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Protecting homeowners and electricians with PayPal Orders v2 escrow holds, released automatically when Claude AI Vision certifies electrical safety.
          </p>
        </div>

        {/* Live System Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-base font-extrabold text-blue-700">$5,500</div>
            <div className="text-[10px] text-slate-500 font-medium">Escrow in Hold</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-base font-extrabold text-emerald-600">100%</div>
            <div className="text-[10px] text-slate-500 font-medium">AI-Governed</div>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
            <div className="text-base font-extrabold text-slate-900">35</div>
            <div className="text-[10px] text-slate-500 font-medium">Verified Pros</div>
          </div>
        </div>

        {/* Dual Primary Call-to-Actions */}
        <div className="space-y-2.5 mb-8">
          <Link href="/analyze" className="block">
            <Button className="w-full h-13 text-base bg-[#0070BA] hover:bg-[#005EA6] active:bg-[#003087] text-white rounded-xl flex items-center justify-center gap-2.5 shadow-md shadow-blue-200">
              <Camera className="w-5 h-5" />
              Check Work with AI Vision
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/marketplace/jobs/job-1" className="block">
            <Button
              variant="outline"
              className="w-full h-11 text-xs border-2 border-blue-600/30 bg-blue-50/50 hover:bg-blue-100/60 text-blue-900 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              Test PayPal Milestone Escrow Vault ($5,500 Job)
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Core Architecture
          </h2>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={
                  feature.highlight
                    ? "border-2 border-blue-600/40 bg-gradient-to-br from-white to-blue-50/30 shadow-sm"
                    : "border-slate-200 bg-white"
                }
              >
                <CardContent className="flex items-start gap-3.5 p-4">
                  <div
                    className={`${feature.bg} p-2 rounded-xl shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {feature.title}
                      </h3>
                      {feature.highlight && (
                        <Badge className="bg-[#003087] text-white text-[9px] px-1.5 py-0 font-bold uppercase tracking-wider">
                          PayPal v2
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Route Shortcuts for Judges */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Judge Fast-Track Navigation
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/marketplace/workers"
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-700 font-medium"
            >
              <span>35 Verified Pros</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/passport"
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-700 font-medium"
            >
              <span>Skills Passport</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/marketplace/swipe"
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-700 font-medium"
            >
              <span>Swipe Matcher</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/results/demo-analysis-1"
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-700 font-medium"
            >
              <span>Proof Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
