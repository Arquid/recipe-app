import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes, onSelectRecipe }) {
  return (
    <div className="rs-grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onSelect={onSelectRecipe} />
      ))}
    </div>
  );
}