"""
ingest.py — Pipeline d'ingestion RAG pour Lulu
Lit les documents source, les découpe en passages, génère les embeddings
et les stocke dans pgvector (table knowledge_chunks sur Supabase).
"""

import os
import glob
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

# --- Configuration ---
load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
KNOWLEDGE_BASE_DIR = Path(__file__).parent.parent / "knowledge_base" / "raw"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Chargement du modèle d'embeddings (peut prendre un moment la 1ère fois)...")
model = SentenceTransformer(EMBEDDING_MODEL)


def chunk_document(text: str, source: str):
    """
    Découpe un document en passages à partir des titres markdown (#).
    Chaque section devient un chunk indépendant.
    """
    chunks = []
    sections = text.split("\n# ")
    for section in sections:
        section = section.strip()
        if not section:
            continue
        if not section.startswith("#"):
            section = "# " + section
        lines = section.split("\n", 1)
        category = lines[0].replace("#", "").strip()
        content = lines[1].strip() if len(lines) > 1 else ""
        if content:
            chunks.append({"content": content, "category": category, "source": source})
    return chunks


def ingest_all():
    files = glob.glob(str(KNOWLEDGE_BASE_DIR / "*.md"))
    if not files:
        print(f"Aucun fichier .md trouvé dans {KNOWLEDGE_BASE_DIR}")
        return

    total_inserted = 0
    for filepath in files:
        source_name = Path(filepath).name
        print(f"\nTraitement de {source_name}...")

        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()

        chunks = chunk_document(text, source_name)
        print(f"  {len(chunks)} passage(s) découpé(s)")

        for chunk in chunks:
            embedding = model.encode(chunk["content"]).tolist()
            supabase.table("knowledge_chunks").insert({
                "content": chunk["content"],
                "source": chunk["source"],
                "category": chunk["category"],
                "embedding": embedding,
            }).execute()
            total_inserted += 1
            print(f"  -> inséré : {chunk['category']}")

    print(f"\nTerminé. {total_inserted} passage(s) inséré(s) au total.")


if __name__ == "__main__":
    ingest_all()