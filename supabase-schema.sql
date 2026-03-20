-- ============================================
-- Schema do Banco de Dados - Concessionária
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Tabela de veículos
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('carro', 'moto')),
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  ano INTEGER NOT NULL,
  preco DECIMAL(12, 2) NOT NULL,
  quilometragem INTEGER DEFAULT 0,
  combustivel VARCHAR(50),
  cambio VARCHAR(50),
  cor VARCHAR(50),
  descricao TEXT,
  fotos TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'vendido', 'reservado')),
  checklist JSONB DEFAULT '{"lavagem_feita": false, "revisao_realizada": false}',
  destaque BOOLEAN DEFAULT false,
  publicado BOOLEAN DEFAULT false,
  postado_instagram BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para filtros
CREATE INDEX idx_vehicles_tipo ON vehicles(tipo);
CREATE INDEX idx_vehicles_marca ON vehicles(marca);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_publicado ON vehicles(publicado);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode ler veículos publicados
CREATE POLICY "Veículos publicados são visíveis" ON vehicles
  FOR SELECT USING (publicado = true);

-- Política: service role pode fazer tudo
CREATE POLICY "Service role full access" ON vehicles
  USING (auth.role() = 'service_role');

-- Storage bucket para fotos
-- Criar via Dashboard: Storage > New Bucket > "veiculos" (público)
