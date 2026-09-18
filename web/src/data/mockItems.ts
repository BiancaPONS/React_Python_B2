import type { Item } from "../types/api";

export const recettesMock: Item[] = [
  {
    id: 1,
    titre: "Tarte aux pommes",
    categorie: "Dessert",
    description:
      "Une tarte dorée, garnie de pommes fondantes et parfumée à la cannelle.",
    image_url:
      "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=900&q=80",
    annee: 2026,
    temps_preparation: 30,
    difficulte: "Facile",
    type_plat: "Dessert"
  },
  {
    id: 2,
    titre: "Pâtes carbonara",
    categorie: "Plat principal",
    description:
      "Des pâtes crémeuses au parmesan, aux œufs et aux lardons.",
    image_url:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80",
    annee: 2026,
    temps_preparation: 25,
    difficulte: "Moyen",
    type_plat: "Plat"
  },
  {
    id: 3,
    titre: "Salade méditerranéenne",
    categorie: "Entrée",
    description:
      "Une salade fraîche avec tomates, feta, concombre et olives.",
    image_url:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
    annee: 2026,
    temps_preparation: 15,
    difficulte: "Facile",
    type_plat: "Entrée"
  }
];