"""
retriever.py — Recherche de passages pertinents pour le RAG de Lulu
Prend une question, calcule son embedding, et retrouve les passages
les plus proches dans knowledge_chunks via la fonction match_knowledge_chunks.
"""

import os
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
model = SentenceTransformer(EMBEDDING_MODEL)


def retrieve(question: str, match_count: int = 5, match_threshold: float = 0.3):
    """
    Retourne les passages les plus pertinents pour une question donnée.

    Args:
        question: la question posée par l'utilisatrice
        match_count: nombre max de passages à retourner
        match_threshold: score de similarité minimum (0 à 1) pour garder un passage

    Returns:
        Liste de dicts : [{content, source, category, similarity}, ...]
    """
    question_embedding = model.encode(question).tolist()

    response = supabase.rpc(
        "match_knowledge_chunks",
        {
            "query_embedding": question_embedding,
            "match_threshold": match_threshold,
            "match_count": match_count,
        },
    ).execute()

    return response.data


def build_augmented_prompt(question: str, chunks: list) -> str:
    """
    Construit le prompt final envoyé au modèle : system prompt + passages + question.
    """
    if not chunks:
        context = "Aucune information pertinente trouvée dans la base de connaissances."
    else:
        context = "\n\n".join(
            f"[Source: {c['category']}]\n{c['content']}" for c in chunks
        )

    prompt = f"""Voici des informations validées pour t'aider à répondre :

{context}

Question de l'utilisatrice : {question}

Réponds en te basant uniquement sur les informations ci-dessus. Si elles ne suffisent pas, dis-le clairement et invite à consulter une professionnelle de santé."""
    return prompt


if __name__ == "__main__":
    test_question = "J'ai mal au ventre pendant mes règles, c'est normal ?"
    print(f"Question : {test_question}\n")

    results = retrieve(test_question)

    print(f"{len(results)} passage(s) trouvé(s) :\n")
    for r in results:
        print(f"  - [{r['category']}] similarité={r['similarity']:.3f}")
        print(f"    {r['content'][:100]}...\n")

    print("--- Prompt augmenté généré ---\n")
    print(build_augmented_prompt(test_question, results))