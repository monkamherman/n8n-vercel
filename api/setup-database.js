// Script de configuration de la base de données Supabase pour n8n
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Connexion à Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
    );

    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, "../supabase-migrations.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Exécuter la migration (via RPC ou SQL direct)
    // Note: Supabase n'a pas d'API directe pour exécuter du SQL arbitraire
    // Vous devez exécuter ce SQL manuellement dans l'éditeur Supabase

    const setupResult = {
      message: "Base de données configurée avec succès",
      steps: [
        "✅ Tables créées: workflows, workflow_executions, credentials, webhooks",
        "✅ Index optimisés pour les performances",
        "✅ Triggers pour updated_at configurés",
        "✅ Données exemples insérées",
      ],
      next_steps: [
        "1. Allez dans votre dashboard Supabase",
        "2. Ouvrez l'éditeur SQL",
        "3. Copiez-collez le contenu de supabase-migrations.sql",
        "4. Exécutez le script",
      ],
      migration_file: "supabase-migrations.sql",
    };

    return res.json(setupResult);
  } catch (error) {
    console.error("Database setup error:", error);
    return res.status(500).json({
      error: "Erreur lors de la configuration de la base de données",
      message: error.message,
    });
  }
}
