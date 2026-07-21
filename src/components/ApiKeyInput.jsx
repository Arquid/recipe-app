import { KeyRound } from "lucide-react";

export default function ApiKeyInput({ value, onChange, remember, onRememberChange }) {
  return (
    <div className="rs-key-row">
      <KeyRound size={16} />
      <input
        type="password"
        placeholder="Paste your Spoonacular API key"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Spoonacular API key"
      />
      <label className="rs-remember">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => onRememberChange(e.target.checked)}
        />
        Remember on this device
      </label>
      <a href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">
        Get a free API key
      </a>
    </div>
  );
}
