import asyncio
from urllib.parse import quote

import httpx
from sqlmodel import select

from db.database import create_db_and_tables, get_session
from models.item import Item


THEMEALDB_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s="


async def get_image_url(client: httpx.AsyncClient, search_name: str) -> str | None:
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
) -> dict[str, str | int]:
    description = f"""{resume}

Ingrédients :
{ingredients}

Préparation :
{preparation}"""

    return {
        "titre": titre,
        "categorie": categorie,
        "temps_preparation": temps,
        "difficulte": difficulte,
        "description": description,
        "image_search": image_search,
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
    ),
    recette(
        "Taboulé",
        "Entrée",
        20,
        "Facile",
        "Une salade fraîche et pratique à partager.",
        "- 200 g de semoule\n- 3 tomates\n- 1 concombre\n- Menthe\n- 2 citrons\n- Huile d'olive",
        "1. Mélanger semoule et légumes coupés.\n2. Ajouter citron, huile et menthe.\n3. Laisser reposer au frais.",
        "tabbouleh",
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
    ),
    recette(
        "Crème jambon fromage",
        "Entrée",
        35,
        "Facile",
        "Une entrée chaude et crémeuse au jambon et au fromage.",
        "- Jambon\n- Crème fraîche\n- Fromage râpé\n- Échalote\n- Poivre",
        "1. Faire revenir l'échalote.\n2. Ajouter jambon et crème.\n3. Ajouter le fromage puis servir chaud.",
        "ham cheese",
    ),
    recette(
        "Quiche",
        "Plat",
        30,
        "Moyen",
        "Une quiche familiale facile à personnaliser.",
        "- 1 pâte brisée\n- 200 g de lardons\n- 3 œufs\n- 20 cl de crème\n- Fromage râpé",
        "1. Mettre la pâte dans un moule.\n2. Ajouter les lardons.\n3. Verser œufs et crème.\n4. Cuire 35 minutes à 180 °C.",
        "quiche",
    ),
    recette(
        "Bœuf bourguignon",
        "Plat",
        90,
        "Difficile",
        "Un plat mijoté traditionnel au vin rouge.",
        "- 1 kg de bœuf\n- Vin rouge\n- Carottes\n- Oignons\n- Lardons\n- Champignons",
        "1. Faire revenir le bœuf.\n2. Ajouter légumes et vin.\n3. Mijoter environ 2 heures.",
        "beef bourguignon",
    ),
    recette(
        "Ramen de bœuf",
        "Plat",
        45,
        "Difficile",
        "Un bouillon complet avec nouilles et bœuf.",
        "- Bœuf\n- Nouilles ramen\n- Bouillon\n- Œufs\n- Carotte\n- Sauce soja",
        "1. Chauffer le bouillon.\n2. Ajouter nouilles et légumes.\n3. Ajouter bœuf et œuf mollet.",
        "beef ramen",
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
    ),
    recette(
        "Salade César",
        "Entrée",
        25,
        "Facile",
        "Une salade croquante au poulet et parmesan.",
        "- Poulet\n- Salade romaine\n- Parmesan\n- Croûtons\n- Sauce César",
        "1. Cuire le poulet.\n2. Mélanger avec salade, croûtons et parmesan.\n3. Ajouter la sauce.",
        "caesar salad",
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
    ),
    recette(
        "Houmous",
        "Apéro",
        10,
        "Très Facile",
        "Une crème de pois chiches au tahini et au citron.",
        "- Pois chiches\n- Tahini\n- Citron\n- Ail\n- Huile d'olive",
        "1. Mixer tous les ingrédients.\n2. Servir avec pain ou crudités.",
        "hummus",
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
    ),
    recette(
        "Œufs mimosa",
        "Entrée",
        20,
        "Facile",
        "Des œufs garnis d'une crème au jaune d'œuf.",
        "- Œufs\n- Mayonnaise\n- Moutarde\n- Ciboulette",
        "1. Cuire les œufs.\n2. Mélanger les jaunes avec mayonnaise.\n3. Garnir les blancs.",
        "deviled eggs",
    ),
    recette(
        "Soupe à l'oignon",
        "Entrée",
        45,
        "Facile",
        "Une soupe réconfortante gratinée au fromage.",
        "- Oignons\n- Bouillon\n- Pain\n- Fromage râpé\n- Beurre",
        "1. Faire fondre les oignons.\n2. Ajouter le bouillon.\n3. Gratiner avec pain et fromage.",
        "onion soup",
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
    ),
    recette(
        "Pâtes carbonara",
        "Plat",
        25,
        "Facile",
        "Des pâtes crémeuses avec lardons et parmesan.",
        "- Pâtes\n- Lardons\n- Jaunes d'œufs\n- Parmesan\n- Poivre",
        "1. Cuire les pâtes.\n2. Cuire les lardons.\n3. Mélanger avec œufs et parmesan hors du feu.",
        "carbonara",
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
    ),
    recette(
        "Poulet curry",
        "Plat",
        35,
        "Facile",
        "Du poulet mijoté dans une sauce curry au lait de coco.",
        "- Poulet\n- Oignon\n- Lait de coco\n- Curry\n- Riz",
        "1. Faire revenir poulet et oignon.\n2. Ajouter curry et lait de coco.\n3. Mijoter puis servir avec du riz.",
        "chicken curry",
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
    ),
]


async def seed() -> None:
    await create_db_and_tables()

    async with httpx.AsyncClient() as client:
        async for session in get_session():
            for data in items:
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
                            categorie=str(data["categorie"]),
                            image_url=image_url,
                            temps_preparation=int(data["temps_preparation"]),
                            difficulte=str(data["difficulte"]),
                        )
                    )
                else:
                    existing_item.description = str(data["description"])
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