import { auth } from "@/auth";
import { BarChart3, Users, DollarSign, Activity } from "lucide-react";

const stats = [
  { name: "Total Revenue", value: "$0.00", icon: DollarSign, change: "+0%" },
  { name: "Active Users", value: "1", icon: Users, change: "+100%" },
  { name: "Subscriptions", value: "0", icon: BarChart3, change: "+0%" },
  { name: "Conversion Rate", value: "0%", icon: Activity, change: "+0%" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {session?.user?.name || "there"}! Here&apos;s your
          overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {stat.name}
              </span>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-green-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick start */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Getting Started
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Complete these steps to set up your account.
        </p>
        <div className="mt-4 space-y-3">
          {[
            { label: "Create your account", done: true },
            { label: "Connect your Stripe account", done: false },
            { label: "Invite your team", done: false },
            { label: "Configure your first product", done: false },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  step.done
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {step.done && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${
                  step.done ? "text-gray-500 line-through" : "text-gray-700"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
