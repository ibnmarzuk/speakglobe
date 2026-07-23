import React, { useState } from "react";
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  Shield, 
  Lock, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";

export default function Billing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [activePlan, setActivePlan] = useState<"free" | "pro" | "enterprise">("pro");
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState("");

  const plans = [
    {
      id: "free",
      name: "Global Explorer",
      priceMonthly: 0,
      priceAnnual: 0,
      desc: "Perfect for casual, self-guided verbal testing.",
      features: [
        "1 speaking session daily limit",
        "Standard Web Speech API transcription",
        "Simple clarity & pace diagnostics",
        "Limited 4-week roadmap template preview"
      ]
    },
    {
      id: "pro",
      name: "Assertive Professional",
      priceMonthly: 29,
      priceAnnual: 19,
      desc: "For software professionals, job seekers, and founders.",
      features: [
        "Flawless unlimited speaking rehearsals",
        "AI Swiss Executive Phrasing Alignment checks",
        "Real-time background noise & environmental check",
        "Continuous micro-coaching feed overlay",
        "Interactive eye focus webcam diagnostics",
        "Detailed historical progress tracking charts"
      ],
      tag: "MOST POPULAR"
    },
    {
      id: "enterprise",
      name: "Executive Organization",
      priceMonthly: 149,
      priceAnnual: 99,
      desc: "Engineered for high-scale teams, cohorts, and organizations.",
      features: [
        "All Assertive Professional capabilities",
        "Company culture simulators (McKinsey, Apple, Google)",
        "Durable team synchronization & cohort leaderboard",
        "Direct custom API keys proxy proxying",
        "Dedicated linguistic coach consultations",
        "Enterprise single sign-on (SSO) integration"
      ]
    }
  ];

  const invoices = [
    { id: "inv-8472", date: "Jul 15, 2026", amount: "$19.00", status: "Paid", description: "Assertive Professional - Annual Checkpoint" },
    { id: "inv-4321", date: "Jun 15, 2026", amount: "$19.00", status: "Paid", description: "Assertive Professional - Annual Checkpoint" },
  ];

  const handleSimulateCheckout = (planName: string) => {
    setSelectedCheckoutPlan(planName);
    setShowCheckoutSuccess(true);
    setTimeout(() => setShowCheckoutSuccess(false), 4500);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">SECURE PAYMENT MANAGEMENT</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Billing & Pricing</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Manage your premium subscription plan, review tax invoices, or modify billing intervals effortlessly under bank-grade encryption protocols.
        </p>
      </div>

      {/* Plan Switcher Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-editorial-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 shrink-0">
            <CreditCard size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-editorial-muted uppercase block">ACTIVE SUBSCRIPTION</span>
            <span className="text-sm font-bold text-editorial-dark block">Assertive Professional (Active)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-editorial-muted">Billing Cycle:</span>
          <div className="flex border border-editorial-border p-0.5 bg-editorial-light-gray">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase cursor-pointer ${
                !isAnnual ? "bg-white text-editorial-dark font-bold border border-editorial-border" : "text-editorial-muted"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase cursor-pointer ${
                isAnnual ? "bg-white text-editorial-dark font-bold border border-editorial-border" : "text-editorial-muted"
              }`}
            >
              Annual (-35%)
            </button>
          </div>
        </div>
      </div>

      {showCheckoutSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs leading-relaxed font-light flex gap-3 items-start animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>CHECKOUT CONFIRMED:</strong> Successfully simulated subscription to the <strong>{selectedCheckoutPlan}</strong> tier. Your premium tokens have been loaded immediately.
          </div>
        </div>
      )}

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = activePlan === p.id;
          const price = isAnnual ? p.priceAnnual : p.priceMonthly;
          
          return (
            <div 
              key={p.id}
              className={`p-8 bg-white border relative flex flex-col justify-between min-h-[460px] rounded-none ${
                isCurrent 
                  ? "border-indigo-600 shadow-md ring-1 ring-indigo-600" 
                  : "border-editorial-border hover:border-neutral-400 transition-colors"
              }`}
            >
              {p.tag && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-[8px] font-mono font-bold tracking-widest px-3 py-1 border border-indigo-600">
                  {p.tag}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-editorial-dark">{p.name}</h3>
                  <p className="text-[11px] text-editorial-muted font-light leading-relaxed mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-light tracking-tight text-editorial-dark">${price}</span>
                  <span className="text-xs text-editorial-muted font-light font-mono uppercase">/ month</span>
                </div>

                <ul className="space-y-2.5 text-xs text-editorial-muted font-light">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <Check size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-editorial-border mt-6">
                <button
                  onClick={() => {
                    if (isCurrent) return;
                    handleSimulateCheckout(p.name);
                  }}
                  disabled={isCurrent}
                  className={`w-full py-3 font-mono text-[10px] uppercase tracking-widest cursor-pointer font-bold border transition-colors ${
                    isCurrent 
                      ? "bg-indigo-50 border-indigo-100 text-indigo-700 cursor-not-allowed text-center" 
                      : "bg-editorial-dark hover:bg-neutral-800 text-white border-editorial-dark hover:border-neutral-800 text-center"
                  }`}
                >
                  {isCurrent ? "Active Plan" : "Upgrade Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment History Log (col-span-2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-600" /> Secure Payment Invoices
          </h2>

          <div className="bg-white border border-editorial-border overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-editorial-light-gray border-b border-editorial-border text-[9px] font-mono uppercase text-editorial-muted">
                  <th className="p-4 font-bold">Invoice ID</th>
                  <th className="p-4 font-bold">Billing Date</th>
                  <th className="p-4 font-bold">Description</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border font-light text-editorial-muted">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50/50">
                    <td className="p-4 font-mono font-bold text-editorial-dark">{inv.id}</td>
                    <td className="p-4">{inv.date}</td>
                    <td className="p-4">{inv.description}</td>
                    <td className="p-4 font-mono font-bold text-editorial-dark">{inv.amount}</td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-mono uppercase">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security / Encryption checklist (col-span-1) */}
        <div className="space-y-6">
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <Shield size={13} className="text-indigo-600" /> Bank-Grade Encryption
            </h3>

            <div className="space-y-3 pt-1 text-[11px] text-editorial-muted leading-relaxed font-light">
              <div className="flex items-center gap-2 font-semibold text-editorial-dark">
                <Lock size={12} className="text-indigo-600" /> 256-Bit SSL Secured
              </div>
              <p>
                All billing calculations, checkout sessions, and transaction handshakes are processed through AES-256 tokens.
              </p>
              <div className="flex items-center gap-2 font-semibold text-editorial-dark pt-2">
                <Layers size={12} className="text-indigo-600" /> Cloud Run Isolated Sandbox
              </div>
              <p>
                Credentials and billing data are separated from speech analytical endpoints for maximum data containment.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
