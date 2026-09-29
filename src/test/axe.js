import { axe as runAxe } from "vitest-axe";

// jsdom can't reliably compute rendered colors, so color-contrast checks are
// disabled here to avoid noisy false results in this environment.
export function axe(container) {
  return runAxe(container, {
    rules: { "color-contrast": { enabled: false } },
  });
}
