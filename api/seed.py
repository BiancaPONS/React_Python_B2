import asyncio
from urllib.parse import quote

import httpx
from sqlmodel import select

from db.database import create_db_and_tables, get_session
from models.item import Item


THEMEALDB_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s="


async def get_image_url(
    client: httpx.AsyncClient,
    search_name: str,
) -> str | None:
    url = f"{THEMEALDB_URL}{quote(search_name)}"

    try:
        response = await client.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()
        meals = data.get("meals")

        if meals:
            return meals[0].get("strMealThumb")

    except (httpx.HTTPError, ValueError):
        return None

    return None


def recette(
    titre: str,
    categorie: str,
    temps: int,
    difficulte: str,
    resume: str,
    ingredients: str,
    preparation: str,
    image_search: str,
    image_url: str | None = None,
) -> dict[str, str | int | None]:
    return {
        "titre": titre,
        "description": resume,
        "ingredients": ingredients,
        "preparation": preparation,
        "categorie": categorie,
        "temps_preparation": temps,
        "difficulte": difficulte,
        "image_search": image_search,
        "image_url": image_url,
    }


items = [
    recette(
        "Roulés de jambon",
        "Apéro",
        5,
        "Très Facile",
        "Une bouchée rapide et efficace pour recevoir.",
        "- 4 tranches de jambon\n- 100 g de fromage frais\n- Ciboulette\n- Poivre",
        "1. Mélanger le fromage frais avec la ciboulette.\n2. Étaler sur le jambon.\n3. Rouler puis couper en morceaux.",
        "ham roll",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNOmfqIW7Pq1lsfAppYZqJoHQSiaEHysWin5ikWUZpg&s=10",
    ),
    recette(
        "Mojito",
        "Boissons",
        5,
        "Moyen",
        "Un cocktail frais à la menthe et au citron vert.",
        "- 1 citron vert\n- 8 feuilles de menthe\n- 2 cuillères à café de sucre\n- 6 cl de rhum blanc\n- Eau gazeuse\n- Glaçons",
        "1. Presser le citron.\n2. Ajouter sucre et menthe.\n3. Ajouter rhum, glaçons et eau gazeuse.",
        "mojito",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0yL6btwZ1HXoEanMxAUgIC4dZK3j6LCg5lRHu72eIsA&s=10"
    ),
    recette(
        "Gaspacho",
        "Entrée",
        15,
        "Facile",
        "Une soupe froide de légumes, idéale pour l'été.",
        "- 5 tomates\n- 1 concombre\n- 1 poivron rouge\n- 1 oignon\n- Huile d'olive\n- Vinaigre, sel et poivre",
        "1. Couper les légumes.\n2. Mixer tous les ingrédients.\n3. Réserver au frais au moins 1 heure.",
        "gazpacho",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5eY0GT-Pz8KKH0uJegFxuX17UUc15owP0QPiLAE1ZzA&s=10",
    ),
    recette(
        "Taboulé",
        "Entrée",
        20,
        "Facile",
        "Une salade fraîche et pratique à partager.",
        "- 200 g de semoule\n- 3 tomates\n- 1 concombre\n- Menthe\n- 2 citrons\n- Huile d'olive",
        "1. Mélanger la semoule et les légumes coupés.\n2. Ajouter le citron, l'huile et la menthe.\n3. Laisser reposer au frais.",
        "tabbouleh",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgaiKiIrCrUDIQNfQf7FZx5BHoqsjVl6AdQajAvDGMIg&s=10",
    ),
    recette(
        "Friand au fromage",
        "Entrée",
        30,
        "Facile",
        "Un feuilleté croustillant au fromage fondant.",
        "- 1 pâte feuilletée\n- 150 g de fromage râpé\n- 1 œuf\n- Crème fraîche\n- Sel et poivre",
        "1. Découper la pâte.\n2. Ajouter le fromage.\n3. Refermer puis cuire au four.",
        "cheese pastry",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ZUsbTaNx9-xKQuCACfAOlJYcsvz85-kVSU-4PedK9A&s=10",
    ),
    recette(
        "Crème jambon fromage",
        "Entrée",
        35,
        "Facile",
        "Une entrée chaude et crémeuse au jambon et au fromage.",
        "- Jambon\n- Crème fraîche\n- Fromage râpé\n- Échalote\n- Poivre",
        "1. Faire revenir l'échalote.\n2. Ajouter le jambon et la crème.\n3. Ajouter le fromage puis servir chaud.",
        "ham cheese",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq9qVentCF5NscBosvJeT8cLBNQTnxXIN2dwEPNrm5eg&s=10",

    ),
    recette(
        "Quiche",
        "Plat",
        30,
        "Moyen",
        "Une quiche familiale facile à personnaliser.",
        "- 1 pâte brisée\n- 200 g de lardons\n- 3 œufs\n- 20 cl de crème\n- Fromage râpé",
        "1. Mettre la pâte dans un moule.\n2. Ajouter les lardons.\n3. Verser les œufs et la crème.\n4. Cuire 35 minutes à 180 °C.",
        "quiche",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MV0PUgPB6clX_-kNAfYgzrKMe0N9CDwKlMHQExNNuQ&s=10",
    ),
    recette(
        "Bœuf bourguignon",
        "Plat",
        90,
        "Difficile",
        "Un plat mijoté traditionnel au vin rouge.",
        "- 1 kg de bœuf\n- Vin rouge\n- Carottes\n- Oignons\n- Lardons\n- Champignons",
        "1. Faire revenir le bœuf.\n2. Ajouter les légumes et le vin.\n3. Mijoter environ 2 heures.",
        "beef bourguignon",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX6esoNEm3Qvt2gkxt3H8GHQaKzvzUyoC9Ni1StfX2oQ&s=10",
    ),
    recette(
        "Ramen de bœuf",
        "Plat",
        45,
        "Difficile",
        "Un bouillon complet avec nouilles et bœuf.",
        "- Bœuf\n- Nouilles ramen\n- Bouillon\n- Œufs\n- Carotte\n- Sauce soja",
        "1. Chauffer le bouillon.\n2. Ajouter nouilles et légumes.\n3. Ajouter le bœuf et l'œuf mollet.",
        "beef ramen",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7YrA-Uy8Fz8O_fWWxaK8vDgj9KlX5PBFduCBsdPTs4A&s=10",
    ),
    recette(
        "Blanquette de veau",
        "Plat",
        120,
        "Moyen",
        "Du veau mijoté dans une sauce douce et crémeuse.",
        "- Veau\n- Carottes\n- Poireau\n- Champignons\n- Crème\n- Jaune d'œuf",
        "1. Cuire le veau avec les légumes.\n2. Préparer la sauce.\n3. Ajouter viande et champignons.",
        "veal stew",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7bPMbUiy0BhmcnVNjE8kzqlp95fjJXmP9i93uZ6zT2Q&s=10",
    ),
    recette(
        "Yaglama",
        "Plat",
        60,
        "Moyen",
        "Des galettes garnies de viande et de légumes.",
        "- Farine\n- Eau\n- Viande hachée\n- Tomates\n- Poivron\n- Oignon",
        "1. Préparer les galettes.\n2. Cuire la viande et les légumes.\n3. Garnir les galettes.",
        "turkish flatbread",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfmE98Md9RSsjyBG8z7EwwcdtuJYFnZNvqomlOlPOtaQ&s=10",
    ),
    recette(
        "Cookies",
        "Dessert",
        60,
        "Moyen",
        "Des biscuits moelleux aux pépites de chocolat.",
        "- Farine\n- Beurre\n- Sucre\n- Œuf\n- Pépites de chocolat",
        "1. Préparer la pâte.\n2. Ajouter les pépites.\n3. Former des boules.\n4. Cuire 10 minutes à 180 °C.",
        "cookies",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4gbNQn6sEkkVEKnC4_J5c-oSIwGbpg0TnQxl1Kwqnaw&s=10",
    ),
    recette(
        "Crêpes",
        "Dessert",
        60,
        "Moyen",
        "Des crêpes à garnir selon ses envies.",
        "- Farine\n- Œufs\n- Lait\n- Sucre vanillé\n- Beurre",
        "1. Préparer la pâte.\n2. Laisser reposer.\n3. Cuire les crêpes dans une poêle chaude.",
        "crepes",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX2RHdPbrKZ6SVq_5GiiswYwMiJ6raCBn7TK7IGWFD3Q&s=10",
    ),
    recette(
        "Île flottante",
        "Dessert",
        20,
        "Facile",
        "Des blancs en neige sur une crème anglaise.",
        "- Œufs\n- Lait\n- Sucre\n- Vanille",
        "1. Préparer une crème anglaise.\n2. Monter les blancs.\n3. Les pocher puis servir sur la crème.",
        "floating island",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtstFHRJ5J1WL_ePaOkt1wwJTnQkin0zkYlkpBQfE41w&s=10",
    ),
    recette(
        "Crème brûlée",
        "Dessert",
        25,
        "Facile",
        "Une crème vanillée sous un caramel croustillant.",
        "- Jaunes d'œufs\n- Crème liquide\n- Sucre\n- Vanille\n- Cassonade",
        "1. Préparer la crème.\n2. Cuire en ramequins.\n3. Refroidir puis caraméliser.",
        "creme brulee",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLVb_spdAY6kQz84t2TvpsmkVYAJDFtDoyxRKFFAI4uA&s=10",
    ),
    recette(
        "Mousse au chocolat",
        "Dessert",
        20,
        "Facile",
        "Une mousse légère au chocolat noir.",
        "- Chocolat noir\n- Œufs\n- Sel",
        "1. Faire fondre le chocolat.\n2. Ajouter les jaunes.\n3. Incorporer les blancs en neige.\n4. Réserver au frais.",
        "chocolate mousse",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTFYYQzvVUpq1Hh2V0u3JRkAlW2WseBjFUjyHSzPBGCQ&s=10",
    ),
    recette(
        "Salade César",
        "Entrée",
        25,
        "Facile",
        "Une salade croquante au poulet et parmesan.",
        "- Poulet\n- Salade romaine\n- Parmesan\n- Croûtons\n- Sauce César",
        "1. Cuire le poulet.\n2. Mélanger avec la salade, les croûtons et le parmesan.\n3. Ajouter la sauce.",
        "caesar salad",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIjQvB4VnCOmk9iPCB-Nw8fuYGpEE1Z_3e6g3m4rqFAA&s=10",
    ),
    recette(
        "Bruschettas tomate mozzarella",
        "Apéro",
        15,
        "Facile",
        "Des tartines grillées aux tomates et à la mozzarella.",
        "- Pain\n- Tomates\n- Mozzarella\n- Basilic\n- Huile d'olive",
        "1. Garnir le pain.\n2. Ajouter basilic et huile.\n3. Faire griller.",
        "bruschetta",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCSbMT3U5KM-b1lhBE7Je5vGP6ey3pyDapzoVVqAyakw&s=10",
    ),
    recette(
        "Houmous",
        "Apéro",
        10,
        "Très Facile",
        "Une crème de pois chiches au tahini et au citron.",
        "- Pois chiches\n- Tahini\n- Citron\n- Ail\n- Huile d'olive",
        "1. Mixer tous les ingrédients.\n2. Servir avec du pain ou des crudités.",
        "hummus",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcD7w2BEu5e65ZGMXF0bATtVtdWkJudeDP4bx0LxEZOg&s=10",
    ),
    recette(
        "Guacamole",
        "Apéro",
        10,
        "Très Facile",
        "Une préparation fraîche à base d'avocat.",
        "- Avocats\n- Tomate\n- Citron vert\n- Oignon\n- Coriandre",
        "1. Écraser les avocats.\n2. Ajouter les autres ingrédients.\n3. Servir frais.",
        "guacamole",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk5d7OWXJSyJDvOhjNxMsSvYVw0LjY8CfeT4w1f_WGlA&s=10",
    ),
    recette(
        "Samoussas au poulet",
        "Apéro",
        35,
        "Moyen",
        "Des triangles croustillants au poulet épicé.",
        "- Feuilles de brick\n- Poulet\n- Carotte\n- Oignon\n- Curry",
        "1. Cuire la garniture.\n2. Plier les samoussas.\n3. Cuire au four.",
        "samosa",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL5_zgVXqrFu7WSFcd-61ZSxG46OHTyMHkKQFoTZOWgA&s=10",
    ),
    recette(
        "Mini-pizzas",
        "Apéro",
        25,
        "Facile",
        "De petites pizzas conviviales pour l'apéritif.",
        "- Pâte à pizza\n- Sauce tomate\n- Mozzarella\n- Jambon\n- Olives",
        "1. Découper la pâte.\n2. Garnir.\n3. Cuire 12 minutes à 200 °C.",
        "pizza",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_yk8QW4EHbxMZwMhrVp5CVuwZmG5xmmHX6YpueDSwXA&s=10",
    ),
    recette(
        "Œufs mimosa",
        "Entrée",
        20,
        "Facile",
        "Des œufs garnis d'une crème au jaune d'œuf.",
        "- Œufs\n- Mayonnaise\n- Moutarde\n- Ciboulette",
        "1. Cuire les œufs.\n2. Mélanger les jaunes avec la mayonnaise.\n3. Garnir les blancs.",
        "deviled eggs",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_zDnISHav1qbSHKQOdFFjcXdnCl-RlebmLh5_kt2K8g&s=10",
    ),
    recette(
        "Soupe à l'oignon",
        "Entrée",
        45,
        "Facile",
        "Une soupe réconfortante gratinée au fromage.",
        "- Oignons\n- Bouillon\n- Pain\n- Fromage râpé\n- Beurre",
        "1. Faire fondre les oignons.\n2. Ajouter le bouillon.\n3. Gratiner avec le pain et le fromage.",
        "onion soup",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdMpSfP0hUTn6jKyTh33_tLBN9jTs2FPwCXxW1-cu2rw&s=10",
    ),
    recette(
        "Salade de chèvre chaud",
        "Entrée",
        20,
        "Facile",
        "Une salade avec chèvre chaud, miel et noix.",
        "- Salade verte\n- Chèvre\n- Pain\n- Miel\n- Noix",
        "1. Griller le chèvre sur le pain.\n2. Servir sur la salade avec le miel et les noix.",
        "goat cheese salad",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9n9J3LBnKXWnguv2cmI9hOH6hLRxBKyJLzSIE2nx9NQ&s=10",
    ),
    recette(
        "Pâtes carbonara",
        "Plat",
        25,
        "Facile",
        "Des pâtes crémeuses avec lardons et parmesan.",
        "- Pâtes\n- Lardons\n- Jaunes d'œufs\n- Parmesan\n- Poivre",
        "1. Cuire les pâtes.\n2. Cuire les lardons.\n3. Mélanger avec les œufs et le parmesan hors du feu.",
        "carbonara",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcA_fv0rH9lKHiJoR8MCJqFIbYJsHIeq4eYa2-PTlrGg&s=10",
    ),
    recette(
        "Lasagnes",
        "Plat",
        75,
        "Moyen",
        "Des couches de pâtes, viande, tomate et béchamel.",
        "- Feuilles de lasagnes\n- Viande hachée\n- Sauce tomate\n- Béchamel\n- Fromage",
        "1. Préparer la viande en sauce.\n2. Alterner les couches.\n3. Cuire 40 minutes.",
        "lasagne",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD-uROnoQieSxP2P-0DbXCxn9ztOCErTn6NgU18342FA&s=10",
    ),
    recette(
        "Couscous",
        "Plat",
        90,
        "Difficile",
        "Un plat complet avec semoule, légumes et merguez.",
        "- Semoule\n- Merguez\n- Carottes\n- Courgettes\n- Navets\n- Pois chiches",
        "1. Cuire les légumes avec les épices.\n2. Préparer la semoule.\n3. Ajouter les merguez.",
        "couscous",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSebvrZRwJdYwVlmwon-i25iAg4C92dllWoPs5AdVqUTw&s=10",
    ),
    recette(
        "Poulet curry",
        "Plat",
        35,
        "Facile",
        "Du poulet mijoté dans une sauce curry au lait de coco.",
        "- Poulet\n- Oignon\n- Lait de coco\n- Curry\n- Riz",
        "1. Faire revenir le poulet et l'oignon.\n2. Ajouter curry et lait de coco.\n3. Mijoter puis servir avec du riz.",
        "chicken curry",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3KtVGJfCdY0wRjUM2JeEthwfLJ96gHtMOuz6L0RPCXg&s=10",
    ),
    recette(
        "Ratatouille",
        "Plat",
        60,
        "Facile",
        "Un mélange de légumes mijotés aux herbes.",
        "- Courgettes\n- Aubergine\n- Poivrons\n- Tomates\n- Oignon",
        "1. Couper les légumes.\n2. Les faire revenir.\n3. Mijoter avec les herbes.",
        "ratatouille",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjdcvq-cNaIT1WUDnK2lKcPFb3QU_0hkTUioYfvB74dw&s=10",
    ),
    recette(
        "Hachis parmentier",
        "Plat",
        60,
        "Moyen",
        "Une purée gratinée sur une couche de viande hachée.",
        "- Viande hachée\n- Pommes de terre\n- Oignon\n- Lait\n- Beurre\n- Fromage",
        "1. Faire la purée.\n2. Cuire la viande.\n3. Superposer puis gratiner.",
        "shepherd pie",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkITF8Oo4BjheGfB4bHYnTCLNx7BNfDF4oVDUEwKDTcg&s=10",
    ),
    recette(
        "Chili con carne",
        "Plat",
        50,
        "Moyen",
        "Un plat épicé avec viande, haricots rouges et tomates.",
        "- Viande hachée\n- Haricots rouges\n- Tomates\n- Poivron\n- Cumin\n- Paprika",
        "1. Faire revenir la viande.\n2. Ajouter épices et légumes.\n3. Ajouter tomates et haricots.\n4. Mijoter.",
        "chili con carne",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQcHtanjuDnxqyW8k3W0qtKR8-exvbim0aaGnR12lmcA&s=10",
    ),
    recette(
        "Poisson en papillote",
        "Plat",
        35,
        "Facile",
        "Un filet de poisson cuit avec légumes et citron.",
        "- Filets de poisson\n- Courgettes\n- Tomates\n- Citron\n- Huile d'olive",
        "1. Déposer poisson et légumes sur papier cuisson.\n2. Fermer la papillote.\n3. Cuire au four.",
        "baked fish",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTndVhlP9A2pd9PGfdb0S8REkHexVsi794f_4IC5P-keQ&s=10",
    ),
    recette(
        "Gratin dauphinois",
        "Plat",
        75,
        "Facile",
        "Des pommes de terre fondantes cuites dans la crème.",
        "- Pommes de terre\n- Crème\n- Lait\n- Ail\n- Muscade",
        "1. Couper les pommes de terre.\n2. Ajouter crème et lait.\n3. Cuire au four 1 heure.",
        "potato gratin",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAs87ht8ZKLFIqrKQwiazQ5EJ2LMcQpjQVJECC0VZ0DA&s=10",
    ),
    recette(
        "Risotto aux champignons",
        "Plat",
        45,
        "Moyen",
        "Un riz crémeux accompagné de champignons.",
        "- Riz arborio\n- Champignons\n- Oignon\n- Bouillon\n- Parmesan",
        "1. Faire revenir le riz.\n2. Ajouter le bouillon petit à petit.\n3. Ajouter champignons et parmesan.",
        "mushroom risotto",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeia_9_qn0yTv0EwWdIXqzaMpbWlidtUZdPO0Sx9EAow&s=10",
    ),
    recette(
        "Tacos maison",
        "Plat",
        30,
        "Facile",
        "Des tortillas garnies de viande, crudités et fromage.",
        "- Tortillas\n- Viande hachée\n- Tomate\n- Salade\n- Fromage\n- Sauce",
        "1. Cuire la viande.\n2. Couper les crudités.\n3. Garnir les tortillas.",
        "tacos",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOUcaVGR6GrUC0buxe9PH-qT2lERmYJtjvNj_CvV7r5Q&s=10",
    ),
    recette(
        "Pancakes",
        "Dessert",
        25,
        "Facile",
        "Des pancakes moelleux à servir avec des fruits.",
        "- Farine\n- Œufs\n- Lait\n- Levure\n- Sucre\n- Beurre",
        "1. Mélanger les ingrédients.\n2. Cuire des petites louches de pâte à la poêle.",
        "pancakes",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlLhWahn1bZSZ1UESNcAXCz3nmAbGDhj2Cis0fvvIFug&s=10",
    ),
    recette(
        "Tiramisu",
        "Dessert",
        30,
        "Moyen",
        "Un dessert italien au café et au mascarpone.",
        "- Mascarpone\n- Œufs\n- Sucre\n- Biscuits cuillère\n- Café\n- Cacao",
        "1. Préparer la crème.\n2. Tremper les biscuits.\n3. Alterner biscuits et crème.\n4. Réserver au frais.",
        "tiramisu",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxYhudOGqrRBABYOXPRiiTTUfeE2GdGvJXgWq2HTjbIQ&s=10",
    ),
    recette(
        "Fondant au chocolat",
        "Dessert",
        25,
        "Facile",
        "Un gâteau au chocolat avec un cœur fondant.",
        "- Chocolat\n- Beurre\n- Sucre\n- Œufs\n- Farine",
        "1. Faire fondre chocolat et beurre.\n2. Ajouter les autres ingrédients.\n3. Cuire quelques minutes au four.",
        "chocolate cake",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWr5WYslx7royG-vehLCCteFZYLxvpNFWD-Cd2DtHtdA&s=10",
    ),
    recette(
        "Tarte aux pommes",
        "Dessert",
        50,
        "Facile",
        "Une tarte classique avec des pommes fondantes.",
        "- Pâte sablée\n- Pommes\n- Sucre\n- Beurre\n- Cannelle",
        "1. Étaler la pâte.\n2. Disposer les pommes.\n3. Cuire au four.",
        "apple pie",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNwR9Rf6baz2KYutqwCZ_lHf3eXB3XKAym862h7aRHw&s=10",
    ),
    recette(
        "Cheesecake",
        "Dessert",
        60,
        "Moyen",
        "Un dessert crémeux sur une base de biscuits.",
        "- Biscuits\n- Beurre\n- Fromage frais\n- Sucre\n- Œufs\n- Citron",
        "1. Préparer la base biscuitée.\n2. Préparer la crème.\n3. Cuire puis laisser refroidir.",
        "cheesecake",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbGLz439pRNT1eLb5mu6TluRp_6V4eM8skSSROreit9Q&s=10",
    ),
    recette(
        "Panna cotta",
        "Dessert",
        20,
        "Facile",
        "Un dessert italien crémeux avec un coulis.",
        "- Crème liquide\n- Sucre\n- Vanille\n- Gélatine\n- Coulis de fruits",
        "1. Chauffer crème, sucre et vanille.\n2. Ajouter la gélatine.\n3. Réfrigérer en verrines.",
        "panna cotta",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSolvR2m3GVCWU0IVHYKzowU35zkwOY5rLbXkXvAQaHyw&s=10"
    ),
    recette(
        "Clafoutis aux cerises",
        "Dessert",
        50,
        "Facile",
        "Un gâteau moelleux aux cerises.",
        "- Cerises\n- Œufs\n- Farine\n- Sucre\n- Lait\n- Beurre",
        "1. Mettre les cerises dans un plat.\n2. Verser la pâte.\n3. Cuire au four.",
        "cherry clafoutis",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8xrV2ZOej47zKL9-fhng1LZfzhsFFh8q414WdJf9w6g&s=10",
    ),
    recette(
        "Muffins aux myrtilles",
        "Dessert",
        35,
        "Facile",
        "Des muffins moelleux aux myrtilles.",
        "- Farine\n- Sucre\n- Œufs\n- Lait\n- Beurre\n- Myrtilles\n- Levure",
        "1. Préparer la pâte.\n2. Ajouter les myrtilles.\n3. Répartir dans les moules puis cuire.",
        "blueberry muffin",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGcUSUoBA3osj7erBab6gCh7ZrY5Ptd77Ddv1jMcWlYQ&s=10",
    ),
    recette(
        "Smoothie mangue banane",
        "Boissons",
        10,
        "Très Facile",
        "Une boisson fruitée et rapide à préparer.",
        "- Mangue\n- Banane\n- Yaourt\n- Jus d'orange\n- Glaçons",
        "1. Couper les fruits.\n2. Mixer tous les ingrédients.\n3. Servir immédiatement.",
        "mango smoothie",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTipFwKayn46GiHhUndbzkgy-Vvjn_dlACm6kSwxoFSoA&s=10",
    ),
    recette(
        "Citronnade maison",
        "Boissons",
        10,
        "Très Facile",
        "Une boisson fraîche et acidulée.",
        "- Citrons\n- Eau\n- Sucre\n- Menthe\n- Glaçons",
        "1. Presser les citrons.\n2. Mélanger avec eau et sucre.\n3. Ajouter menthe et glaçons.",
        "lemonade",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQokfAxSxtaFfbP2LNVOudPcI6kbNyzMc16m8E-8JGigA&s=10",
    ),
    recette(
        "Chocolat chaud",
        "Boissons",
        10,
        "Très Facile",
        "Une boisson chaude et onctueuse au chocolat.",
        "- Lait\n- Chocolat noir\n- Sucre\n- Crème liquide",
        "1. Chauffer le lait.\n2. Faire fondre le chocolat dedans.\n3. Ajouter crème et sucre.",
        "hot chocolate",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCiPEeqMFuTFIF330CoMAQTADDomhuC5bkqzIKjg9IGQ&s=10",
    ),
]


async def seed() -> None:
    await create_db_and_tables()

    async with httpx.AsyncClient() as client:
        async for session in get_session():
            for data in items:
                image_url = data["image_url"]

                if image_url is None:
                    image_url = await get_image_url(
                        client,
                        str(data["image_search"]),
                    )

                query = select(Item).where(
                    Item.titre == data["titre"]
                )
                result = await session.exec(query)
                existing_item = result.first()

                if existing_item is None:
                    session.add(
                        Item(
                            titre=str(data["titre"]),
                            description=str(data["description"]),
                            ingredients=str(data["ingredients"]),
                            preparation=str(data["preparation"]),
                            categorie=str(data["categorie"]),
                            image_url=image_url,
                            temps_preparation=int(
                                data["temps_preparation"]
                            ),
                            difficulte=str(data["difficulte"]),
                        )
                    )
                else:
                    existing_item.description = str(data["description"])
                    existing_item.ingredients = str(
                        data["ingredients"]
                    )
                    existing_item.preparation = str(
                        data["preparation"]
                    )
                    existing_item.categorie = str(data["categorie"])
                    existing_item.image_url = image_url
                    existing_item.temps_preparation = int(
                        data["temps_preparation"]
                    )
                    existing_item.difficulte = str(data["difficulte"])
                    session.add(existing_item)

            await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())