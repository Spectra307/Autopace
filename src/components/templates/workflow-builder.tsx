"use client"

import { useEffect, useMemo, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  Node,
  Edge,
  ConnectionMode,
  Position,
} from "reactflow"

const initialTemplates: WorkflowTemplate[] = [
  {
    id: "listing-alert",
    name: "Listing Alert Sequence",
    description: "Monitor new listing triggers and keep the team notified with escalation handling.",
    nodes: [
      {
        id: "trigger-1",
        type: "trigger",
        label: "New listing trigger",
        description: "Starts when a new listing is added.",
        active: true,
        settings: {
          event: "New listing",
          source: "MLS sync",
        },
      },
      {
        id: "action-1",
        type: "action",
        label: "Capture lead details",
        description: "Collect the new lead and assign to intake.",
        active: true,
        settings: {
          assignee: "Intake queue",
        },
      },
      {
        id: "delay-1",
        type: "delay",
        label: "Wait 30 minutes",
        description: "Delay the next outreach step.",
        active: true,
        settings: {
          durationMinutes: 30,
        },
      },
      {
        id: "notification-1",
        type: "notification",
        label: "Send team notification",
        description: "Notify operations that the new listing is ready.",
        active: true,
        settings: {
          channel: "Email",
          message: "New listing ready for review",
        },
      },
      {
        id: "error-1",
        type: "error",
        label: "Error handling",
        description: "Send an alert if a workflow step fails.",
        active: true,
        settings: {
          recipient: "Ops team",
          message: "Listing workflow failed",
        },
      },
    ],
    edges: [
      { id: "e-trigger-action", source: "trigger-1", target: "action-1" },
      { id: "e-action-delay", source: "action-1", target: "delay-1" },
      { id: "e-delay-notification", source: "delay-1", target: "notification-1" },
      { id: "e-notification-error", source: "notification-1", target: "error-1" },
    ],
  },
  {
    id: "open-house-followup",
    name: "Open House Follow-up",
    description: "Trigger an automated follow-up cadence after an open house registration.",
    nodes: [
      {
        id: "trigger-2",
        type: "trigger",
        label: "Open house registration",
        description: "Starts when a visitor registers for an open house.",
        active: true,
        settings: {
          event: "Open house signup",
          source: "Website form",
        },
      },
      {
        id: "action-2",
        type: "action",
        label: "Qualify lead",
        description: "Review the registration details and qualify contact.",
        active: true,
        settings: {
          assignee: "Sales coordinator",
        },
      },
      {
        id: "notification-2",
        type: "notification",
        label: "Send follow-up reminder",
        description: "Schedule a reminder for the team to follow up.",
        active: true,
        settings: {
          channel: "SMS",
          message: "Review open house lead and follow up.",
        },
      },
      {
        id: "error-2",
        type: "error",
        label: "Open house error alert",
        description: "Send a notification if the follow-up logic fails.",
        active: true,
        settings: {
          recipient: "Operations",
          message: "Open house follow-up failed",
        },
      },
    ],
    edges: [
      { id: "e-trigger-action-2", source: "trigger-2", target: "action-2" },
      { id: "e-action-notification-2", source: "action-2", target: "notification-2" },
      { id: "e-notification-error-2", source: "notification-2", target: "error-2" },
    ],
  },
]

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  label: string
  description: string
  active: boolean
  settings: WorkflowSettings
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
}

type WorkflowNodeType = "trigger" | "action" | "delay" | "notification" | "error"

interface WorkflowSettings {
  event?: string
  source?: string
  assignee?: string
  durationMinutes?: number
  channel?: string
  message?: string
  recipient?: string
}

function getNodeVisualStyle(node: WorkflowNode, isSelected: boolean) {
  const base = {
    borderRadius: 16,
    width: 216,
    padding: 16,
    border: isSelected ? "2px solid #2563eb" : "1px solid rgba(148, 163, 184, 0.6)",
    boxShadow: isSelected ? "0 8px 24px rgba(37, 99, 235, 0.12)" : "none",
    opacity: node.active ? 1 : 0.55,
  }

  switch (node.type) {
    case "trigger":
      return {
        ...base,
        background: node.active ? "#eff6ff" : "#f8fafc",
        color: "#0f172a",
      }
    case "action":
      return {
        ...base,
        background: node.active ? "#e0e7ff" : "#f8fafc",
        color: "#1e293b",
      }
    case "delay":
      return {
        ...base,
        background: node.active ? "#fef3c7" : "#f8fafc",
        color: "#92400e",
      }
    case "notification":
      return {
        ...base,
        background: node.active ? "#dcfce7" : "#f8fafc",
        color: "#14532d",
      }
    case "error":
      return {
        ...base,
        background: node.active ? "#fee2e2" : "#f8fafc",
        color: "#991b1b",
      }
    default:
      return base
  }
}

function mapTemplateToFlowNodes(template: WorkflowTemplate, selectedNodeId: string | null) {
  return template.nodes.map((node, index) => ({
    id: node.id,
    position: { x: index * 240, y: 0 },
    data: {
      label: node.label,
    },
    type: "default",
    style: getNodeVisualStyle(node, node.id === selectedNodeId),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  })) satisfies Node[]
}

function mapTemplateToFlowEdges(template: WorkflowTemplate) {
  return template.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: true,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    style: {
      stroke: "#64748b",
      strokeWidth: 2,
    },
  })) satisfies Edge[]
}

function getTypeLabel(type: WorkflowNodeType) {
  switch (type) {
    case "trigger":
      return "Trigger"
    case "action":
      return "Action"
    case "delay":
      return "Delay"
    case "notification":
      return "Notification"
    case "error":
      return "Error"
  }
}

export function WorkflowBuilder() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(initialTemplates)
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplates[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialTemplates[0].nodes[0].id)
  const [isDirty, setIsDirty] = useState(false)
  const [saveMessage, setSaveMessage] = useState("Saved locally")

  useEffect(() => {
    const stored = window.localStorage.getItem("autopace-workflow-templates")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WorkflowTemplate[]
        if (parsed?.length) {
          setTemplates(parsed)
          setSelectedTemplateId(parsed[0].id)
          setSelectedNodeId(parsed[0].nodes[0]?.id ?? "")
        }
      } catch {
        // ignore invalid saved state
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("autopace-workflow-templates", JSON.stringify(templates))
  }, [templates])

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [templates, selectedTemplateId]
  )

  const selectedNode = useMemo(
    () => selectedTemplate.nodes.find((node) => node.id === selectedNodeId) ?? selectedTemplate.nodes[0],
    [selectedTemplate, selectedNodeId]
  )

  const flowNodes = useMemo(
    () => mapTemplateToFlowNodes(selectedTemplate, selectedNode?.id ?? null),
    [selectedTemplate, selectedNode]
  )

  const flowEdges = useMemo(() => mapTemplateToFlowEdges(selectedTemplate), [selectedTemplate])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = templates.find((item) => item.id === templateId)
    if (template) {
      setSelectedNodeId(template.nodes[0]?.id ?? "")
      setIsDirty(false)
    }
  }

  const updateNode = (nodeId: string, patch: Partial<WorkflowNode>) => {
    setTemplates((current) =>
      current.map((template) => {
        if (template.id !== selectedTemplateId) {
          return template
        }

        return {
          ...template,
          nodes: template.nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  ...patch,
                  settings: {
                    ...node.settings,
                    ...(patch.settings ?? {}),
                  },
                }
              : node
          ),
        }
      })
    )
    setIsDirty(true)
  }

  const handleToggleActive = () => {
    if (!selectedNode) {
      return
    }
    updateNode(selectedNode.id, { active: !selectedNode.active })
  }

  const handleFieldChange = (field: keyof WorkflowNode, value: string | boolean) => {
    if (!selectedNode) {
      return
    }

    if (field === "label" || field === "description") {
      updateNode(selectedNode.id, { [field]: value } as Partial<WorkflowNode>)
      return
    }

    if (field === "active") {
      updateNode(selectedNode.id, { active: value as boolean })
      return
    }
  }

  const handleSettingChange = (key: keyof WorkflowSettings, value: string | number) => {
    if (!selectedNode) {
      return
    }

    updateNode(selectedNode.id, {
      settings: {
        ...selectedNode.settings,
        [key]: value,
      },
    })
  }

  const handleSave = () => {
    setIsDirty(false)
    setSaveMessage("Changes saved to local state")
    window.setTimeout(() => setSaveMessage("Saved locally"), 2000)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">Template</p>
            <p className="text-xs text-slate-500">Pick the workflow you want to inspect.</p>
          </div>
          <div className="min-w-[220px]">
            <label className="sr-only" htmlFor="template-select">
              Select workflow template
            </label>
            <select
              id="template-select"
              value={selectedTemplateId}
              onChange={(event) => handleTemplateChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-slate-500"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-700">Workflow overview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTemplate.description}</p>
        </div>

        <div className="h-[620px] rounded-3xl border border-slate-200 bg-slate-950/80">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            fitView
            connectionMode={ConnectionMode.Loose}
            nodesDraggable
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(selectedTemplate.nodes[0]?.id ?? "")}
          >
            <Background gap={24} size={1} color="#334155" />
            <MiniMap
              nodeColor={(node) => {
                if (node.selected) {
                  return "#2563eb"
                }
                return "#94a3b8"
              }}
            />
            <Controls />
          </ReactFlow>
        </div>
      </section>

      <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Selected node</p>
              <p className="text-xs text-slate-500">Edit the active step details.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700">
              {selectedNode?.active ? "Live" : "Disabled"}
            </span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{selectedNode.label}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {getTypeLabel(selectedNode.type)} step
                </p>
              </div>

              <label className="block text-sm text-slate-700">
                Label
                <input
                  value={selectedNode.label}
                  onChange={(event) => handleFieldChange("label", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block text-sm text-slate-700">
                Description
                <textarea
                  value={selectedNode.description}
                  onChange={(event) => handleFieldChange("description", event.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>

              {selectedNode.type === "trigger" && (
                <>
                  <label className="block text-sm text-slate-700">
                    Trigger event
                    <input
                      value={selectedNode.settings.event ?? ""}
                      onChange={(event) => handleSettingChange("event", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Source
                    <input
                      value={selectedNode.settings.source ?? ""}
                      onChange={(event) => handleSettingChange("source", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                </>
              )}

              {selectedNode.type === "action" && (
                <label className="block text-sm text-slate-700">
                  Assignee
                  <input
                    value={selectedNode.settings.assignee ?? ""}
                    onChange={(event) => handleSettingChange("assignee", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                </label>
              )}

              {selectedNode.type === "delay" && (
                <label className="block text-sm text-slate-700">
                  Delay duration (minutes)
                  <input
                    type="number"
                    min={0}
                    value={selectedNode.settings.durationMinutes ?? 0}
                    onChange={(event) => handleSettingChange("durationMinutes", Number(event.target.value))}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                </label>
              )}

              {selectedNode.type === "notification" && (
                <>
                  <label className="block text-sm text-slate-700">
                    Channel
                    <input
                      value={selectedNode.settings.channel ?? ""}
                      onChange={(event) => handleSettingChange("channel", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Message
                    <textarea
                      value={selectedNode.settings.message ?? ""}
                      onChange={(event) => handleSettingChange("message", event.target.value)}
                      rows={3}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                </>
              )}

              {selectedNode.type === "error" && (
                <>
                  <label className="block text-sm text-slate-700">
                    Recipient
                    <input
                      value={selectedNode.settings.recipient ?? ""}
                      onChange={(event) => handleSettingChange("recipient", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Failure message
                    <textarea
                      value={selectedNode.settings.message ?? ""}
                      onChange={(event) => handleSettingChange("message", event.target.value)}
                      rows={3}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                  </label>
                </>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleToggleActive}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {selectedNode.active ? "Disable step" : "Enable step"}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isDirty}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save changes
                </button>
                <p className="text-xs text-slate-500">{isDirty ? "Unsaved changes are pending." : saveMessage}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Select a node on the canvas to edit its settings.</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Step summary</h2>
          <div className="space-y-3">
            {selectedTemplate.nodes.map((node) => (
              <div
                key={node.id}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-3 transition ${
                  node.id === selectedNode?.id ? "border-slate-900 bg-white" : "border-transparent bg-white/80 hover:border-slate-300"
                }`}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{node.label}</p>
                  <p className="text-xs text-slate-500">{getTypeLabel(node.type)}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${node.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                  {node.active ? "On" : "Off"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
