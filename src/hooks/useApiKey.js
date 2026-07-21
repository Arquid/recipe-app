import { useEffect, useState } from "react";

const STORAGE_KEY = "rs-api-key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [remember, setRemember] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);

  useEffect(() => {
    if (remember) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [apiKey, remember]);

  return { apiKey, setApiKey, remember, setRemember };
}
