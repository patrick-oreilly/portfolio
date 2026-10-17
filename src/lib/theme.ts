export const THEME_STORAGE_KEY = "theme";

/** Keep in step with --paper in globals.css. */
export const THEME_COLORS = { light: "#fcfcfb", dark: "#0f1114" } as const;

export type Theme = keyof typeof THEME_COLORS;

export function getCurrentTheme(): Theme {
  const stored = document.documentElement.dataset.theme;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(next: Theme): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // storage can be blocked; the theme still applies for this page view
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[next]);
}
