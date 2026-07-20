-- Table de la base de connaissances pour le RAG de Lulu
-- Dimension 384 = modèle sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2

create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source text,
  category text,
  embedding vector(384) not null,
  created_at timestamptz default now()
);

-- Index pour accélérer la recherche de similarité (HNSW, adapté à pgvector 0.8+)
create index if not exists knowledge_chunks_embedding_idx
  on knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

-- Fonction de recherche des passages les plus proches d'une question
create or replace function match_knowledge_chunks (
  query_embedding vector(384),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  source text,
  category text,
  similarity float
)
language sql stable
as $$
  select
    knowledge_chunks.id,
    knowledge_chunks.content,
    knowledge_chunks.source,
    knowledge_chunks.category,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;