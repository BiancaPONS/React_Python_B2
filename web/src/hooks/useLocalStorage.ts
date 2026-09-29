import { useState } from "react";


export function useLocalStorage<T>(
  cle: string,
  valeurInitiale: T,
): [T, (valeur: T) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    const valeurStockee = localStorage.getItem(cle);

    if (valeurStockee === null) {
      return valeurInitiale;
    }

    try {
      return JSON.parse(valeurStockee) as T;
    } catch {
      return valeurInitiale;
    }
  });

  function setValeurEtStocker(nouvelleValeur: T): void {
    setValeur(nouvelleValeur);
    localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
  }

  return [valeur, setValeurEtStocker];
}