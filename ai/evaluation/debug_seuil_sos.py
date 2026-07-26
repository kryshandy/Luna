"""
debug_seuil_sos.py — Script de diagnostic ponctuel.
Affiche le score de similarité réel du passage SOS pour une question donnée,
sans filtrage par seuil, pour identifier la bonne valeur de match_threshold.
"""

from rag.retriever import retrieve

question = "Je me sens très mal, j'ai des pensées noires"

results = retrieve(question, match_threshold=0.0, match_count=5)

print(f"Question : {question}\n")
for r in results:
    print(f"{r['category']} -> similarité = {round(r['similarity'], 3)}")