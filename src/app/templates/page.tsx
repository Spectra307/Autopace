"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { WorkflowBuilder } from "@/components/templates/workflow-builder"

export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-500">
            Workflow templates
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">Autopace workflow builder</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              View and edit workflow templates with trigger, action, delay, notification, and error-handling steps.
              The canvas is designed for operations teams to manage workflows efficiently.
            </p>
          </div>
        </div>

        <WorkflowBuilder />
      </main>
    </div>
  )
}
