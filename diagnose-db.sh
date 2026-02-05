#!/bin/sh

# Script de diagnostic pour vérifier la configuration n8n PostgreSQL
echo "🔍 Diagnostic de configuration n8n PostgreSQL"
echo "=============================================="
echo ""

echo "📋 Variables d'environnement PostgreSQL:"
echo "  DB_TYPE: ${DB_TYPE:-'NOT SET'}"
echo "  N8N_DATABASE_TYPE: ${N8N_DATABASE_TYPE:-'NOT SET'}"
echo "  N8N_DB_TYPE: ${N8N_DB_TYPE:-'NOT SET'}"
echo ""
echo "  N8N_DB_POSTGRESDB_HOST: ${N8N_DB_POSTGRESDB_HOST:-'NOT SET'}"
echo "  N8N_DB_POSTGRESDB_PORT: ${N8N_DB_POSTGRESDB_PORT:-'NOT SET'}"
echo "  N8N_DB_POSTGRESDB_DATABASE: ${N8N_DB_POSTGRESDB_DATABASE:-'NOT SET'}"
echo "  N8N_DB_POSTGRESDB_USER: ${N8N_DB_POSTGRESDB_USER:-'NOT SET'}"
echo "  N8N_DB_POSTGRESDB_PASSWORD: ${N8N_DB_POSTGRESDB_PASSWORD:+***SET***}"
echo ""
echo "  DATABASE_URL: ${DATABASE_URL:+***SET***}"
echo ""

# Vérifier si psql est disponible
if command -v psql >/dev/null 2>&1; then
    echo "✅ psql est disponible"
    
    # Test de connexion
    echo ""
    echo "🔗 Test de connexion à PostgreSQL..."
    if [ -n "$DATABASE_URL" ]; then
        psql "$DATABASE_URL" -c "SELECT version();" 2>&1 | head -n 5
        
        echo ""
        echo "📊 Tables dans la base de données:"
        psql "$DATABASE_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>&1
    else
        echo "❌ DATABASE_URL n'est pas défini"
    fi
else
    echo "⚠️  psql n'est pas disponible dans ce conteneur"
    echo "   Installation de postgresql-client..."
    apk add --no-cache postgresql-client
    
    if [ -n "$DATABASE_URL" ]; then
        echo ""
        echo "🔗 Test de connexion à PostgreSQL..."
        psql "$DATABASE_URL" -c "SELECT version();" 2>&1 | head -n 5
    fi
fi

echo ""
echo "🎯 Configuration recommandée:"
echo "   Toutes les variables DB_TYPE, N8N_DATABASE_TYPE et N8N_DB_TYPE doivent être 'postgresdb'"
echo "   DATABASE_URL doit pointer vers Supabase"
echo ""
