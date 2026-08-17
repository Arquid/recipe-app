import { useEffect, useRef, useState } from "react";
import { X, Clock, Users, Printer, Share2 } from "lucide-react";
import { stripHtml } from "../utils/text";

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function RecipeModal({ detail, loading, error, onClose }) {
  const [shareStatus, setShareStatus] = useState("idle");
  const modalRef = useRef(null);

  const steps =
    detail?.analyzedInstructions?.[0]?.steps?.length
      ? detail.analyzedInstructions[0].steps
      : null;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    modalRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = modalRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  async function handleShare() {
    const url = detail?.sourceUrl || detail?.spoonacularSourceUrl;
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({ title: detail.title, url });
      } catch {
        // user closed the share sheet — nothing to do
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    } finally {
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  }

  const shareLabel =
    shareStatus === "copied" ? "Link copied!" : shareStatus === "error" ? "Couldn't copy" : "Share";

  return (
    <div className="rs-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rs-modal" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
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

              <div className="rs-modal-actions">
                <button type="button" className="rs-modal-action" onClick={() => window.print()}>
                  <Printer size={14} /> Print
                </button>
                {(detail.sourceUrl || detail.spoonacularSourceUrl) && (
                  <button
                    type="button"
                    className={`rs-modal-action${shareStatus === "error" ? " rs-modal-action-error" : ""}`}
                    onClick={handleShare}
                  >
                    <Share2 size={14} /> {shareLabel}
                  </button>
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
