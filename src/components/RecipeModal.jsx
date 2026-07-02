import { X, Clock, Users } from "lucide-react";
import { stripHtml } from "../utils/text";

export default function RecipeModal({ detail, loading, error, onClose }) {
  const steps =
    detail?.analyzedInstructions?.[0]?.steps?.length
      ? detail.analyzedInstructions[0].steps
      : null;

  return (
    <div className="rs-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rs-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rs-modal-close" onClick={onClose} aria-label="Close recipe details">
          <X size={18} />
        </button>

        {loading && (
          <div className="rs-status" style={{ padding: "60px 20px" }}>
            <div className="rs-spinner" />Loading recipe…
          </div>
        )}
        {error && <div className="rs-error" style={{ margin: "20px" }}>{error}</div>}

        {detail && !loading && (
          <>
            <img src={detail.image || "https://placehold.co/640x300?text=Recipe"} alt={detail.title} />
            <div className="rs-modal-body">
              <h2 className="rs-modal-title">{detail.title}</h2>
              <div className="rs-meta-row">
                {detail.readyInMinutes && (
                  <span><Clock size={14} /> {detail.readyInMinutes} min</span>
                )}
                {detail.servings && (
                  <span><Users size={14} /> {detail.servings} servings</span>
                )}
              </div>

              <div className="rs-section-label">Ingredients</div>
              <ul className="rs-ingredients">
                {(detail.extendedIngredients || []).map((ing) => (
                  <li key={ing.id + ing.original}>{ing.original}</li>
                ))}
              </ul>

              <div className="rs-section-label">Instructions</div>
              {steps ? (
                <ol className="rs-steps">
                  {steps.map((s) => <li key={s.number}>{s.step}</li>)}
                </ol>
              ) : (
                <p className="rs-plain-instructions">
                  {detail.instructions ? stripHtml(detail.instructions) : "No instructions were provided for this recipe."}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}