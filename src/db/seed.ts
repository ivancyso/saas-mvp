import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { categories, articles } from "./schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

const CATEGORIES = [
  {
    name: "SaaS",
    slug: "saas",
    description: "Software-as-a-Service business opportunities",
  },
  {
    name: "Fintech",
    slug: "fintech",
    description: "Financial technology and payments innovation",
  },
  {
    name: "AI & ML",
    slug: "ai-ml",
    description: "Artificial intelligence and machine learning ventures",
  },
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    description: "Healthcare, fitness, and wellness startups",
  },
  {
    name: "Creator Economy",
    slug: "creator-economy",
    description: "Tools and platforms for creators and influencers",
  },
  {
    name: "Climate Tech",
    slug: "climate-tech",
    description: "Sustainability and clean technology opportunities",
  },
];

async function seed() {
  console.log("Seeding categories...");
  const insertedCategories = await db
    .insert(categories)
    .values(CATEGORIES)
    .onConflictDoNothing()
    .returning();

  const catMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));

  // If categories already existed, fetch them
  if (insertedCategories.length === 0) {
    const existing = await db.select().from(categories);
    for (const c of existing) {
      catMap.set(c.slug, c.id);
    }
  }

  console.log("Seeding articles...");
  const ARTICLES = [
    {
      title: "AI-Powered Resume Screening for SMBs",
      slug: "ai-resume-screening-smbs",
      excerpt:
        "Small businesses spend 23 hours per hire on resume review. An AI tool purpose-built for sub-100-employee companies could capture a $4.2B market.",
      content: `<h2>The Opportunity</h2>
<p>Small and medium businesses (SMBs) are the backbone of the economy, yet they lack access to the AI-powered hiring tools that enterprises use. While companies like Greenhouse and Lever serve the enterprise market at $15K+/year, there's a massive gap for businesses with 10-100 employees who are hiring 5-20 people per year.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $4.2B — There are 6.1M SMBs in the US alone that hire regularly.</p>
<p><strong>SAM:</strong> $1.8B — Focusing on US businesses with 10-100 employees in knowledge work sectors.</p>
<p><strong>SOM:</strong> $180M — Capturing 10% of the serviceable market in the first 5 years.</p>

<h2>Competitive Landscape</h2>
<p>Current players like Greenhouse ($15K+/yr), Lever ($12K+/yr), and Ashby ($10K+/yr) all target enterprise. Indeed and ZipRecruiter offer basic tools but lack AI screening. The gap is clear: no one owns AI-powered hiring for SMBs at $99-299/month.</p>

<h2>Revenue Model</h2>
<p>Self-serve subscription at $99/mo (Starter) and $249/mo (Growth). Annual contracts with 20% discount. Expected ARPU of $2,400/year with 85% gross margins.</p>

<h2>Execution Playbook</h2>
<ol>
<li><strong>Month 1-2:</strong> Build MVP with resume parsing, AI scoring, and basic ATS features</li>
<li><strong>Month 3-4:</strong> Beta with 50 SMBs, iterate on scoring accuracy</li>
<li><strong>Month 5-6:</strong> Launch on Product Hunt, content marketing push</li>
<li><strong>Month 7-12:</strong> Scale to 500 paying customers, introduce Growth tier</li>
</ol>

<h2>Key Risks</h2>
<ul>
<li>AI bias in hiring decisions — mitigate with regular audits and transparent scoring</li>
<li>Incumbents moving downmarket — but enterprise DNA makes SMB UX hard to nail</li>
<li>Regulatory changes in AI hiring (NYC Local Law 144) — build compliance-first</li>
</ul>`,
      categoryId: catMap.get("ai-ml"),
      isPremium: true,
      authorName: "Alex Chen",
      publishedAt: new Date("2026-03-15"),
    },
    {
      title: "Subscription Snack Boxes for Remote Teams",
      slug: "subscription-snack-boxes-remote-teams",
      excerpt:
        "Remote-first companies struggle to build culture. A curated snack subscription solves a real problem — and the unit economics are fantastic.",
      content: `<h2>The Opportunity</h2>
<p>With 35% of US workers now fully remote, companies are desperately looking for ways to build team culture. Snack boxes might seem simple, but they're a $2.1B market growing at 12% annually. The remote work angle is underserved.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $2.1B — US corporate snack and gift market.</p>
<p><strong>SAM:</strong> $680M — Remote-first companies with 10+ employees.</p>
<p><strong>SOM:</strong> $68M — Capturable in 3 years with strong GTM.</p>

<h2>Why Now</h2>
<p>Remote work isn't going away. Companies that previously spent $50K+/year on office snacks now have zero budget for in-person perks. Redirecting even 20% of that spend to home delivery creates a massive opportunity.</p>

<h2>Revenue Model</h2>
<p>$35-65 per employee per month depending on box size. Average company orders for 25 employees = $1,000/month. With 70% gross margins after fulfillment costs.</p>

<h2>Execution Playbook</h2>
<ol>
<li><strong>Month 1:</strong> Source snack suppliers, design box experience</li>
<li><strong>Month 2-3:</strong> Pilot with 10 remote companies, collect feedback</li>
<li><strong>Month 4-6:</strong> Launch Shopify-based ordering, LinkedIn outbound to HR leaders</li>
<li><strong>Month 7-12:</strong> Scale to 200 companies, introduce dietary customization</li>
</ol>`,
      categoryId: catMap.get("creator-economy"),
      isPremium: false,
      authorName: "Maya Patel",
      publishedAt: new Date("2026-03-10"),
    },
    {
      title: "Carbon Credit Marketplace for Small Farms",
      slug: "carbon-credit-marketplace-small-farms",
      excerpt:
        "Small farms generate carbon credits but can't access markets. A platform connecting them to corporate buyers could unlock $800M in stranded value.",
      content: `<h2>The Opportunity</h2>
<p>The voluntary carbon credit market hit $2B in 2025 and is projected to reach $50B by 2030. But small farms — which collectively manage 40% of US farmland — are almost completely locked out. The verification, paperwork, and market access barriers are too high for a 200-acre operation.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $50B — Projected voluntary carbon market by 2030.</p>
<p><strong>SAM:</strong> $5B — Agricultural carbon credits from small-to-medium farms.</p>
<p><strong>SOM:</strong> $250M — US small farm segment, capturable with marketplace approach.</p>

<h2>Competitive Landscape</h2>
<p>Indigo Ag and Nori focus on large operations. Pachama uses satellite for forestry. No one has built the "Stripe for small farm carbon credits" — dead simple onboarding, automated verification, and instant market access.</p>

<h2>Revenue Model</h2>
<p>15% take rate on credit transactions. Average small farm generates $5-15K in credits/year. With 10,000 farms on the platform, that's $15-22M in annual revenue at 90%+ gross margins.</p>

<h2>Key Risks</h2>
<ul>
<li>Carbon credit price volatility — mitigate with futures and guaranteed minimums</li>
<li>Verification accuracy challenges — partner with established verification bodies</li>
<li>Policy changes — diversify across voluntary and compliance markets</li>
</ul>`,
      categoryId: catMap.get("climate-tech"),
      isPremium: true,
      authorName: "Jordan Rivera",
      publishedAt: new Date("2026-03-05"),
    },
    {
      title: "Embedded Insurance for Gig Workers",
      slug: "embedded-insurance-gig-workers",
      excerpt:
        "72M Americans gig work, but traditional insurance doesn't fit their income patterns. Usage-based insurance embedded into gig platforms is a $12B gap.",
      content: `<h2>The Opportunity</h2>
<p>Gig workers need insurance but can't afford or qualify for traditional plans. They need coverage that flexes with their income — active when they're working, paused when they're not. Embedded insurance APIs that plug into gig platforms solve this perfectly.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $12B — Insurance spend by gig workers in the US.</p>
<p><strong>SAM:</strong> $4B — Delivery, rideshare, and freelance platform workers.</p>
<p><strong>SOM:</strong> $400M — Achievable through 3-5 major platform partnerships.</p>

<h2>Revenue Model</h2>
<p>API-based pricing: platforms pay per-active-worker-per-day. Pricing ranges from $1.50-4.00/worker/day depending on coverage. Revenue share with insurance carrier partners at 25-35% of premium.</p>

<h2>Execution Playbook</h2>
<ol>
<li><strong>Month 1-3:</strong> Secure MGA license or partner with existing carrier</li>
<li><strong>Month 4-6:</strong> Build API, integrate with one mid-tier gig platform</li>
<li><strong>Month 7-9:</strong> Launch, iterate on pricing and UX based on claims data</li>
<li><strong>Month 10-18:</strong> Expand to 3-5 platforms, target Series A</li>
</ol>`,
      categoryId: catMap.get("fintech"),
      isPremium: true,
      authorName: "Sam Nakamura",
      publishedAt: new Date("2026-02-28"),
    },
    {
      title: "No-Code Internal Tools for Healthcare Clinics",
      slug: "no-code-tools-healthcare-clinics",
      excerpt:
        "Healthcare clinics run on spreadsheets and faxes. A HIPAA-compliant no-code tool builder could modernize 250K+ practices.",
      content: `<h2>The Opportunity</h2>
<p>There are 250,000+ outpatient clinics in the US, and most still manage workflows with spreadsheets, paper forms, and outdated software. Tools like Retool and Airtable aren't HIPAA-compliant out of the box, leaving a massive gap.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $8.5B — Healthcare practice management software market.</p>
<p><strong>SAM:</strong> $2.1B — Small-to-medium outpatient clinics (1-20 providers).</p>
<p><strong>SOM:</strong> $210M — Capturable with vertical no-code approach.</p>

<h2>Why No-Code</h2>
<p>Every clinic has unique workflows — patient intake, referral management, prior auth tracking, lab result routing. Custom software is $100K+. No-code lets a clinic office manager build exactly what they need in hours, not months.</p>

<h2>Revenue Model</h2>
<p>$199/mo per clinic (Starter), $499/mo (Pro with integrations), $999/mo (Enterprise with EHR connections). Expected ARPU $4,200/year.</p>`,
      categoryId: catMap.get("saas"),
      isPremium: false,
      authorName: "Alex Chen",
      publishedAt: new Date("2026-02-20"),
    },
    {
      title: "Peer-to-Peer Fitness Coaching Platform",
      slug: "p2p-fitness-coaching-platform",
      excerpt:
        "Personal training is a $15B market but 80% of trainers are independent with no tech stack. A platform connecting them to clients takes a modern approach.",
      content: `<h2>The Opportunity</h2>
<p>The personal training market is massive but fragmented. 80% of certified personal trainers work independently, managing clients through texts, spreadsheets, and Venmo. Meanwhile, consumers are tired of impersonal fitness apps and want real human coaching.</p>

<h2>Market Size</h2>
<p><strong>TAM:</strong> $15B — US personal training and coaching market.</p>
<p><strong>SAM:</strong> $6B — Independent trainers offering virtual/hybrid coaching.</p>
<p><strong>SOM:</strong> $300M — Platform-mediated independent coaching market.</p>

<h2>Revenue Model</h2>
<p>10% take rate on trainer bookings + $29/mo SaaS fee for trainer tools (scheduling, programming, progress tracking). Average trainer earns $4K/mo through platform = $400/mo revenue per trainer.</p>

<h2>Execution Playbook</h2>
<ol>
<li><strong>Month 1-2:</strong> Build trainer profile and client matching MVP</li>
<li><strong>Month 3-4:</strong> Onboard 100 trainers in 3 metro areas</li>
<li><strong>Month 5-8:</strong> Add programming tools, progress tracking, payments</li>
<li><strong>Month 9-12:</strong> Expand to 10 cities, launch marketplace SEO</li>
</ol>`,
      categoryId: catMap.get("health-wellness"),
      isPremium: true,
      authorName: "Maya Patel",
      publishedAt: new Date("2026-02-15"),
    },
  ];

  await db.insert(articles).values(ARTICLES).onConflictDoNothing();

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
