# n8n Serverless sur Vercel

Déploiement complet de n8n avec interface graphique sur Vercel et base de données Supabase.

## 🚀 Fonctionnalités

- ✅ Interface web n8n complète
- ✅ Base de données Supabase PostgreSQL
- ✅ Workflows serverless
- ✅ Webhooks et cron jobs
- ✅ Gestion des credentials
- ✅ Exécution de workflows
- ✅ Interface de conception visuelle

## 📋 Configuration

### Variables d'environnement

```bash
# Configuration n8n
N8N_HOST=n8n-vercel02.vercel.app
N8N_PORT=3000
N8N_PROTOCOL=https
N8N_BASIC_AUTH_ACTIVE=false
N8N_ENCRYPTION_KEY=vercel-encryption-key-2024-secure-32chars

# Base de données
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...

# Configuration avancée
N8N_EXECUTION_DATA_PRUNE=true
N8N_EXECUTION_DATA_MAX_AGE=168
N8N_METRICS=true
N8N_USER_MANAGEMENT_DISABLED=true
```

### Structure de la base de données

Le projet utilise 4 tables principales :

- **workflows** : Définition des workflows n8n
- **workflow_executions** : Historique des exécutions
- **credentials** : Credentials chiffrés
- **webhooks** : Configuration des webhooks

## 🛠️ Installation

1. **Installer les dépendances**

   ```bash
   bun install
   ```

2. **Configurer la base de données**
   - Allez dans votre dashboard Supabase
   - Ouvrez l'éditeur SQL
   - Exécutez le fichier `supabase-migrations.sql`

3. **Déployer sur Vercel**
   ```bash
   git push origin main
   ```

## 📡 Endpoints API

### Interface n8n

- `GET /` : Interface web principale
- `GET /api/n8n` : Endpoint n8n API

### Workflows

- `GET /api/workflows` : Lister les workflows
- `POST /api/workflows` : Créer un workflow

### Webhooks

- `POST /api/webhooks` : Recevoir des webhooks
- `POST /api/webhooks/{id}` : Webhook spécifique

### Système

- `GET /api/health` : État du système
- `GET /api/test-db` : Test base de données
- `POST /api/setup-db` : Configuration base de données

## 🎯 Utilisation

### Accès à l'interface

1. Ouvrez https://n8n-vercel02.vercel.app/
2. L'interface n8n s'affiche avec les workflows disponibles
3. Créez, modifiez et exécutez des workflows

### Créer un workflow

```javascript
// Exemple de workflow via API
POST /api/workflows
{
  "name": "Mon Workflow",
  "type": "webhook",
  "nodes": [
    {"id": 1, "name": "Webhook", "type": "webhook"},
    {"id": 2, "name": "Set", "type": "set"},
    {"id": 3, "name": "HTTP Request", "type": "httpRequest"}
  ]
}
```

### Tester un webhook

```bash
curl -X POST https://n8n-vercel02.vercel.app/api/webhooks/mon-webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

## 🔧 Développement local

```bash
# Démarrer le serveur de développement
bun run dev

# Tester les endpoints
curl http://localhost:3000/api/health
```

## 📊 Monitoring

### Logs d'exécution

Les exécutions de workflows sont enregistrées dans la table `workflow_executions`.

### Métriques

- Activez `N8N_METRICS=true` pour les métriques détaillées
- Utilisez `/api/health` pour vérifier l'état du système

## 🚨 Limitations

- **Durée d'exécution** : 30 secondes maximum (limitation Vercel)
- **Taille des payloads** : 10MB maximum
- **Base de données** : Utilisation de Supabase (limitations du tier gratuit)

## 🔄 Mises à jour

Pour mettre à jour n8n :

```bash
bun add n8n@latest
git add .
git commit -m "Update n8n"
git push origin main
```

## 📝 Notes importantes

- L'interface n8n complète est en cours de développement
- Les workflows sont sauvegardés dans Supabase
- Les webhooks sont automatiquement configurés
- Le système est optimisé pour l'environnement serverless

## 🆘 Support

En cas de problème :

1. Vérifiez `/api/health` pour l'état du système
2. Testez la connexion base de données avec `/api/test-db`
3. Consultez les logs Vercel pour les erreurs d'exécution

---

**Version** : 2.0.0-serverless  
**Déployé sur** : https://n8n-vercel02.vercel.app/  
**Base de données** : Supabase PostgreSQL
