#!/bin/sh

# Script de démarrage n8n avec configuration PostgreSQL explicite
echo "🚀 Démarrage de n8n avec PostgreSQL..."

# Afficher la configuration (sans les mots de passe)
echo "📋 Configuration:"
echo "  DB_TYPE: ${DB_TYPE}"
echo "  N8N_DB_TYPE: ${N8N_DB_TYPE}"
echo "  Host: ${N8N_DB_POSTGRESDB_HOST}"
echo "  Port: ${N8N_DB_POSTGRESDB_PORT}"
echo "  Database: ${N8N_DB_POSTGRESDB_DATABASE}"
echo "  User: ${N8N_DB_POSTGRESDB_USER}"
echo ""

# Démarrer n8n avec les variables d'environnement
exec n8n start
