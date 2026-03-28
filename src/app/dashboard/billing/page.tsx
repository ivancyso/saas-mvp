"use client";

import { useState } from "react";
import { PLANS } from "@/lib/plans";
import { Check } from "lucide-react";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(priceId: string | null) {
    if (!priceId) return;
    setLoading(priceId);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  async function handlePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
        <p className="mt-1 text-sm text-gray-600">
          You are currently on the <strong>Free</strong> plan.
        </p>
        <button
          onClick={handlePortal}
          disabled={loading === "portal"}
          className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {loading === "portal" ? "Loading..." : "Manage subscription"}
        </button>
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
          ([key, plan]) => (
            <div
              key={key}
              className={`rounded-xl border p-6 ${
                key === "pro"
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-600">/mo</span>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.priceId ? (
                <button
                  onClick={() => handleCheckout(plan.priceId!)}
                  disabled={loading === plan.priceId}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading === plan.priceId ? "Loading..." : `Upgrade to ${plan.name}`}
                </button>
              ) : (
                <div className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-500">
                  Current plan
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
