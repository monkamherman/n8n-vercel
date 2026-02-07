// API principale Vercel - Remplacement de n8n par des workflows serverless
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

  const { url, method } = req;

  try {
    // Route principale
    if (url === "/" && method === "GET") {
      return res.json({
        message: "n8n Vercel Serverless Edition",
        status: "active",
        version: "1.0.0",
        features: [
          "Serverless workflows",
          "Supabase integration",
          "Webhook handling",
          "Cron jobs support",
        ],
        endpoints: {
          health: "/api/health",
          workflows: "/api/workflows",
          webhooks: "/api/webhooks",
          "db-test": "/api/test-db",
        },
      });
    }

    // Routes API
    if (url.startsWith("/api/")) {
      const route = url.replace("/api/", "");

      switch (route) {
        case "health":
          return handleHealth(req, res);
        case "workflows":
          return handleWorkflows(req, res);
        case "webhooks":
          return handleWebhooks(req, res);
        case "test-db":
          return handleTestDB(req, res);
        case "keep-alive":
          return handleKeepAlive(req, res);
        default:
          return res.status(404).json({ error: "Route not found" });
      }
    }

    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// Health check
async function handleHealth(req, res) {
  return res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "n8n-vercel-serverless",
    database: process.env.DATABASE_URL ? "configured" : "missing",
    version: "1.0.0",
  });
}

// Workflows management (remplacement n8n)
async function handleWorkflows(req, res) {
  const { method } = req;

  if (method === "GET") {
    // Liste des workflows exemples
    const workflows = [
      {
        id: "webhook-receiver",
        name: "Webhook Receiver",
        type: "webhook",
        status: "active",
        description: "Reçoit et traite les webhooks",
      },
      {
        id: "data-processor",
        name: "Data Processor",
        type: "scheduled",
        status: "active",
        description: "Traite les données selon un cron",
      },
      {
        id: "api-integration",
        name: "API Integration",
        type: "trigger",
        status: "active",
        description: "Intégration avec APIs externes",
      },
    ];

    return res.json({ workflows });
  }

  if (method === "POST") {
    // Créer un nouveau workflow
    const workflow = req.body;
    return res.status(201).json({
      message: "Workflow created",
      workflow: {
        id: `workflow_${Date.now()}`,
        ...workflow,
        createdAt: new Date().toISOString(),
      },
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// Webhook handling
async function handleWebhooks(req, res) {
  const { method, query, body } = req;
  const { webhookId } = query;

  if (method === "POST") {
    console.log(`Webhook received: ${webhookId}`, body);

    // Traitement du webhook
    const webhookData = {
      id: webhookId,
      received: new Date().toISOString(),
      data: body,
      processed: true,
    };

    // Ici vous pouvez ajouter votre logique de traitement
    // Sauvegarde dans Supabase, envoi d'email, etc.

    return res.json({
      success: true,
      message: "Webhook processed",
      webhook: webhookData,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// Test de connexion base de données
async function handleTestDB(req, res) {
  try {
    // Simulation de test de connexion Supabase
    // Dans la vraie version, utiliseriez le client Supabase ici
    const dbTest = {
      connected: true,
      timestamp: new Date().toISOString(),
      database: "Supabase PostgreSQL",
      url: process.env.DATABASE_URL ? "configured" : "missing",
    };

    return res.json({
      status: "success",
      database: dbTest,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Keep-alive pour Vercel (remplace le cron Render)
async function handleKeepAlive(req, res) {
  console.log("Keep-alive ping received at:", new Date().toISOString());

  return res.json({
    message: "Server kept alive",
    timestamp: new Date().toISOString(),
    service: "n8n-vercel-serverless",
  });
}
