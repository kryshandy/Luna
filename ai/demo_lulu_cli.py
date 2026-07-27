"""
demo_lulu_cli.py — Démo en ligne de commande du pipeline complet.
Question -> détecteur SOS -> (si rien détecté) RAG (pgvector) -> prompt augmenté -> Ollama -> réponse.
Utile pour tester/démontrer le cœur de Lulu sans Backend ni Frontend.
"""
import ollama
from model.pipeline import handle_message

MODEL = "gemma2:2b"
SYSTEM_PROMPT = """Tu es Lulu, la compagne IA bienveillante de l'application Luna. Tu réponds en français, avec empathie et douceur.
Tu ne poses jamais de diagnostic médical.
Tu t'appuies uniquement sur les informations fournies dans le contexte.
Si le contexte ne suffit pas, dis-le clairement et invite à consulter une professionnelle de santé.
Si l'utilisatrice exprime une détresse importante, oriente-la immédiatement vers une aide professionnelle."""


def ask_lulu(question: str) -> str:
    result = handle_message(question)

    if result["sos"]:
        # Court-circuite le RAG et Ollama : réponse SOS pré-écrite, immédiate.
        return result["response_text"]

    response = ollama.chat(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": result["augmented_prompt"]},
        ],
    )
    return response["message"]["content"]


def main():
    print("=== Démo Lulu (SOS + RAG + Ollama) - tape 'quit' pour sortir ===\n")
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