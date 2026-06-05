# Autopace

Building an intelligent workflow automation layer for modern real estate tech stacks, designed to eliminate repetitive manual operations across CRM, transaction management, communication, and scheduling platforms.

The platform integrates tools such as Zillow, Follow Up Boss, Dotloop, and email marketing systems into a unified automated workflow engine. A single lead intake can automatically generate CRM records, trigger drip campaigns, schedule showings, update transaction pipelines, and notify teams in real time — reducing operational friction for agents and brokerages.

## Key Highlights

- **Automated 5 high-frequency real estate workflows** responsible for the majority of repetitive administrative work, including lead intake, showing coordination, disclosure preparation, offer management, and close-day logistics
- **Designed scalable workflow templates** capable of reducing manual data-entry workload by up to 70–80% across agent operations
- **Built an event-driven automation architecture** leveraging API integrations and workflow orchestration to synchronize disconnected SaaS platforms
- **Focused heavily on reliability engineering and fault-tolerant automation,** where workflow consistency directly impacts user trust and transaction efficiency
- **Developed with a product-first approach** emphasizing extensibility, customizable edge-case handling, and scalable integration infrastructure

The project explores how intelligent automation can transform fragmented real estate operations into a seamless, low-latency workflow ecosystem for solo agents, teams, and enterprise-scale brokerages.

---

## Tech Stack

### Framework & Frontend

- **Next.js 14** (App Router) — SSR for fast first load, edge middleware for auth, Vercel-native zero-config deploys
- **React Flow** — Nodes + edges + drag-drop built exactly for visual workflow builders; handles the entire visual layer
- **Tailwind CSS** — Utility-first styling for rapid, responsive UI development

### Authentication & Authorization

- **Clerk** — JWT, OAuth, MFA, orgs, roles — covers solo → team → brokerage tiers out of the box

### API & Type Safety

- **tRPC** — End-to-end type safety; eliminates schema drift as integrations expand rapidly
- **Prisma** — Type-safe database ORM with multi-tenant schema design and comprehensive data modeling

### Workflow Engine & Reliability

- **Temporal.io** — Durable execution: a crash mid-workflow resumes exactly where it stopped. Full event history visible in dashboard. This is what makes the reliability promise real — not just retry queues.
- **BullMQ** (Redis) — Fire-and-forget tasks (send email, update a record) that don't need Temporal's overhead
- **Svix** — Managed webhook delivery + retries + portals; agents can inspect their own outbound webhook logs
- **PostgreSQL DLQ table** — Misfires land here, visible in-dashboard — this is the agent feedback loop that drives the roadmap

### Data Layer

- **Supabase** (PostgreSQL) — Row-level security handles multi-tenant isolation at the DB layer; real-time subscriptions power live workflow status
- **pgvector** (Supabase) — Semantic template search; no separate vector DB needed until scale demands it
- **Upstash Redis** — Serverless cache + pub-sub; pricing fits early traffic; rate-limiting SDK pairs directly with API gateway
- **AWS S3** — Disclosure packages, generated PDFs; signed URLs keep documents out of the database

### AI & Intelligence

- **Claude API** (claude-sonnet-4-20250514) — Workflow step suggestions, natural-language editing ("add a reminder 2 days before closing"), automated error diagnosis on misfires
- **Voyage AI** — Template similarity search — "find a workflow like lead intake but for rentals"

### Integration Strategy

**Phase 1: Zapier API**
- Ships Zillow, FUB, Dotloop, Gmail, Outlook connectors in days without maintaining OAuth flows for each platform

**Phase 2 Trigger: Native APIs**
- Native APIs at >10K runs/month per connector
- Zapier per-task cost becomes the signal; migrate connectors one at a time starting with highest-volume (Zillow → FUB)

**Webhook Security: HMAC-SHA256**
- Verify every event payload before it enters the workflow engine; blocks forged-webhook injection attacks

### Infrastructure

- **Vercel** — Frontend host; zero-config deploys, preview environments per PR, edge middleware for auth
- **Railway** — Backend services (Temporal workers + notification + integration hub); simpler than ECS early on, migrates to ECS/EKS cleanly later
- **Cloudflare** — CDN + WAF; DDoS protection, cache headers, edge rate limiting before requests touch origin
- **Doppler** — Central secret management across Vercel, Railway, GitHub Actions — no .env files in repo

### Observability

- **Sentry** — Source-mapped error traces; errors tagged by workflow ID so misfires map to the exact automation
- **Better Stack** — Reliability is the product — SLA tracking and instant alerting on workflow failures maps directly to agent trust
- **PostHog** — Feature flags for safe rollouts; funnel from template purchase → activation → 15-workflow retention threshold

### CI/CD & Testing

- **GitHub Actions** — Vitest + Playwright → lint → build → deploy; branch protection enforced on main

### Billing & Payments

- **Stripe** — Template one-time purchases ($49–$199) + monthly subscriptions ($199/$399) + annual brokerage contracts; usage add-ons for workflow run overages
- **Stripe Connect** (Future) — Marketplace payouts when third-party template creators are onboarded

---

## Project Structure

```
autopace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   ├── page.tsx            # Dashboard home
│   │   └── templates/          # Workflow templates marketplace
│   ├── components/
│   │   ├── ui/                 # Reusable UI components (button, card, badge)
│   │   ├── layout/             # Sidebar and navigation
│   │   └── templates/          # Templates marketplace component
│   └── lib/
│       ├── prisma.ts           # Prisma client
│       └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema with multi-tenant design
│   └── seed.js                 # Seed data for development
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** and **npm** or **yarn**
- **PostgreSQL 14+** for Supabase
- Environment variables configured in `.env.local`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Spectra307/Autopace.git
   cd Autopace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL, API keys, etc.
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server
- `npm run lint` — Run ESLint
- `npm run db:generate` — Generate Prisma client
- `npm run db:seed` — Seed the database

---

## Development Workflow

### Branch Strategy

- `main` — Production-ready code
- `feature/*` — Feature branches for new functionality
- `fix/*` — Bug fix branches

### Creating a Feature

1. Create a new branch from the appropriate base:
   ```bash
   git checkout -b feature/XX-your-feature-name
   ```

2. Make your changes and commit with clear messages:
   ```bash
   git commit -m "Add feature description"
   ```

3. Push to GitHub and create a pull request:
   ```bash
   git push origin feature/XX-your-feature-name
   ```

---

## Features

### Templates Marketplace

Browse and install production-ready workflow templates for:
- **Lead Intake** — Capture buyer and seller information with guided intake workflows
- **Showing Confirmation** — Confirm appointments and keep everyone aligned
- **Offer Writeup** — Create offer packages, route approvals, and deliver documents
- **Disclosure Prep** — Organize disclosures and notify stakeholders
- **Close-Day Logistics** — Coordinate funding, keys, and final details

Each template includes:
- Estimated time saved
- Trigger and action apps
- Required integrations
- Pricing
- Installation status (installed / not installed)
- Detailed step preview
- Install button

---

## Architecture Principles

- **Multi-tenant first** — Row-level security at the database layer
- **Reliability first** — Durable execution with Temporal; no lost workflows
- **Type safety** — End-to-end with tRPC and Prisma
- **Event-driven** — Webhooks and event streams for real-time synchronization
- **Extensible** — Modular integration layer for rapid addition of new connectors
- **Observable** — Detailed logging, error tracking, and SLA monitoring

---

## Contributing

Contributions are welcome! Please open an issue or pull request to discuss changes.

---

## License

This project is proprietary software. Unauthorized copying or use is prohibited.

---

## Contact

For questions or inquiries about Autopace, please reach out to the development team.
