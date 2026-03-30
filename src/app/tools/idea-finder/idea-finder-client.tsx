"use client";

import { useState } from "react";
import Link from "next/link";

interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  isPremium: boolean;
  tags: string[];
}

interface Props {
  articles: ArticleCard[];
}

const SKILLS = [
  { id: "software", label: "Software development" },
  { id: "marketing", label: "Marketing" },
  { id: "design", label: "Design" },
  { id: "finance", label: "Finance / Accounting" },
  { id: "sales", label: "Sales" },
  { id: "writing", label: "Writing / Content" },
  { id: "operations", label: "Operations" },
  { id: "healthcare", label: "Healthcare" },
] as const;

const GOALS = [
  { id: "saas", label: "Build a SaaS product" },
  { id: "service", label: "Start a service business" },
  { id: "ecommerce", label: "Launch an ecommerce store" },
  { id: "passive", label: "Create passive income" },
  { id: "solo", label: "Build a solo business" },
] as const;

const BUDGETS = [
  { id: "low", label: "Under $1,000" },
  { id: "mid", label: "$1,000 – $10,000" },
  { id: "high", label: "$10,000+" },
] as const;

type SkillId = (typeof SKILLS)[number]["id"];
type GoalId = (typeof GOALS)[number]["id"];
type BudgetId = (typeof BUDGETS)[number]["id"];

const SKILL_TAGS: Record<SkillId, string[]> = {
  software: ["saas", "tech-startup", "app-ideas", "micro-saas", "b2b-saas", "app-development", "startup-ideas", "tech-startup-ideas"],
  marketing: ["creator-economy", "online-business", "marketing", "online-business-ideas"],
  design: ["app-ideas", "saas", "app-development", "unique-business-ideas"],
  finance: ["fintech", "compliance", "regtech", "accounting", "high-margin-business"],
  sales: ["sales", "b2b-saas", "crm", "consulting", "consulting-business-ideas", "b2b-business"],
  writing: ["creator-economy", "passive-income", "side-hustle", "freelancing", "freelance-business-ideas"],
  operations: ["vertical-saas", "automation", "crm", "field-service", "smb"],
  healthcare: ["healthcare", "healthtech"],
};

const GOAL_TAGS: Record<GoalId, string[]> = {
  saas: ["saas", "saas-startup-ideas", "b2b-saas", "micro-saas", "app-ideas", "tech-startup-ideas", "startup-ideas"],
  service: ["consulting", "freelancing", "professional-services", "consulting-business-ideas", "freelance-business-ideas", "b2b-business"],
  ecommerce: ["ecommerce", "dropshipping", "online-store", "dtc", "ecommerce-business-ideas", "dropshipping-business-ideas", "subscription-box-business"],
  passive: ["passive-income", "side-hustle", "extra-income", "passive-income-ideas", "side-hustle-ideas"],
  solo: ["solopreneur", "micro-saas", "solo-founder", "one-person-business", "solopreneur-business-ideas"],
};

const BUDGET_TAGS: Record<BudgetId, string[]> = {
  low: ["micro-saas", "solo-founder", "side-hustle", "passive-income", "home-business-ideas", "freelancing", "work-from-home"],
  mid: ["saas", "dropshipping", "ecommerce", "b2b-saas", "consulting", "saas-startup-ideas"],
  high: ["enterprise-saas", "vertical-saas", "marketplace", "b2b-data", "healthcare", "regtech", "compliance"],
};

const GOAL_CATEGORIES: Record<GoalId, string[]> = {
  saas: ["SaaS Ideas", "SaaS Ideas"],
  service: ["Business Ideas"],
  ecommerce: ["Business Ideas", "Entrepreneurship"],
  passive: ["Side Hustles & Income"],
  solo: ["SaaS Ideas", "Side Hustles & Income"],
};

function scoreArticle(
  article: ArticleCard,
  skills: SkillId[],
  goal: GoalId,
  budget: BudgetId
): number {
  let score = 0;
  const articleTags = article.tags.map((t) => t.toLowerCase());
  const articleCategory = article.categoryName;

  // Skills scoring (2 pts per tag match)
  for (const skill of skills) {
    for (const tag of SKILL_TAGS[skill]) {
      if (articleTags.includes(tag)) score += 2;
    }
  }

  // Goal scoring (3 pts per tag match, 4 pts for category match)
  for (const tag of GOAL_TAGS[goal]) {
    if (articleTags.includes(tag)) score += 3;
  }
  if (GOAL_CATEGORIES[goal]?.includes(articleCategory)) score += 4;

  // Budget scoring (1 pt per tag match)
  for (const tag of BUDGET_TAGS[budget]) {
    if (articleTags.includes(tag)) score += 1;
  }

  return score;
}

function getRecommendations(
  articles: ArticleCard[],
  skills: SkillId[],
  goal: GoalId,
  budget: BudgetId
): ArticleCard[] {
  const scored = articles.map((article) => ({
    article,
    score: scoreArticle(article, skills, goal, budget),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-break: prefer free articles
    if (!a.article.isPremium && b.article.isPremium) return -1;
    if (a.article.isPremium && !b.article.isPremium) return 1;
    return 0;
  });

  return scored
    .filter((s) => s.score > 0)
    .slice(0, 5)
    .map((s) => s.article);
}

export function IdeaFinderClient({ articles }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | "results">(1);
  const [selectedSkills, setSelectedSkills] = useState<SkillId[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalId | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<BudgetId | null>(null);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  function toggleSkill(id: SkillId) {
    setSelectedSkills((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  function handleNext() {
    if (step === 1 && selectedSkills.length > 0) setStep(2);
    else if (step === 2 && selectedGoal) setStep(3);
    else if (step === 3 && selectedBudget) setStep("results");
  }

  function handleReset() {
    setStep(1);
    setSelectedSkills([]);
    setSelectedGoal(null);
    setSelectedBudget(null);
    setEmail("");
    setSubscribeStatus("idle");
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubscribeStatus("error");
        setSubscribeMessage(data.error ?? "Something went wrong");
        return;
      }
      setSubscribeStatus("success");
      setSubscribeMessage("You're in! Weekly startup ideas coming to your inbox.");
      setEmail("");
    } catch {
      setSubscribeStatus("error");
      setSubscribeMessage("Something went wrong. Please try again.");
    }
  }

  const recommendations =
    step === "results" && selectedGoal && selectedBudget
      ? getRecommendations(articles, selectedSkills, selectedGoal, selectedBudget)
      : [];

  const stepNumber = step === "results" ? 4 : step;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
          Free Tool
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Startup Idea Finder
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Answer 3 quick questions. Get 3–5 startup ideas matched to your skills, goals, and budget.
        </p>
      </div>

      {/* Progress bar */}
      {step !== "results" && (
        <div className="mb-10">
          <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
            <span>Step {stepNumber} of 3</span>
            <span>{Math.round(((stepNumber - 1) / 3) * 100)}% complete</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((stepNumber - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Skills */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What are your strongest skills?
          </h2>
          <p className="text-sm text-gray-500 mb-6">Pick up to 3.</p>
          <div className="grid grid-cols-2 gap-3">
            {SKILLS.map((skill) => {
              const selected = selectedSkills.includes(skill.id);
              const disabled = !selected && selectedSkills.length >= 3;
              return (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  disabled={disabled}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : disabled
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {skill.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            disabled={selectedSkills.length === 0}
            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Goals */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What&apos;s your primary goal?
          </h2>
          <p className="text-sm text-gray-500 mb-6">Pick one.</p>
          <div className="flex flex-col gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition-colors ${
                  selectedGoal === goal.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedGoal}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Budget */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            What&apos;s your starting budget?
          </h2>
          <p className="text-sm text-gray-500 mb-6">Pick one.</p>
          <div className="flex flex-col gap-3">
            {BUDGETS.map((budget) => (
              <button
                key={budget.id}
                onClick={() => setSelectedBudget(budget.id)}
                className={`rounded-xl border px-4 py-4 text-left text-sm font-medium transition-colors ${
                  selectedBudget === budget.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {budget.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedBudget}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Find ideas →
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {step === "results" && (
        <div>
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 mb-3">
              Your matches
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {recommendations.length > 0
                ? `Here are ${recommendations.length} ideas for you`
                : "No exact matches found"}
            </h2>
            {recommendations.length === 0 && (
              <p className="mt-3 text-gray-600">
                Try adjusting your answers — we have 35+ startup ideas across many categories.
              </p>
            )}
          </div>

          {recommendations.length > 0 && (
            <div className="flex flex-col gap-4 mb-10">
              {recommendations.map((article) => (
                <Link
                  key={article.slug}
                  href={`/ideas/${article.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {article.categoryName}
                        </span>
                        {article.isPremium && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Pro
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <span className="shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors mt-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Want more ideas like these?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our free list — new startup ideas with market analysis every week.
            </p>
            {subscribeStatus === "success" ? (
              <p className="text-sm font-medium text-green-600">{subscribeMessage}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {subscribeStatus === "loading" ? "Joining..." : "Join free"}
                </button>
              </form>
            )}
            {subscribeStatus === "error" && (
              <p className="mt-2 text-xs text-red-600">{subscribeMessage}</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
