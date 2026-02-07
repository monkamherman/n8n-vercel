// Intégration Supabase pour Vercel
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
  const { action, table } = query;

  try {
    switch (action) {
      case "test-connection":
        return testConnection(res);
      case "query":
        return executeQuery(body, res);
      case "insert":
        return insertData(table, body, res);
      case "update":
        return updateData(table, query.id, body, res);
      case "delete":
        return deleteData(table, query.id, res);
      case "schema":
        return getSchema(table, res);
      default:
        return res.status(400).json({ error: "Action not specified" });
    }
  } catch (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// Test de connexion à Supabase
async function testConnection(res) {
  if (!process.env.DATABASE_URL) {
    return res.status(400).json({
      status: "error",
      message: "DATABASE_URL not configured",
    });
  }

  // Simulation de test de connexion
  // Dans la vraie version, utiliseriez @supabase/supabase-js
  const connectionTest = {
    status: "success",
    timestamp: new Date().toISOString(),
    database: {
      type: "PostgreSQL",
      host: "Supabase",
      connected: true,
      version: "14.1",
    },
    latency: `${Math.floor(Math.random() * 50) + 10}ms`,
  };

  return res.json(connectionTest);
}

// Exécuter une requête SQL
async function executeQuery(queryData, res) {
  const { sql, params = [] } = queryData;

  if (!sql) {
    return res.status(400).json({ error: "SQL query required" });
  }

  // Simulation d'exécution de requête
  const queryResult = {
    query: sql,
    executedAt: new Date().toISOString(),
    executionTime: `${Math.floor(Math.random() * 100) + 10}ms`,
    rows: Math.floor(Math.random() * 100),
    affected: Math.floor(Math.random() * 10),
  };

  return res.json({
    status: "success",
    result: queryResult,
  });
}

// Insérer des données
async function insertData(table, data, res) {
  if (!table || !data) {
    return res.status(400).json({ error: "Table and data required" });
  }

  const insertResult = {
    table,
    operation: "insert",
    executedAt: new Date().toISOString(),
    recordsInserted: Array.isArray(data) ? data.length : 1,
    id: `record_${Date.now()}`,
  };

  return res.status(201).json({
    status: "success",
    result: insertResult,
  });
}

// Mettre à jour des données
async function updateData(table, id, data, res) {
  if (!table || !id || !data) {
    return res.status(400).json({ error: "Table, ID and data required" });
  }

  const updateResult = {
    table,
    operation: "update",
    id,
    executedAt: new Date().toISOString(),
    fieldsUpdated: Object.keys(data).length,
    rowsAffected: 1,
  };

  return res.json({
    status: "success",
    result: updateResult,
  });
}

// Supprimer des données
async function deleteData(table, id, res) {
  if (!table || !id) {
    return res.status(400).json({ error: "Table and ID required" });
  }

  const deleteResult = {
    table,
    operation: "delete",
    id,
    executedAt: new Date().toISOString(),
    rowsAffected: 1,
  };

  return res.json({
    status: "success",
    result: deleteResult,
  });
}

// Obtenir le schéma d'une table
async function getSchema(table, res) {
  const schemas = {
    workflows: {
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "name", type: "varchar", nullable: false },
        { name: "description", type: "text", nullable: true },
        { name: "config", type: "jsonb", nullable: true },
        { name: "active", type: "boolean", nullable: false },
        { name: "created_at", type: "timestamp", nullable: false },
        { name: "updated_at", type: "timestamp", nullable: true },
      ],
    },
    executions: {
      columns: [
        { name: "id", type: "uuid", nullable: false },
        { name: "workflow_id", type: "uuid", nullable: false },
        { name: "status", type: "varchar", nullable: false },
        { name: "input", type: "jsonb", nullable: true },
        { name: "output", type: "jsonb", nullable: true },
        { name: "started_at", type: "timestamp", nullable: false },
        { name: "completed_at", type: "timestamp", nullable: true },
      ],
    },
  };

  const schema = schemas[table] || { columns: [] };

  return res.json({
    table,
    schema,
  });
}
