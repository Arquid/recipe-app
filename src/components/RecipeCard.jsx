import { stripHtml, truncate } from "../utils/text";

export default function RecipeCard({ recipe, onSelect }) {
  return (
    <button className="rs-card" onClick={() => onSelect(recipe.id)} aria-haspopup="dialog">
      <div className="rs-card-img-wrap">
        <img
          src={recipe.image || "https://placehold.co/400x300?text=Recipe"}
          alt={recipe.title}
          loading="lazy"
        />
        {recipe.cuisines?.[0] && <span className="rs-tab">{recipe.cuisines[0]}</span>}
      </div>
      <div className="rs-card-body">
        <h3 className="rs-card-title">{recipe.title}</h3>
        <p className="rs-card-desc">
          {recipe.summary ? truncate(stripHtml(recipe.summary)) : "Tap to see ingredients and instructions."}
        </p>
      </div>
    </button>
  );
}