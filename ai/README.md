# Luna — Service IA (RAG + petit modèle aligné)

Ce dossier contient le pipeline RAG, le service d'inférence (Ollama) et l'entraînement du Luna Score.

## Setup local
1. python -m venv venv
2. venv\Scripts\activate
3. pip install -r requirements.txt
4. ollama pull gemma2:2b

## Structure
- knowledge_base/ : contenu source (raw/cleaned) pour le RAG
- rag/ : ingest.py, retriever.py
- model/ : system_prompt.md
- training/ : entraînement du Luna Score
- inference/ : service FastAPI + streaming SSE
- evaluation/ : scripts + métriques RAG