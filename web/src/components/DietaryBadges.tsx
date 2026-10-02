import type { Item } from "../types/api";

interface DietaryBadgesProps {
  item: Pick<Item, "sans_gluten" | "vegetarien">;
}

function DietaryBadges({ item }: DietaryBadgesProps) {
  if (!item.sans_gluten && !item.vegetarien) {
    return null;
  }

  return (
    <div
      className="recipe-details dietary-badges"
      aria-label="Caractéristiques alimentaires"
    >
      {item.sans_gluten && (
        <span className="dietary-badge">
          Sans gluten
        </span>
      )}

      {item.vegetarien && (
        <span className="dietary-badge">
          Végétarien
        </span>
      )}
    </div>
  );
}

export default DietaryBadges;