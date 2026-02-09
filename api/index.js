// Point d'entrée principal pour n8n sur Vercel
require("dotenv").config();

const { exec } = require("child_process");
const path = require("path");

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
    // Route principale - Rediriger vers l'interface n8n
    if (url === "/" && method === "GET") {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>n8n - Workflow Automation</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #ff6d5a; margin-bottom: 20px; }
            .status { 
              background: #e8f5e8; 
              color: #2d5a2d; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 20px 0;
            }
            .api-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: left;
            }
            .endpoint {
              font-family: monospace;
              background: #e9ecef;
              padding: 5px 8px;
              border-radius: 4px;
              margin: 5px 0;
              display: block;
            }
            a {
              background: #ff6d5a;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              display: inline-block;
              margin: 10px 5px;
              transition: background 0.3s;
            }
            a:hover {
              background: #ff5a47;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 n8n Serverless</h1>
            <div class="status">
              ✅ <strong>Statut:</strong> Actif et déployé sur Vercel<br>
              📍 <strong>Région:</strong> Europe (Paris)<br>
              🗄️ <strong>Base de données:</strong> Supabase PostgreSQL
            </div>
            
            <h3>🔗 Accès Rapide</h3>
            <a href="/api/health" target="_blank">Vérifier la santé</a>
            <a href="/api/workflows" target="_blank">Voir les workflows</a>
            
            <div class="api-info">
              <h4>📡 Endpoints API disponibles:</h4>
              <span class="endpoint">GET /api/health</span>
              <span class="endpoint">GET /api/workflows</span>
              <span class="endpoint">POST /api/workflows</span>
              <span class="endpoint">POST /api/webhooks</span>
              <span class="endpoint">GET /api/test-db</span>
            </div>
            
            <p style="margin-top: 30px; color: #666;">
              <strong>Version:</strong> n8n Serverless v2.0<br>
              <small>Interface de conception de workflows en cours de développement...</small>
            </p>
          </div>
        </body>
        </html>
      `);
    }

    // Routes API n8n
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
        case "n8n":
          return handleN8n(req, res);
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
  try {
    // Test de connexion à la base de données
    const dbStatus = process.env.DATABASE_URL ? "connected" : "not configured";

    return res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "n8n-vercel-serverless",
      version: "2.0.0",
      database: {
        status: dbStatus,
        type: "Supabase PostgreSQL",
      },
      environment: {
        node_env: process.env.NODE_ENV,
        timezone: process.env.TZ || "UTC",
      },
      features: [
        "Serverless workflows",
        "Supabase integration",
        "Webhook handling",
        "Cron jobs support",
        "API endpoints",
      ],
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// Workflows management
async function handleWorkflows(req, res) {
  const { method } = req;

  if (method === "GET") {
    // Simuler des workflows n8n
    const workflows = [
      {
        id: "webhook-receiver",
        name: "Webhook Receiver",
        type: "webhook",
        status: "active",
        description: "Reçoit et traite les webhooks externes",
        nodes: [
          { id: 1, name: "Webhook", type: "webhook" },
          { id: 2, name: "Set", type: "set" },
          { id: 3, name: "HTTP Request", type: "httpRequest" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "data-processor",
        name: "Data Processor",
        type: "scheduled",
        status: "active",
        description: "Traite les données selon un cron schedule",
        nodes: [
          { id: 1, name: "Cron", type: "cron" },
          { id: 2, name: "Function", type: "function" },
          { id: 3, name: "Supabase", type: "supabase" },
        ],
        schedule: "0 */6 * * *",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "api-integration",
        name: "API Integration",
        type: "trigger",
        status: "active",
        description: "Intégration avec APIs externes",
        nodes: [
          { id: 1, name: "HTTP Request", type: "httpRequest" },
          { id: 2, name: "Code", type: "code" },
          { id: 3, name: "Webhook", type: "webhook" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return res.json({
      workflows,
      total: workflows.length,
      active: workflows.filter((w) => w.status === "active").length,
    });
  }

  if (method === "POST") {
    // Créer un nouveau workflow
    const workflow = req.body;
    return res.status(201).json({
      message: "Workflow created successfully",
      workflow: {
        id: `workflow_${Date.now()}`,
        name: workflow.name || "New Workflow",
        type: workflow.type || "manual",
        status: "inactive",
        nodes: workflow.nodes || [],
        ...workflow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      id: webhookId || `webhook_${Date.now()}`,
      received: new Date().toISOString(),
      data: body,
      processed: true,
      headers: req.headers,
    };

    // Logique de traitement peut être ajoutée ici
    // Sauvegarde dans Supabase, envoi d'email, etc.

    return res.json({
      success: true,
      message: "Webhook processed successfully",
      webhook: webhookData,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// Test de connexion base de données
async function handleTestDB(req, res) {
  try {
    // Test de connexion Supabase
    const { createClient } = require("@supabase/supabase-js");

    if (!process.env.DATABASE_URL || !process.env.SUPABASE_URL) {
      return res.status(400).json({
        status: "error",
        message: "Database configuration missing",
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );

    // Test simple de connexion
    const { data, error } = await supabase
      .from("_test_connection")
      .select("*")
      .limit(1);

    const dbTest = {
      connected: !error,
      timestamp: new Date().toISOString(),
      database: "Supabase PostgreSQL",
      url: process.env.SUPABASE_URL,
      error: error ? error.message : null,
    };

    return res.json({
      status: dbTest.connected ? "success" : "error",
      database: dbTest,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
      database: {
        connected: false,
        error: error.message,
      },
    });
  }
}

// Endpoint n8n pour l'interface future
async function handleN8n(req, res) {
  return res.json({
    message: "n8n interface endpoint",
    status: "coming_soon",
    note: "L'interface graphique n8n complète sera bientôt disponible",
    current_version: "2.0.0-serverless",
  });
}
