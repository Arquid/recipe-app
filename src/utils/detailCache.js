const KEY = "rs-detail-cache";
const MAX_ENTRIES = 30;

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

export function getCachedDetail(id) {
  return read()[id]?.detail ?? null;
}

export function setCachedDetail(id, detail) {
  const cache = read();
  cache[id] = { detail, savedAt: Date.now() };

  const ids = Object.keys(cache).sort((a, b) => cache[b].savedAt - cache[a].savedAt);
  for (const old of ids.slice(MAX_ENTRIES)) delete cache[old];

  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // storage full or unavailable, skip caching
  }
}