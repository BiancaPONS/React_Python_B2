import asyncio

from sqlmodel import select

from db.database import create_db_and_tables, get_session
from models.item import Item


items = [
    Item(
        titre="Roulés de jambon",
        description="Rapide et très éfficace quand l'on reçoit du monde.",
        categorie="Apéro",
        image_url=None,
        temps_preparation=5,
        difficulte="Très Facile",
    ),
    Item(
        titre="Mojito",
        description="Parfait pour régaler ses invités.",
        categorie="Boissons",
        image_url=None,
        temps_preparation=5,
        difficulte="Moyen",
    ),
    Item(
        titre="Gaspacho",
        description="Soupe froide raffraichissante, idéale pour l'été.",
        categorie="Entrée",
        image_url=None,
        temps_preparation=15,
        difficulte="Facile",
    ),
    Item(
        titre="Taboulé",
        description="Pratique pour nourrir un grand nombre de personnes.",
        categorie="Entrée",
        image_url=None,
        temps_preparation=20,
        difficulte="Facile",
    ),
    Item(
        titre="Friand au fromage",
        description="Feuilleté croustillant garni de fromage fondant.",
        categorie="Entrée",
        image_url=None,
        temps_preparation=30,
        difficulte="Facile",
    ),
    Item(
        titre="Crème jambon fromage",
        description="Entrée crémeuse associant jambon et fromage fondant.",
        categorie="Entrée",
        image_url=None,
        temps_preparation=35,
        difficulte="Facile",
    ),
    Item(
        titre="Quiche",
        description="Intemporel, elle se mange toute l'année.",
        categorie="Plat",
        image_url=None,
        temps_preparation=30,
        difficulte="Moyen",
    ),
    Item(
        titre="Boeuf Bourgignon",
        description="Plat traditionnel français mijoté au vin rouge.",
        categorie="Plat",
        image_url=None,
        temps_preparation=90,
        difficulte="Difficile",
    ),
    Item(
        titre="Ramen de boeuf",
        description="Permet de voyager en restant chez soi.",
        categorie="Plat",
        image_url=None,
        temps_preparation=45,
        difficulte="Difficile",
    ),
    Item(
        titre="Blanquette de veau",
        description="Morceaux de veau mijotés dans une sauce crémeuse.",
        categorie="Plat",
        image_url=None,
        temps_preparation=120,
        difficulte="Moyen",
    ),
    Item(
        titre="Yaglama",
        description="Galettes garnies de viande hachée et de légumes parfumés.",
        categorie="Plat",
        image_url=None,
        temps_preparation=60,
        difficulte="Moyen",
    ),
    Item(
        titre="Cookies",
        description="Biscuit débordant de pépites de chocolat.",
        categorie="Dessert",
        image_url=None,
        temps_preparation=60,
        difficulte="Moyen",
    ),
    Item(
        titre="Crêpes",
        description="A consommer sans modération, avec toutes sortes de garnitures.",
        categorie="Dessert",
        image_url=None,
        temps_preparation=60,
        difficulte="Moyen",
    ),
    Item(
        titre="Île flottante",
        description="Nuage d'oeuf sur son lac de crème anglaise",
        categorie="Dessert",
        image_url=None,
        temps_preparation=20,
        difficulte="Facile",
    ),
    Item(
        titre="Crème brulée",
        description="Crème vanillée fondante sous une fine couche de caramel croustillant..",
        categorie="Dessert",
        image_url=None,
        temps_preparation=25,
        difficulte="Facile",
    ),
    Item(
        titre="Mousse au chocolat",
        description="Mousse légère et onctueuse au chocolat noir..",
        categorie="Dessert",
        image_url=None,
        temps_preparation=20,
        difficulte="Facile",
    ),
]


async def seed() -> None:
    await create_db_and_tables()

    async for session in get_session():
        for item in items:
            query = select(Item).where(Item.titre == item.titre)
            result = await session.exec(query)
            existing_item = result.first()

            if existing_item is None:
                session.add(item)

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())