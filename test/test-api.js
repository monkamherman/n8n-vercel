// Tests pour l'API Vercel serverless
require("dotenv").config();

const API_BASE = process.env.API_BASE || "http://localhost:3000";

async function testAPI() {
  console.log("🧪 Tests de l'API Vercel Serverless\n");

  try {
    // Test 1: Route principale
    console.log("1. Test route principale...");
    const response1 = await fetch(`${API_BASE}/`);
    const data1 = await response1.json();
    console.log("✅ Route principale:", data1.message);

    // Test 2: Health check
    console.log("\n2. Test health check...");
    const response2 = await fetch(`${API_BASE}/api/health`);
    const data2 = await response2.json();
    console.log("✅ Health check:", data2.status);

    // Test 3: Workflows
    console.log("\n3. Test workflows...");
    const response3 = await fetch(`${API_BASE}/api/workflows`);
    const data3 = await response3.json();
    console.log("✅ Workflows trouvés:", data3.workflows.length);

    // Test 4: Exécuter un workflow
    console.log("\n4. Test exécution workflow...");
    const response4 = await fetch(
      `${API_BASE}/api/workflows?action=execute&workflowId=webhook-processor`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" }),
      },
    );
    const data4 = await response4.json();
    console.log("✅ Workflow exécuté:", data4.execution.status);

    // Test 5: Webhook
    console.log("\n5. Test webhook...");
    const response5 = await fetch(`${API_BASE}/api/webhooks?webhookId=test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "test" }),
    });
    const data5 = await response5.json();
    console.log("✅ Webhook traité:", data5.success);

    // Test 6: Test base de données
    console.log("\n6. Test base de données...");
    const response6 = await fetch(`${API_BASE}/api/test-db`);
    const data6 = await response6.json();
    console.log("✅ Test DB:", data6.status);

    console.log("\n🎉 Tous les tests passés avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
