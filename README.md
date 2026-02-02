# n8n-render (Render + Supabase)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/monkamherman/n8n-vercel)

### Déploiement de n8n sur Render avec base de données Supabase

#### Prérequis :

1. Un compte Render (gratuit sur render.com)
2. Un compte GitHub

#### Étapes d'installation :

1. **Fork le repository :**
   - Fork ce repository sur votre compte GitHub
   - Copiez l'URL de votre fork

2. **Déployer sur Render :**
   - Allez sur [render.com](https://render.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur "New +" > "Web Service"
   - Connectez votre repository GitHub
   - Sélectionnez votre fork du projet

3. **Configuration automatique :**
   - Render détectera automatiquement le `render.yaml`
   - Il créera la base de données Supabase
   - Il configurera les variables d'environnement
   - Il créera le cronjob de keep-alive

4. **Variables d'environnement configurées :**

   ```
   DATABASE_URL= (automatique depuis Supabase)
   PORT=5678
   N8N_LOG_LEVEL=info
   GENERIC_TIMEZONE=Europe/Paris
   TZ=Europe/Paris
   N8N_DEFAULT_LOCALE=fr
   N8N_ENCRYPTION_KEY= (généré automatiquement)
   WEBHOOK_URL=https://votre-projet.onrender.com
   ```

5. **Accéder à n8n :**
   - Une fois le déploiement terminé, visitez votre URL Render
   - n8n démarrera avec tunnel pour les webhooks
   - L'interface sera accessible via votre URL Render

#### Configuration du cronjob Keep-Alive :

Le cronjob s'exécute toutes les 10 minutes pour :

- Éviter la mise en veille du service gratuit Render
- Maintenir n8n actif et disponible
- Assurer la réception des webhooks

#### Avantages de cette configuration :

- **Vraiment gratuit** : Render et Supabase plans gratuits
- **n8n natif** : Pas de contournements ou limitations
- **Base de données persistante** : Supabase PostgreSQL
- **Keep-alive automatique** : Cronjob intégré
- **Tunnel webhooks** : Accès externe automatique
- **Docker natif** : Environnement n8n standard

#### Limites :

- **Plan gratuit Render** : 750 heures/mois
- **Inactivité** : Le cronjob résout ce problème
- **Base de données** : 500MB sur Supabase gratuit
- **Redémarrages** : Service peut redémarrer (normal sur gratuit)

#### Monitoring :

- Health check : `https://votre-projet.onrender.com/healthz`
- Keep-alive : `https://votre-projet.onrender.com/keep-alive`
- Logs disponibles dans le dashboard Render

#### Dépannage :

- Si le service est inactif, attendez le prochain cronjob (10 min max)
- Vérifiez les logs dans le dashboard Render
- Redémarrez manuellement le service si nécessaire

---

**Cette instance sera gratuite avec les plans gratuits Render et Supabase.**

Créé par HERMAN MOUKAM pour La Machine. Adapté pour Render + Supabase.

**Connection Supabase :**

```
postgresql://postgres:YjxBJtgTwSlBxnSQ@db.kbeseafmtepfjatzvjnr.supabase.co:5432/postgres
```
