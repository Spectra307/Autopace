"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  X,
} from "lucide-react"

const templates = [
  {
    id: "lead-intake",
    name: "Lead Intake",
    tagline: "Capture buyer and seller information with a fast, guided intake workflow.",
    estimatedTimeSaved: "15 min",
    triggerApp: "Google Calendar",
    actionApps: ["Gmail", "Slack", "Zapier"],
    requiredIntegrations: ["GMAIL", "GOOGLE_CALENDAR", "SLACK"],
    price: 49,
    status: "installed",
    previewSteps: [
      "Send intake form with contact fields",
      "Verify lead information in CRM",
      "Create follow-up reminder in calendar",
    ],
    description:
      "Simplify new lead intake with automation that captures data, connects apps, and kickstarts the process in one flow.",
  },
  {
    id: "showing-confirmation",
    name: "Showing Confirmation",
    tagline: "Confirm appointments and keep everyone aligned before every showing.",
    estimatedTimeSaved: "22 min",
    triggerApp: "Gmail",
    actionApps: ["Google Calendar", "Slack"],
    requiredIntegrations: ["GMAIL", "GOOGLE_CALENDAR", "SLACK"],
    price: 39,
    status: "installed",
    previewSteps: [
      "Send confirmation email to client and agent",
      "Publish showing details to calendar",
      "Notify the team in Slack",
    ],
    description:
      "Reduce scheduling friction and eliminate missed showings by automating confirmation, reminders, and team communication.",
  },
  {
    id: "offer-writeup",
    name: "Offer Writeup",
    tagline: "Create offer packages, route approvals, and deliver documents quickly.",
    estimatedTimeSaved: "30 min",
    triggerApp: "Zapier",
    actionApps: ["Gmail", "Dotloop"],
    requiredIntegrations: ["ZAPIER", "GMAIL", "DOTLOOP"],
    price: 69,
    status: "not installed",
    previewSteps: [
      "Collect offer details from the agent",
      "Generate offer summary and attachments",
      "Send offer package to client and Dotloop",
    ],
    description:
      "Move offers from draft to delivery faster with automated writeup, document prep, and client review notifications.",
  },
  {
    id: "disclosure-prep",
    name: "Disclosure Prep",
    tagline: "Organize disclosure documents and notify stakeholders ahead of transaction milestones.",
    estimatedTimeSaved: "18 min",
    triggerApp: "Slack",
    actionApps: ["Gmail", "Zapier"],
    requiredIntegrations: ["SLACK", "GMAIL", "ZAPIER"],
    price: 45,
    status: "not installed",
    previewSteps: [
      "Collect required disclosures for the transaction",
      "Send checklist reminders to the team",
      "Deliver disclosure bundle to clients",
    ],
    description:
      "Keep disclosure workflows on track with automated collection, reminders, and client delivery.",
  },
  {
    id: "close-day-logistics",
    name: "Close-Day Logistics",
    tagline: "Coordinate funding, keys, and final details for a smooth closing day.",
    estimatedTimeSaved: "25 min",
    triggerApp: "Google Calendar",
    actionApps: ["Gmail", "Stripe"],
    requiredIntegrations: ["GOOGLE_CALENDAR", "GMAIL", "STRIPE"],
    price: 79,
    status: "not installed",
    previewSteps: [
      "Confirm closing appointment details",
      "Generate final checklist for buyer and seller",
      "Send payment and settlement reminders",
    ],
    description:
      "Coordinate all final closing tasks in one workflow so teams and clients are ready on the day of settlement.",
  },
]

const integrationLabels: Record<string, string> = {
  GMAIL: "Gmail",
  OUTLOOK: "Outlook",
  SLACK: "Slack",
  GOOGLE_CALENDAR: "Google Calendar",
  ZAPIER: "Zapier",
  STRIPE: "Stripe",
  DOTLOOP: "Dotloop",
  ZILLOW: "Zillow",
  FOLLOW_UP_BOSS: "Follow Up Boss",
}

export default function TemplateMarketplace() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [selectedTemplateId]
  )

  const installedTemplates = templates.filter((template) => template.status === "installed")

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Autopace Templates Marketplace
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Real estate automation templates built for modern brokerages.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Browse production-ready workflows that connect your apps, reduce manual handoffs, and launch faster with Autopace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-background p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Installed templates</p>
              <p className="mt-2 text-3xl font-semibold">{installedTemplates.length}</p>
            </div>
            <div className="rounded-2xl bg-background p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Templates available</p>
              <p className="mt-2 text-3xl font-semibold">{templates.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.tagline}</CardDescription>
                </div>
                <Badge variant={template.status === "installed" ? "secondary" : "default"}>
                  {template.status === "installed" ? "Installed" : "Not installed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Estimated time saved
                  </p>
                  <p className="mt-2 text-xl font-semibold">{template.estimatedTimeSaved}</p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Trigger app
                  </p>
                  <p className="mt-2 text-sm font-medium">{template.triggerApp}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Action apps
                  </p>
                  <p className="mt-2 text-sm font-medium">{template.actionApps.join(", ")}</p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-2 text-xl font-semibold">${template.price}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {template.requiredIntegrations.map((integration) => (
                  <Badge key={integration} variant="outline">
                    {integrationLabels[integration] ?? integration}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={template.status === "installed" ? "secondary" : "default"}
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  View details
                </Button>
                <Button
                  variant={template.status === "installed" ? "secondary" : "outline"}
                  className="hidden sm:inline-flex"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  {template.status === "installed" ? "Manage" : "Install"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </section>

      {selectedTemplate ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center sm:p-8">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary">
                  Template details
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{selectedTemplate.name}</h2>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted/10"
                onClick={() => setSelectedTemplateId(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>

                <div className="rounded-3xl bg-background p-5">
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                    <Sparkles className="h-4 w-4" />
                    Ready to deploy workflow preview
                  </div>
                  <ul className="mt-4 space-y-3">
                    {selectedTemplate.previewSteps.map((step) => (
                      <li key={step} className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{step}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6 rounded-3xl border border-border bg-background p-6">
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-card p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Estimated time saved
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{selectedTemplate.estimatedTimeSaved}</p>
                  </div>
                  <div className="rounded-2xl bg-card p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Trigger app
                    </p>
                    <p className="mt-2 font-medium">{selectedTemplate.triggerApp}</p>
                  </div>
                  <div className="rounded-2xl bg-card p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Price
                    </p>
                    <p className="mt-2 text-2xl font-semibold">${selectedTemplate.price}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Layers className="h-4 w-4" />
                    Required integrations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.requiredIntegrations.map((integration) => (
                      <Badge key={integration} variant="outline">
                        {integrationLabels[integration] ?? integration}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Zap className="h-4 w-4" />
                    Action apps
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.actionApps.map((app) => (
                      <Badge key={app} variant="outline">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => setSelectedTemplateId(null)}>
                  {selectedTemplate.status === "installed" ? "Installed" : "Install template"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
