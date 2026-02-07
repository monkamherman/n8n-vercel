# n8n Vercel Serverless Edition

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/monkamherman/n8n-vercel-serverless)

### Déploiement serverless de n8n sur Vercel avec Supabase

Cette version transforme n8n en architecture serverless compatible avec Vercel, tout en conservant la puissance des workflows automatisés.

---

## 🚀 Architecture Serverless

### Composants principaux

- **API Serverless** : Fonctions Vercel remplaçant le serveur n8n
- **Workflows** : Système de workflows custom serverless
- **Base de données** : Supabase PostgreSQL (inchangé)
- **Cron Jobs** : Vercel Cron Jobs pour les tâches planifiées
- **Webhooks** : Gestion des webhooks via fonctions serverless

### Avantages de l'architecture Vercel

- **Scalabilité automatique** : Pas de gestion de serveur
- **Pay-per-use** : Paiement uniquement pour l'utilisation réelle
- **Global CDN** : Déploiement mondial instantané
- **Zero cold starts** : Fonctions maintenues chaudes
- **Intégration parfaite** : Écosystème Vercel complet

---

## 📋 Prérequis

1. **Compte Vercel** (gratuit sur vercel.com)
2. **Compte Supabase** (gratuit sur supabase.com)
3. **GitHub** pour le déploiement automatique

---

## 🛠️ Installation

### 1. Fork et déploiement

```bash
# Fork ce repository
# Cliquez sur "Deploy with Vercel"
# Connectez vos comptes Vercel et Supabase
```

### 2. Configuration Supabase

Créez un projet Supabase et récupérez :

- URL du projet : `https://votre-projet.supabase.co`
- Clé API : `votre-cle-anon`
- Connection string : `postgresql://...`

### 3. Variables d'environnement Vercel

Dans le dashboard Vercel > Settings > Environment Variables :

```bash
# Base de données
DATABASE_URL=postgresql://postgres:xxx@xxx.supabase.co:5432/postgres
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon

# Sécurité
CRON_SECRET=votre-secret-unique-32-caracteres
WEBHOOK_SECRET=votre-secret-webhook
ENCRYPTION_KEY=votre-cle-encryption-32-caracteres

# Configuration
NODE_ENV=production
LOG_LEVEL=info
```

---

## 🎯 Fonctionnalités

### Workflows Serverless

Les workflows n8n sont remplacés par des fonctions serverless :

```javascript
// Exécuter un workflow
POST /api/workflows?action=execute&workflowId=webhook-processor
{
  "data": "vos données"
}
```

### Webhooks

```javascript
// Recevoir un webhook
POST /api/webhooks?webhookId=votre-webhook
{
  "event": "trigger",
  "data": {...}
}
```

### Cron Jobs

Configurez dans Vercel > Cron Jobs :

```bash
# Keep-alive (toutes les 5 minutes)
0 */5 * * *  /api/cron?job=keep-alive

# Nettoyage données (tous les jours à 2h)
0 2 * * *  /api/cron?job=data-cleanup

# Rapports (tous les lundis à 9h)
0 9 * * 1  /api/cron?job=report-generation
```

---

## 📊 API Endpoints

### Routes principales

| Endpoint                        | Méthode | Description             |
| ------------------------------- | ------- | ----------------------- |
| `/`                             | GET     | Informations sur l'API  |
| `/api/health`                   | GET     | Health check            |
| `/api/workflows`                | GET     | Liste des workflows     |
| `/api/workflows?action=execute` | POST    | Exécuter un workflow    |
| `/api/webhooks`                 | POST    | Recevoir un webhook     |
| `/api/test-db`                  | GET     | Tester la connexion BDD |
| `/api/supabase`                 | POST    | Opérations Supabase     |

### Workflows disponibles

1. **Webhook Processor** : Traite les webhooks entrants
2. **Data Transformer** : Transforme et nettoie les données
3. **Notification Sender** : Envoie des notifications
4. **API Integrator** : Intégration APIs externes

---

## 🧪 Tests locaux

```bash
# Installer les dépendances
bun install

# Démarrer le serveur local
bun run dev

# Lancer les tests
bun run test
```

---

## 📈 Monitoring

### Logs Vercel

- Accédez aux logs dans le dashboard Vercel
- Fonctions > Functions Logs
- Temps réel et historique

### Métriques

- Temps d'exécution des fonctions
- Nombre d'invocations
- Erreurs et taux de succès
- Utilisation de la base de données

---

## 🔧 Configuration avancée

### Personnaliser les workflows

Éditez `api/workflows.js` pour ajouter vos propres workflows :

```javascript
case 'mon-workflow':
  executionResult.output = {
    // Votre logique ici
  };
  break;
```

### Ajouter des cron jobs

1. Éditez `api/cron.js`
2. Ajoutez votre fonction
3. Configurez le cron dans Vercel

### Intégrations externes

Ajoutez vos clés API dans les variables d'environnement :

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
EMAIL_SERVICE_API_KEY=votre-cle
EXTERNAL_API_KEY=votre-cle
```

---

## 💡 Migration depuis n8n

### Avantages de la migration

- **Coût réduit** : Pay-per-use vs serveur 24/7
- **Performance** : CDN mondial et edge computing
- **Scalabilité** : Auto-scaling automatique
- **Maintenance** : Zéro maintenance infrastructure

### Limitations

- Pas d'interface graphique n8n
- Workflows à coder en JavaScript
- Maximum 10 minutes par fonction
- Pas de stockage local

---

## 🚨 Dépannage

### Erreurs communes

1. **Function timeout** : Optimisez le code ou augmentez `maxDuration`
2. **Database connection** : Vérifiez `DATABASE_URL`
3. **CORS errors** : Headers configurés dans chaque fonction
4. **Cold starts** : Utilisez le cron keep-alive

### Debug

```bash
# Logs en temps réel
vercel logs

# Test local
vercel dev

# Déploiement debug
vercel --prod
```

---

## 📚 Documentation

- [Vercel Functions](https://vercel.com/docs/concepts/functions)
- [Supabase JavaScript](https://supabase.com/docs/reference/javascript)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Commitez vos changements
4. Ouvrez une Pull Request

---

## 📄 Licence

MIT License - voir fichier LICENSE

---

**Cette version serverless offre toute la puissance de n8n avec l'évolutivité de Vercel !**

Créé par HERMAN MOUKAM pour La Machine. Version serverless Vercel + Supabase.
