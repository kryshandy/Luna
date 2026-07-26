"""
demo_lulu_cli.py — Démo en ligne de commande du pipeline RAG complet.
Question -> retriever (pgvector) -> prompt augmenté -> Ollama -> réponse.
Utile pour tester/démontrer le cœur de Lulu sans Backend ni Frontend.
"""

import ollama
from rag.retriever import retrieve, build_augmented_prompt

MODEL = "gemma2:2b"

SYSTEM_PROMPT = """Tu es Lulu, la compagne IA bienveillante de l'application Luna.
Tu réponds en français, avec empathie et douceur.
Tu ne poses jamais de diagnostic médical.
Tu t'appuies uniquement sur les informations fournies dans le contexte.
Si le contexte ne suffit pas, dis-le clairement et invite à consulter une professionnelle de santé.
Si l'utilisatrice exprime une détresse importante, oriente-la immédiatement vers une aide professionnelle."""


def ask_lulu(question: str) -> str:
    chunks = retrieve(question)
    augmented_prompt = build_augmented_prompt(question, chunks)

    response = ollama.chat(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": augmented_prompt},
        ],
    )
    return response["message"]["content"]


def main():
    print("=== Démo Lulu (RAG + Ollama) - tape 'quit' pour sortir ===\n")
    while True:
        question = input("Toi : ")
        if question.strip().lower() in ("quit", "exit"):
            print("Au revoir !")
            break
        if not question.strip():
            continue
        print("\nLulu réfléchit...\n")
        answer = ask_lulu(question)
        print(f"Lulu : {answer}\n")


if __name__ == "__main__":
    main()