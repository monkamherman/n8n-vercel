# 🆓 Configuration Free Tier - Vercel + Supabase

## 📊 Limites Gratuites

### Vercel (Hobby Plan - Gratuit)

- **Functions** : 100GB-heures/mois
- **Bandwidth** : 100GB/mois
- **Durée max par fonction** : 10 secondes (configuré)
- **Mémoire** : 1GB par fonction
- **Concurrent executions** : 1000
- **Domains** : 1 domaine personnalisé
- **Builds** : 100 builds/mois
- **Team members** : 1

### Supabase (Free Plan)

- **Base de données** : 500MB PostgreSQL
- **Bandwidth** : 500MB/mois
- **Connections** : 60 connections simultanées
- **Rows** : 50,000 rows
- **Auth** : 50,000 MAU (Monthly Active Users)
- **Storage** : 1GB file storage
- **Edge Functions** : 500,000 invocations/mois
- **Realtime** : 2 concurrent connections

## 🎯 Optimisations pour le Free Tier

### Configuration actuelle optimisée :

```json
{
  "functions": {
    "maxDuration": 10, // ✅ Limite gratuite
    "regions": ["fra1"] // ✅ Région unique = moins cher
  },
  "installCommand": "bun install" // ✅ Plus rapide que npm
}
```

### Stratégies d'économie :

1. **Fonctions légères** :
   - Maximum 10 secondes par exécution
   - Pas de traitement lourd
   - Réponses rapides

2. **Base de données optimisée** :
   - Connexions poolées
   - Requêtes simples
   - Indexation appropriée

3. **Cron jobs réduits** :
   - Keep-alive : toutes les 5 minutes
   - Nettoyage : 1x par jour
   - Rapports : 1x par semaine

## 📈 Usage estimé (Free Tier)

### Scénario typique :

- **Workflows** : 100 exécutions/jour = 3,000/mois
- **Webhooks** : 50/jour = 1,500/mois
- **Health checks** : 2,880/jour = 86,400/mois
- **Total functions** : ~90,000 exécutions/mois

### Calcul des coûts :

- **Functions** : 90,000 × 10s × 1GB = 900GB-heures ❌ DÉPASSE
- **Solution** : Optimiser les fonctions < 1 seconde

## 🔧 Optimisations recommandées

### 1. Réduire la durée des fonctions

```javascript
// Actuel : 10 secondes max
// Optimisé : 1-2 secondes max
"maxDuration": 3
```

### 2. Limiter les health checks

```javascript
// Actuel : toutes les 30 secondes
// Optimisé : toutes les 5 minutes
setInterval(checkHealth, 300000); // 5 minutes
```

### 3. Caching intelligent

```javascript
// Mettre en cache les résultats
// Éviter les requêtes répétées
```

## 💡 Alternatives Free Tier Friendly

### Option 1 : Railway ($5/mois)

- Plus généreux que Vercel free
- Supporte Docker
- Base de données incluse

### Option 2 : Render (Free tier existant)

- Déjà configuré
- Plus stable pour n8n
- Pas de limites de temps

### Option 3 : Fly.io ($5/mois)

- Supporte Docker
- Proche de l'architecture originale

## 📋 Recommandation

**Pour rester 100% gratuit :**

1. **Optimiser les fonctions** < 2 secondes
2. **Réduire les appels API** au minimum
3. **Utiliser le caching** intensivement
4. **Monitorer l'usage** quotidiennement

**Pour plus de stabilité :**

- Railway à $5/mois (recommandé)
- Ou rester sur Render (gratuit mais limité)

## 🚨 Alertes Free Tier

- **Functions** : Surveillance obligatoire
- **Database** : 500MB = petit pour n8n
- **Connections** : 60 simultanées = limitant
- **Bandwidth** : 500GB/mois = attention aux webhooks

---

**Conclusion** : Possible en free tier mais **très limité**. Recommandé d'optimiser ou d'utiliser une alternative low-cost.
