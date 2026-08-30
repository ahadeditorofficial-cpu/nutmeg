-- Migration: 006_create_rag.sql
-- Creates rag_chunk, rag_embedding tables with pgvector extension and IVFFlat index

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings (separate from user data per AGENTS.md)
CREATE TABLE IF NOT EXISTS rag_chunk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rag_embedding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chunk_id UUID REFERENCES rag_chunk(id) ON DELETE CASCADE,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVFFlat index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_rag_embedding_vector ON rag_embedding USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- GIN index on metadata for JSONB queries
CREATE INDEX IF NOT EXISTS idx_rag_chunk_metadata ON rag_chunk USING gin(metadata);

-- Enable RLS on all tables
ALTER TABLE rag_chunk ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_embedding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rag_chunk (authenticated users can read)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view RAG chunks' AND tablename = 'rag_chunk') THEN
    CREATE POLICY "Authenticated users can view RAG chunks" ON rag_chunk
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage RAG chunks' AND tablename = 'rag_chunk') THEN
    CREATE POLICY "Service role can manage RAG chunks" ON rag_chunk
      FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- RLS Policies for rag_embedding (authenticated users can read)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view RAG embeddings' AND tablename = 'rag_embedding') THEN
    CREATE POLICY "Authenticated users can view RAG embeddings" ON rag_embedding
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage RAG embeddings' AND tablename = 'rag_embedding') THEN
    CREATE POLICY "Service role can manage RAG embeddings" ON rag_embedding
      FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
