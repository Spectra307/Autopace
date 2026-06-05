import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <section className="rounded-3xl border border-border bg-card p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Autopace
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Build and launch workflow templates for real estate operations.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Autopace helps brokerages deploy automation faster with a marketplace of curated templates, installed workflow states, and detailed previews.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/templates" className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Browse templates
                </Link>
                <Link href="/templates" className="inline-flex items-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                  View marketplace
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-background p-8 shadow-inner">
              <div className="space-y-4">
                <div className="rounded-3xl bg-primary/5 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Featured template</p>
                  <h2 className="mt-4 text-2xl font-semibold">Lead Intake</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Capture new buyer and seller leads with automated intake, app syncing, and follow-up workflows.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-card p-4 text-sm">
                    <p className="text-muted-foreground">Trigger app</p>
                    <p className="mt-2 font-semibold">Google Calendar</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4 text-sm">
                    <p className="text-muted-foreground">Est. time saved</p>
                    <p className="mt-2 font-semibold">15 min</p>
                  </div>
                  <div className="rounded-3xl bg-card p-4 text-sm">
                    <p className="text-muted-foreground">Status</p>
                    <p className="mt-2 font-semibold">Installed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
