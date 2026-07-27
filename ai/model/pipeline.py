"""
pipeline.py — Orchestrateur du parcours d'une question utilisatrice.
Défense en profondeur (recommandation Krys) :
  1. Détecteur SOS (mots-clés, déterministe) — couche rapide en amont
  2. RAG (pgvector + retriever.py) — si pas de SOS détecté
Réutilisable par demo_lulu_cli.py (Sprint 2) et inference/server.py (Sprint 3).
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.sos_detector import detect_sos
from rag.retriever import retrieve, build_augmented_prompt

SOS_RESPONSE = (
    "Je sens que tu traverses un moment très difficile, et je veux que tu saches "
    "que tu n'es pas seule. Je ne suis pas en mesure de t'accompagner dans ce genre "
    "de situation, mais des professionnel·les formé·es peuvent t'aider tout de suite.\n\n"
    "📞 [NUMÉRO D'URGENCE LOCAL VÉRIFIÉ]\n\n"
    "Si tu es en danger immédiat, contacte les secours ou rends-toi dans un lieu sûr. "
    "Je reste disponible si tu veux simplement parler en attendant."
)


def handle_message(question: str) -> dict:
    """
    Point d'entrée unique pour traiter un message utilisatrice.

    Returns:
        {
            "sos": bool,
            "response_text": str | None,   # pré-remplie seulement si sos=True
            "augmented_prompt": str | None # à envoyer à Ollama seulement si sos=False
        }
    """
    sos_result = detect_sos(question)

    if sos_result["sos"]:
        return {
            "sos": True,
            "matched_pattern": sos_result["matched_pattern"],
            "response_text": SOS_RESPONSE,
            "augmented_prompt": None,
        }

    chunks = retrieve(question)
    prompt = build_augmented_prompt(question, chunks)

    return {
        "sos": False,
        "matched_pattern": None,
        "response_text": None,
        "augmented_prompt": prompt,
        "chunks": chunks,
    }


if __name__ == "__main__":
    tests = [
        "J'ai envie de mourir, je n'en peux plus",
        "J'ai mal au ventre pendant mes règles, c'est normal ?",
    ]
    for q in tests:
        print(f"Question : {q}")
        result = handle_message(q)
        if result["sos"]:
            print(f"  -> SOS déclenché (pattern: {result['matched_pattern']})")
            print(f"  -> Réponse : {result['response_text'][:80]}...\n")
        else:
            print(f"  -> RAG normal, {len(result['chunks'])} chunk(s) trouvé(s)\n")