#!/bin/bash

(
  cd api || exit
  source .venv/bin/activate
  python -m uvicorn main:app --reload --port 8000
) &

(
  cd web || exit
  npm run dev
) &

wait

// On a fait ce mini script bash pour pouvoir lancer les 2 serveurs avec une commande plutôt que de devoir ouvrir 2 terminaux et lancer les 2 serveurs séparément. 