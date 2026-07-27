"""
Détecteur SOS — première ligne de défense avant le RAG.
Ne remplace pas le chunk SOS de la FAQ (pgvector), s'ajoute en amont.
Approche volontairement simple (mots-clés/regex) : rapide, déterministe,
pas de dépendance modèle. À affiner avec de vrais retours QA (Krys).
"""

import re
import unicodedata

# Patterns groupés par thème. Les regex utilisent \b pour éviter les
# faux positifs sur des sous-chaînes (ex: "mortier" ne doit pas matcher "mort").
SOS_PATTERNS = [
    # Idées suicidaires / envie de mourir
    r"\bsuicid\w*\b",
    r"\bme\s+tuer\b",
    r"\bmettre\s+fin\s+a\s+mes\s+jours\b",
    r"\benvie\s+de\s+mourir\b",
    r"\bje\s+veux\s+mourir\b",
    r"\bplus\s+envie\s+de\s+vivre\b",
    # Automutilation
    r"\bme\s+faire\s+du\s+mal\b",
    r"\bme\s+scarifier\b",
    r"\bscarification\w*\b",
    r"\bautomutilation\w*\b",
    # Violence subie (agression, viol, inceste)
    r"\bviol\w*\b",
    r"\bagress\w*\s+sexuel\w*\b",
    r"\binceste\w*\b",
    r"\bmon\s+(copain|mari|conjoint|pere|frere)\s+me\s+frappe\b",
    r"\bbattue?\b",
    # Détresse aiguë explicite
    r"\bau\s+secours\b",
    r"\bje\s+n\'?en\s+peux\s+plus\b",
    r"\burgence\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in SOS_PATTERNS]


def _normalize(text: str) -> str:
    """Minuscules + suppression des accents, pour matcher 'a' et 'à'."""
    text = text.lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return text


def detect_sos(message: str) -> dict:
    """
    Analyse un message et retourne un dict :
    {"sos": bool, "matched_pattern": str|None}
    """
    if not message or not message.strip():
        return {"sos": False, "matched_pattern": None}

    normalized = _normalize(message)

    for pattern in _COMPILED:
        if pattern.search(normalized):
            return {"sos": True, "matched_pattern": pattern.pattern}

    return {"sos": False, "matched_pattern": None}


if __name__ == "__main__":
    # Quelques tests manuels rapides pour vérifier que ça marche.
    tests = [
        "J'ai envie de mourir, je n'en peux plus",
        "Mon copain me frappe depuis des mois",
        "Quand reviennent mes règles normalement ?",
        "J'ai des crampes terribles ce mois-ci",
        "Je me sens à bout, au secours",
    ]
    for t in tests:
        print(f"{t!r} -> {detect_sos(t)}")