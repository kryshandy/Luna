"""
ingest.py — Pipeline d'ingestion RAG pour Lulu
Lit les documents source, les découpe en passages, génère les embeddings
et les stocke dans pgvector (table knowledge_chunks sur Supabase).

Gère deux formats :
- Format simple : titres markdown "# Titre" suivis de texte (ex. faq_test.md)
- Format structuré FAQ (Krys) : chunks "### ID — Titre" avec champs
  **Formulations utilisatrice**, **Réponse validée**, **Tags**
"""

import os
import re
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


def chunk_document_simple(text: str, source: str):
    """
    Découpe un document au format simple : titres markdown de premier niveau (#).
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


def extract_field(body: str, label: str) -> str:
    """
    Extrait le contenu d'un champ **Label...** : ... jusqu'au prochain champ,
    un séparateur "---", un titre "## ", ou la fin du texte — pour éviter
    d'avaler du texte parasite en fin de bloc (ex. transition vers le bloc suivant).
    """
    pattern = rf"\*\*{label}[^*]*\*\*\s*:\s*(.*?)(?=\n\*\*|\n---|\n##\s|\Z)"
    match = re.search(pattern, body, re.DOTALL)
    return match.group(1).strip() if match else ""


def chunk_document_faq(text: str, source: str):
    """
    Découpe un document au format structuré FAQ (convention Krys / QA-Contenu).
    Reconnaît les blocs "### ID — Titre" contenant Formulations utilisatrice,
    Réponse validée et Tags. Combine formulations + réponse dans le texte
    embeddé, comme recommandé (le vocabulaire utilisatrice doit faire partie
    de l'embedding, pas seulement la réponse).
    """
    chunks = []
    blocks = re.split(r"\n### ", text)

    for block in blocks[1:]:  # le premier morceau est l'en-tête avant le 1er ###
        lines = block.split("\n", 1)
        header = lines[0].strip()
        body = lines[1] if len(lines) > 1 else ""

        header_match = re.match(r"([A-Za-z]+-\d+)\s*[—-]\s*(.*)", header)
        if not header_match:
            continue  # ce n'est pas un chunk de contenu (ex. "3.1 Objectifs...")

        chunk_id = header_match.group(1)
        title = header_match.group(2).strip()

        formulations = extract_field(body, r"Formulations utilisatrice")
        reponse = extract_field(body, r"Réponse validée")
        tags = extract_field(body, r"Tags")

        if not reponse:
            continue  # pas de contenu exploitable

        content_parts = []
        if formulations:
            content_parts.append(f"Questions typiques : {formulations}")
        content_parts.append(reponse)
        content = "\n\n".join(content_parts)

        category = tags if tags else title

        chunks.append({
            "content": content,
            "category": category,
            "source": f"{source}#{chunk_id}",
        })

    return chunks


def is_structured_faq(text: str) -> bool:
    """Détecte si un fichier suit le format structuré (chunks ### ID — Titre)."""
    return bool(re.search(r"\n### [A-Za-z]+-\d+\s*[—-]", text))


def ingest_all():
    """
    Vide la base de connaissances existante puis réingère tous les documents
    trouvés dans knowledge_base/raw/. Évite les doublons lors des relances
    successives pendant le développement/test.
    """
    files = glob.glob(str(KNOWLEDGE_BASE_DIR / "*.md"))
    if not files:
        print(f"Aucun fichier .md trouvé dans {KNOWLEDGE_BASE_DIR}")
        return

    print("Nettoyage de la base existante avant réingestion...")
    supabase.table("knowledge_chunks").delete().neq(
        "id", "00000000-0000-0000-0000-000000000000"
    ).execute()

    total_inserted = 0
    for filepath in files:
        source_name = Path(filepath).name
        print(f"\nTraitement de {source_name}...")

        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()

        if is_structured_faq(text):
            print("  Format détecté : FAQ structurée (Krys)")
            chunks = chunk_document_faq(text, source_name)
        else:
            print("  Format détecté : simple")
            chunks = chunk_document_simple(text, source_name)

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