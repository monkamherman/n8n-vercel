# 🔧 Correction du problème de connexion PostgreSQL

## 🚨 Problème identifié

Les logs de déploiement montrent que :
1. ✅ Les migrations n8n s'exécutent (tables créées)
2. ❌ Les tables n'apparaissent PAS dans Supabase
3. ⚠️ `Database connection timed out` dans les logs

**Cause racine** : n8n utilise SQLite par défaut au lieu de PostgreSQL, malgré les variables d'environnement configurées.

## 🔍 Diagnostic

### Indices dans les logs
```
14:30:48.898   info    Finished migration AddDynamicCredentialEntryTable1764689388394
14:31:09.199   warn    Database connection timed out
14:31:23.605   info    Database connection recovered
```

Les migrations s'exécutent **avant** la connexion PostgreSQL, ce qui signifie que n8n démarre avec SQLite, puis essaie de se connecter à PostgreSQL.

## ✅ Solutions appliquées

### 1. Modification du Dockerfile

**Avant** :
```dockerfile
CMD ["sh", "-c", "n8n start --database=postgresdb --database-host=$N8N_DB_POSTGRESDB_HOST ..."]
```

**Problème** : Les flags en ligne de commande ne sont pas toujours prioritaires sur les variables d'environnement.

**Après** :
```dockerfile
ENV N8N_DATABASE_TYPE=postgresdb
CMD ["n8n", "start"]
```

**Avantage** : Force n8n à utiliser PostgreSQL dès le démarrage.

### 2. Ajout de DB_TYPE dans render.yaml

**Ajout** :
```yaml
- key: DB_TYPE
  value: postgresdb
```

**Raison** : Certaines versions de n8n utilisent `DB_TYPE` au lieu de `N8N_DB_TYPE`.

### 3. Variables d'environnement critiques

Pour que n8n se connecte à PostgreSQL, il faut **TOUTES** ces variables :

```bash
# Type de base de données (3 variantes pour compatibilité)
DB_TYPE=postgresdb
N8N_DATABASE_TYPE=postgresdb
N8N_DB_TYPE=postgresdb

# Connection string (prioritaire)
DATABASE_URL=postgresql://postgres:YjxBJtgTwSlBxnSQ@db.kbeseafmtepfjatzvjnr.supabase.co:5432/postgres

# Détails de connexion (backup)
N8N_DB_POSTGRESDB_HOST=db.kbeseafmtepfjatzvjnr.supabase.co
N8N_DB_POSTGRESDB_PORT=5432
N8N_DB_POSTGRESDB_DATABASE=postgres
N8N_DB_POSTGRESDB_USER=postgres
N8N_DB_POSTGRESDB_PASSWORD=YjxBJtgTwSlBxnSQ
```

## 🧪 Vérification après déploiement

### 1. Vérifier les logs Render

Cherchez dans les logs :
```
✅ BON : "Using database type: postgresdb"
❌ MAUVAIS : "Using database type: sqlite"
```

### 2. Vérifier les tables dans Supabase

Connectez-vous à Supabase et vérifiez la présence de tables :
- `workflow_entity`
- `credentials_entity`
- `user_entity`
- `execution_entity`
- Tables avec préfixe `n8n_*`

### 3. Utiliser le script de diagnostic

Dans le conteneur Render, exécutez :
```bash
./diagnose-db.sh
```

### 4. Tester via l'API

```bash
curl https://n8n-a6u8.onrender.com/check-db
```

Devrait retourner :
```json
{
  "status": "OK",
  "database": "connected",
  "version": "PostgreSQL 15.x"
}
```

## 🔄 Étapes de redéploiement

1. **Commit les changements** :
   ```bash
   git add Dockerfile render.yaml diagnose-db.sh
   git commit -m "Fix: Force PostgreSQL connection for n8n"
   git push origin main
   ```

2. **Render redéploiera automatiquement**

3. **Surveiller les logs** :
   - Aller sur dashboard.render.com
   - Sélectionner le service n8n
   - Onglet "Logs"
   - Chercher "Using database type: postgresdb"

4. **Vérifier Supabase** :
   - Aller sur supabase.com
   - Projet : kbeseafmtepfjatzvjnr
   - Table Editor
   - Vérifier la présence des tables n8n

## 🎯 Résultat attendu

Après le redéploiement, vous devriez voir dans Supabase :

**Tables créées** :
- workflow_entity
- credentials_entity  
- user_entity
- execution_entity
- execution_data
- execution_metadata
- settings
- tag_entity
- workflow_statistics
- webhook_entity
- role
- user_role
- shared_workflow
- shared_credentials
- installed_packages
- installed_nodes
- auth_identity
- auth_provider_sync_history
- event_destinations
- variables
- execution_annotation
- annotation_tag_mapping
- workflow_history
- workflow_tag_mapping
- credentials_test
- agent (avec colonne icon)
- chat_hub_messages
- ... et bien d'autres

**Nombre total** : ~50-60 tables

## 📝 Notes importantes

1. **Timeout de connexion** : Normal au premier démarrage (cold start)
2. **Migrations** : Peuvent prendre 30-60 secondes
3. **Health check** : Peut échouer pendant les migrations
4. **Redémarrages** : Render peut redémarrer le service (normal)

## 🆘 Si le problème persiste

1. Vérifier que `DATABASE_URL` est bien défini dans Render
2. Tester la connexion manuellement depuis un conteneur :
   ```bash
   psql postgresql://postgres:YjxBJtgTwSlBxnSQ@db.kbeseafmtepfjatzvjnr.supabase.co:5432/postgres
   ```
3. Vérifier les logs pour "Using database type"
4. Supprimer et recréer le service sur Render
5. Vérifier que Supabase n'a pas de restrictions IP

## 📚 Références

- [n8n Database Configuration](https://docs.n8n.io/hosting/configuration/database/)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)
