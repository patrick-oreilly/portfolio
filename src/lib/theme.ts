export const THEME_STORAGE_KEY = "theme";

/** Keep in step with --paper in globals.css. */
export const THEME_COLORS = { light: "#fcfcfb", dark: "#0f1114" } as const;

export type Theme = keyof typeof THEME_COLORS;
