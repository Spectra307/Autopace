const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const brokerage = await prisma.organization.upsert({
    where: { slug: "autopace-brokerage" },
    update: {},
    create: {
      slug: "autopace-brokerage",
      name: "Autopace Brokerage",
      description: "A multi-tenant brokerage powered by Autopace workflow automation.",
      industry: "Real Estate",
      status: "ACTIVE",
    },
  });

  const [agentAlice, agentJordan] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@autopace.example" },
      update: {},
      create: {
        email: "alice@autopace.example",
        name: "Alice Chen",
        role: "AGENT",
        status: "ACTIVE",
        avatarUrl: "https://example.com/avatar/alice.png",
      },
    }),
    prisma.user.upsert({
      where: { email: "jordan@autopace.example" },
      update: {},
      create: {
        email: "jordan@autopace.example",
        name: "Jordan Wells",
        role: "AGENT",
        status: "ACTIVE",
        avatarUrl: "https://example.com/avatar/jordan.png",
      },
    }),
  ]);

  await Promise.all([
    prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: brokerage.id, userId: agentAlice.id } },
      update: {},
      create: {
        organizationId: brokerage.id,
        userId: agentAlice.id,
        role: "ADMIN",
        status: "ACTIVE",
      },
    }),
    prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: brokerage.id, userId: agentJordan.id } },
      update: {},
      create: {
        organizationId: brokerage.id,
        userId: agentJordan.id,
        role: "MEMBER",
        status: "ACTIVE",
      },
    }),
  ]);

  const templates = [
    {
      slug: "listing-intake",
      name: "Listing Intake Workflow",
      description: "Collect listing information and launch the sales workflow.",
      category: "Listing",
      version: {
        versionNumber: 1,
        title: "Listing Intake v1",
        changelog: "Initial published workflow for listing intake.",
        content: {
          steps: [
            { name: "Collect listing details", type: "TRIGGER" },
            { name: "Send welcome email", type: "ACTION" },
            { name: "Create file in CRM", type: "ACTION" },
          ],
        },
        status: "PUBLISHED",
        isPublished: true,
      },
    },
    {
      slug: "transaction-coordination",
      name: "Transaction Coordination",
      description: "Automate transaction tracking and milestone reminders for closings.",
      category: "Transaction",
      version: {
        versionNumber: 1,
        title: "Transaction Coordination v1",
        changelog: "Launch transaction coordination workflow.",
        content: {
          steps: [
            { name: "Create contract checklist", type: "TRIGGER" },
            { name: "Send buyer notification", type: "NOTIFICATION" },
            { name: "Update transaction stage", type: "ACTION" },
          ],
        },
        status: "PUBLISHED",
        isPublished: true,
      },
    },
    {
      slug: "buyer-nurture",
      name: "Buyer Nurture Journey",
      description: "Keep buyer leads engaged with automated follow-ups.",
      category: "Lead Nurture",
      version: {
        versionNumber: 1,
        title: "Buyer Nurture v1",
        changelog: "First publish of buyer nurture workflow.",
        content: {
          steps: [
            { name: "Send welcome sequence", type: "NOTIFICATION" },
            { name: "Schedule follow-up", type: "ACTION" },
            { name: "Log buyer interest", type: "ACTION" },
          ],
        },
        status: "PUBLISHED",
        isPublished: true,
      },
    },
    {
      slug: "appointment-follow-up",
      name: "Appointment Follow-up",
      description: "Capture appointment results and follow up automatically.",
      category: "Follow-Up",
      version: {
        versionNumber: 1,
        title: "Appointment Follow-up v1",
        changelog: "Initial appointment follow-up workflow.",
        content: {
          steps: [
            { name: "Record appointment outcome", type: "TRIGGER" },
            { name: "Send survey", type: "ACTION" },
            { name: "Create next steps task", type: "ACTION" },
          ],
        },
        status: "PUBLISHED",
        isPublished: true,
      },
    },
    {
      slug: "closing-checklist",
      name: "Closing Checklist",
      description: "Ensure every closing milestone is tracked on schedule.",
      category: "Closing",
      version: {
        versionNumber: 1,
        title: "Closing Checklist v1",
        changelog: "Published the core closing checklist workflow.",
        content: {
          steps: [
            { name: "Verify documents", type: "TRIGGER" },
            { name: "Notify title company", type: "ACTION" },
            { name: "Confirm funding", type: "ACTION" },
          ],
        },
        status: "PUBLISHED",
        isPublished: true,
      },
    },
  ];

  const createdTemplates = await Promise.all(
    templates.map((template) =>
      prisma.workflowTemplate.create({
        data: {
          organizationId: brokerage.id,
          name: template.name,
          description: template.description,
          category: template.category,
          status: "ACTIVE",
          versions: {
            create: [
              {
                versionNumber: template.version.versionNumber,
                title: template.version.title,
                changelog: template.version.changelog,
                content: template.version.content,
                status: template.version.status,
                isPublished: template.version.isPublished,
                publishedAt: new Date(),
              },
            ],
          },
        },
        include: {
          versions: true,
        },
      })
    )
  );

  const [listingTemplate, transactionTemplate] = createdTemplates;

  const billingCustomer = await prisma.billingCustomer.upsert({
    where: { customerId: "cust_autopace_brokerage" },
    update: {
      stripeCustomerId: "stripe_cust_autopace_brokerage",
      status: "ACTIVE",
    },
    create: {
      organizationId: brokerage.id,
      provider: "STRIPE",
      customerId: "cust_autopace_brokerage",
      stripeCustomerId: "stripe_cust_autopace_brokerage",
      status: "ACTIVE",
    },
  });

  await prisma.subscription.upsert({
    where: { billingCustomerId_plan: { billingCustomerId: billingCustomer.id, plan: "growth" } },
    update: {
      status: "ACTIVE",
      priceCents: 14900,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSubscriptionId: "stripe_sub_growth_001",
      stripePriceId: "stripe_price_growth_001",
      stripeProductId: "stripe_prod_autopace_growth",
      checkoutSessionId: "cs_test_autopace_001",
    },
    create: {
      billingCustomerId: billingCustomer.id,
      organizationId: brokerage.id,
      plan: "growth",
      status: "ACTIVE",
      priceCents: 14900,
      currency: "USD",
      stripeSubscriptionId: "stripe_sub_growth_001",
      stripePriceId: "stripe_price_growth_001",
      stripeProductId: "stripe_prod_autopace_growth",
      checkoutSessionId: "cs_test_autopace_001",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const publishedVersions = await prisma.workflowTemplateVersion.findMany({
    where: { template: { organizationId: brokerage.id }, status: "PUBLISHED" },
    take: 5,
  });

  await Promise.all([
    prisma.workflowRun.create({
      data: {
        organizationId: brokerage.id,
        templateVersionId: publishedVersions[0].id,
        initiatedById: agentAlice.id,
        idempotencyKey: "run_123_maple_001",
        externalWorkflowId: "ext_run_123_maple",
        temporalRunId: "temporal_run_123_maple",
        title: "Listing intake for 123 Maple Street",
        status: "COMPLETED",
        metadata: { property: "123 Maple Street", leadSource: "website" },
        startedAt: new Date(Date.now() - 1000 * 60 * 20),
        completedAt: new Date(Date.now() - 1000 * 60 * 5),
        steps: {
          create: [
            {
              name: "Collect listing details",
              stepType: "TRIGGER",
              status: "COMPLETED",
              sequence: 1,
              startedAt: new Date(Date.now() - 1000 * 60 * 20),
              completedAt: new Date(Date.now() - 1000 * 60 * 18),
            },
            {
              name: "Send welcome email",
              stepType: "ACTION",
              status: "COMPLETED",
              sequence: 2,
              startedAt: new Date(Date.now() - 1000 * 60 * 18),
              completedAt: new Date(Date.now() - 1000 * 60 * 15),
            },
            {
              name: "Create file in CRM",
              stepType: "ACTION",
              status: "COMPLETED",
              sequence: 3,
              startedAt: new Date(Date.now() - 1000 * 60 * 15),
              completedAt: new Date(Date.now() - 1000 * 60 * 5),
            },
          ],
        },
        events: {
          create: [
            {
              organizationId: brokerage.id,
              eventType: "RUN_STARTED",
              payload: { source: "dashboard" },
            },
            {
              organizationId: brokerage.id,
              eventType: "STEP_COMPLETED",
              payload: { step: "Collect listing details" },
            },
          ],
        },
      },
    }),
    prisma.workflowRun.create({
      data: {
        organizationId: brokerage.id,
        templateVersionId: publishedVersions[1].id,
        initiatedById: agentJordan.id,
        idempotencyKey: "run_9_oak_001",
        externalWorkflowId: "ext_run_9_oak",
        temporalWorkflowId: "temporal_workflow_9_oak",
        temporalRunId: "temporal_run_9_oak",
        title: "Closing checklist for 9 Oak Avenue",
        status: "RUNNING",
        metadata: { property: "9 Oak Avenue", stage: "final review" },
        startedAt: new Date(Date.now() - 1000 * 60 * 30),
        steps: {
          create: [
            {
              name: "Verify documents",
              stepType: "TRIGGER",
              status: "COMPLETED",
              sequence: 1,
              startedAt: new Date(Date.now() - 1000 * 60 * 30),
              completedAt: new Date(Date.now() - 1000 * 60 * 27),
            },
            {
              name: "Notify title company",
              stepType: "ACTION",
              status: "IN_PROGRESS",
              sequence: 2,
              startedAt: new Date(Date.now() - 1000 * 60 * 26),
            },
          ],
        },
        events: {
          create: [
            {
              organizationId: brokerage.id,
              eventType: "RUN_STARTED",
              payload: { channel: "api" },
            },
          ],
        },
      },
    }),
  ]);

  await prisma.document.createMany({
    data: [
      {
        organizationId: brokerage.id,
        ownerId: agentAlice.id,
        title: "Autopace onboarding guide",
        type: "TEMPLATE",
        status: "ACTIVE",
        content: "A standard onboarding template for brokerage teams.",
      },
      {
        organizationId: brokerage.id,
        ownerId: agentJordan.id,
        title: "Buyer qualification checklist",
        type: "NOTE",
        status: "ACTIVE",
        content: "Questions and responses for buyer qualification calls.",
      },
    ],
  });

  await prisma.templatePurchase.create({
    data: {
      organizationId: brokerage.id,
      buyerId: agentAlice.id,
      templateId: createdTemplates[2].id,
      versionId: createdTemplates[2].versions[0].id,
      amountCents: 24900,
      currency: "USD",
      status: "COMPLETED",
    },
  });

  console.log("Seed data created for Autopace core data model.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
