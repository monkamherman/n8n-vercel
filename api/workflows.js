// Système de workflows serverless pour remplacer n8n
require("dotenv").config();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const { action, workflowId } = query;

  try {
    switch (action) {
      case "list":
        return listWorkflows(res);
      case "execute":
        return executeWorkflow(workflowId, body, res);
      case "create":
        return createWorkflow(body, res);
      case "delete":
        return deleteWorkflow(workflowId, res);
      case "status":
        return getWorkflowStatus(workflowId, res);
      default:
        return res.status(400).json({ error: "Action not specified" });
    }
  } catch (error) {
    console.error("Workflow Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// Liste des workflows disponibles
function listWorkflows(res) {
  const workflows = [
    {
      id: "webhook-processor",
      name: "Webhook Processor",
      description: "Traite les webhooks entrants",
      type: "webhook",
      triggers: ["http", "schedule"],
      active: true,
      lastRun: new Date().toISOString(),
    },
    {
      id: "data-transformer",
      name: "Data Transformer",
      description: "Transforme et nettoie les données",
      type: "processing",
      triggers: ["webhook", "manual"],
      active: true,
      lastRun: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notification-sender",
      name: "Notification Sender",
      description: "Envoie des notifications par email/Slack",
      type: "notification",
      triggers: ["schedule", "event"],
      active: false,
      lastRun: null,
    },
    {
      id: "api-integrator",
      name: "API Integrator",
      description: "Intégration avec APIs externes",
      type: "integration",
      triggers: ["webhook", "schedule"],
      active: true,
      lastRun: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  return res.json({ workflows });
}

// Exécuter un workflow spécifique
async function executeWorkflow(workflowId, data, res) {
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID required" });
  }

  console.log(`Executing workflow: ${workflowId}`, data);

  // Simulation d'exécution de workflow
  const executionResult = {
    workflowId,
    executionId: `exec_${Date.now()}`,
    status: "success",
    startedAt: new Date().toISOString(),
    completedAt: new Date(Date.now() + 2000).toISOString(),
    input: data,
    output: {},
    logs: [],
  };

  // Logique différente selon le workflow
  switch (workflowId) {
    case "webhook-processor":
      executionResult.output = {
        processed: true,
        recordsProcessed: data.items?.length || 1,
        summary: "Webhook data processed successfully",
      };
      executionResult.logs.push("Webhook received and validated");
      executionResult.logs.push("Data transformation completed");
      break;

    case "data-transformer":
      executionResult.output = {
        transformed: true,
        fieldsAdded: ["processed_at", "source"],
        recordCount: data.records?.length || 1,
      };
      executionResult.logs.push("Data cleaning started");
      executionResult.logs.push("Field mapping completed");
      break;

    case "notification-sender":
      executionResult.output = {
        notificationsSent: 1,
        channels: ["email"],
        recipients: data.recipients || [],
      };
      executionResult.logs.push("Notification sent successfully");
      break;

    case "api-integrator":
      executionResult.output = {
        apiCalls: 1,
        responseTime: "150ms",
        status: "success",
      };
      executionResult.logs.push("API call initiated");
      executionResult.logs.push("Response received and processed");
      break;

    default:
      return res.status(404).json({ error: "Workflow not found" });
  }

  return res.json({
    message: "Workflow executed successfully",
    execution: executionResult,
  });
}

// Créer un nouveau workflow
function createWorkflow(workflowData, res) {
  const newWorkflow = {
    id: `workflow_${Date.now()}`,
    name: workflowData.name || "New Workflow",
    description: workflowData.description || "",
    type: workflowData.type || "custom",
    triggers: workflowData.triggers || ["manual"],
    active: false,
    createdAt: new Date().toISOString(),
    config: workflowData.config || {},
  };

  return res.status(201).json({
    message: "Workflow created",
    workflow: newWorkflow,
  });
}

// Supprimer un workflow
function deleteWorkflow(workflowId, res) {
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID required" });
  }

  return res.json({
    message: "Workflow deleted",
    workflowId,
  });
}

// Obtenir le statut d'un workflow
function getWorkflowStatus(workflowId, res) {
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID required" });
  }

  const status = {
    workflowId,
    active: Math.random() > 0.5,
    lastExecution: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    totalExecutions: Math.floor(Math.random() * 100),
    successRate: 95 + Math.random() * 5,
    averageExecutionTime: Math.floor(Math.random() * 5000) + "ms",
  };

  return res.json(status);
}
