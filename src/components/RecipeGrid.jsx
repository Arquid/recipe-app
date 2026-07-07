import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes, onSelectRecipe, isFavorite, onToggleFavorite }) {
  return (
    <div className="rs-grid">
      {recipes.map((r) => (
        <RecipeCard
          key={r.id}
          recipe={r}
          onSelect={onSelectRecipe}
          isFavorite={isFavorite(r.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
