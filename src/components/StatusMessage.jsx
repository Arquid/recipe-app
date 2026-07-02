import { ChefHat } from "lucide-react";

export function LoadingIndicator({ label }) {
  return (
    <div className="rs-status">
      <div className="rs-spinner" />
      {label}
    </div>
  );
}

export function ErrorMessage({ message }) {
  if (!message) return null;
  return <div className="rs-error">{message}</div>;
}

export function EmptyState() {
  return (
    <div className="rs-empty">
      <ChefHat size={32} />
      <p>No recipes matched that search. Try different ingredients or a broader dish name.</p>
    </div>
  );
}