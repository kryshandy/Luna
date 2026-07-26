"""
test_retrieval.py — Test du retrieval sur un échantillon de questions variées.
Vérifie que le bon passage (catégorie attendue) ressort bien en premier résultat.
Sert de base pour calculer le "hit rate" mentionné dans les métriques du projet
(section 14.1 de la doc : objectif > 85%).
"""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from rag.retriever import retrieve

# Chaque cas de test : une question + la catégorie qu'on s'attend à voir
# ressortir en premier résultat. À enrichir au fur et à mesure.
TEST_CASES = [
    {
        "question": "J'ai mal au ventre pendant mes règles, c'est normal ?",
        "expected_category": "Douleurs pendant les règles",
    },
    {
        "question": "Mes règles ont deux semaines de retard, dois-je m'inquiéter ?",
        "expected_category": "Retard de règles",
    },
    {
        "question": "Combien de temps dure un cycle normalement ?",
        "expected_category": "Cycle menstruel",
    },
    {
        "question": "Je me sens très mal, j'ai des pensées noires",
        "expected_category": "Mode SOS - détresse émotionnelle",
    },
    {
        "question": "Quelle est la capitale de la France ?",  # question hors-sujet volontaire
        "expected_category": None,
    },
]


def run_tests():
    hits = 0
    total = len(TEST_CASES)

    print(f"=== Test du retrieval sur {total} question(s) ===\n")

    for i, case in enumerate(TEST_CASES, start=1):
        question = case["question"]
        expected = case["expected_category"]

        results = retrieve(question, match_count=3)

        top_category = results[0]["category"] if results else None
        top_similarity = results[0]["similarity"] if results else 0.0

        is_hit = (expected is None and not results) or (
            expected is not None and top_category == expected
        )
        hits += int(is_hit)

        status = "OK" if is_hit else "ECHEC"
        print(f"[{status}] Q{i}: {question}")
        print(f"      Attendu : {expected}")
        print(f"      Obtenu  : {top_category} (similarité={top_similarity:.3f})")
        if not results:
            print(f"      (aucun résultat retourné)")
        print()

    hit_rate = (hits / total) * 100
    print(f"--- Résultat global ---")
    print(f"Hit rate : {hits}/{total} ({hit_rate:.1f}%)")
    print(f"Objectif projet : > 85%")


if __name__ == "__main__":
    run_tests()