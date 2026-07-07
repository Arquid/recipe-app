import { Heart } from "lucide-react";
import { stripHtml, truncate } from "../utils/text";

export default function RecipeCard({ recipe, onSelect, isFavorite, onToggleFavorite }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(recipe.id);
    }
  }

  return (
    <div
      className="rs-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(recipe.id)}
      onKeyDown={handleKeyDown}
      aria-haspopup="dialog"
    >
      <div className="rs-card-img-wrap">
        <img
          src={recipe.image || "https://placehold.co/400x300?text=Recipe"}
          alt={recipe.title}
          loading="lazy"
        />
        {recipe.cuisines?.[0] && <span className="rs-tab">{recipe.cuisines[0]}</span>}
        <button
          type="button"
          className={`rs-favorite${isFavorite ? " rs-favorite-active" : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe);
          }}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="rs-card-body">
        <h3 className="rs-card-title">{recipe.title}</h3>
        <p className="rs-card-desc">
          {recipe.summary ? truncate(stripHtml(recipe.summary)) : "Tap to see ingredients and instructions."}
        </p>
      </div>
    </div>
  );
}
