-- Migration SQL pour n8n sur Supabase
-- Crée les tables nécessaires pour n8n

-- Table pour les workflows
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'inactive',
  type VARCHAR(50) DEFAULT 'manual',
  schedule VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Table pour les exécutions de workflows
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'running',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  data JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  mode VARCHAR(50) DEFAULT 'webhook'
);

-- Table pour les credentials
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  encrypted_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  path VARCHAR(255) UNIQUE NOT NULL,
  http_method VARCHAR(10) DEFAULT 'POST',
  response_code INTEGER DEFAULT 200,
  response_body TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_credentials_type ON credentials(type);
CREATE INDEX IF NOT EXISTS idx_webhooks_path ON webhooks(path);
CREATE INDEX IF NOT EXISTS idx_webhooks_workflow_id ON webhooks(workflow_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données exemples
INSERT INTO workflows (name, description, type, status, nodes, schedule) VALUES
('Webhook Receiver', 'Reçoit et traite les webhooks externes', 'webhook', 'active', 
 '[{"id": 1, "name": "Webhook", "type": "webhook"}, {"id": 2, "name": "Set", "type": "set"}, {"id": 3, "name": "HTTP Request", "type": "httpRequest"}]', 
 NULL),
('Data Processor', 'Traite les données selon un cron schedule', 'scheduled', 'active',
 '[{"id": 1, "name": "Cron", "type": "cron"}, {"id": 2, "name": "Function", "type": "function"}, {"id": 3, "name": "Supabase", "type": "supabase"}]',
 '0 */6 * * *'),
('API Integration', 'Intégration avec APIs externes', 'trigger', 'active',
 '[{"id": 1, "name": "HTTP Request", "type": "httpRequest"}, {"id": 2, "name": "Code", "type": "code"}, {"id": 3, "name": "Webhook", "type": "webhook"}]',
 NULL)
ON CONFLICT DO NOTHING;

-- Création d'un webhook exemple
INSERT INTO webhooks (workflow_id, path, http_method) 
SELECT id, 'webhook-example', 'POST' FROM workflows WHERE name = 'Webhook Receiver'
ON CONFLICT DO NOTHING;
