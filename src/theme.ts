export type ThemeMode = "light" | "dark" | "amoled";

export type AccentColor = "violet" | "cyan" | "emerald" | "rose" | "amber";
export type GalaxyWallpaper =
  | "nebula-violet"
  | "andromeda-blue"
  | "cosmic-dust"
  | "supercluster"
  | "starlit-horizon"
  | "planetary-dawn"
  | "orbital-night"
  | "red-giant-sky"
  | "neon-purple"
  | "magenta-bloom"
  | "violet-aurora"
  | "cyan-pop";

export interface ThemePreferences {
  mode: ThemeMode;
  accent: AccentColor;
  wallpaper: GalaxyWallpaper;
}

type AccentPalette = {
  primary: string;
  primaryHover: string;
  accentSoft: string;
  ring: string;
};

const DEFAULT_THEME: ThemePreferences = {
  mode: "dark",
  accent: "violet",
  wallpaper: "nebula-violet",
};

const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  violet: {
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    accentSoft: "#a78bfa",
    ring: "#8b5cf6",
  },
  cyan: {
    primary: "#06b6d4",
    primaryHover: "#0891b2",
    accentSoft: "#67e8f9",
    ring: "#06b6d4",
  },
  emerald: {
    primary: "#10b981",
    primaryHover: "#059669",
    accentSoft: "#6ee7b7",
    ring: "#10b981",
  },
  rose: {
    primary: "#f43f5e",
    primaryHover: "#e11d48",
    accentSoft: "#fda4af",
    ring: "#f43f5e",
  },
  amber: {
    primary: "#f59e0b",
    primaryHover: "#d97706",
    accentSoft: "#fcd34d",
    ring: "#f59e0b",
  },
};

const STORAGE_PREFIX = "themePrefs";

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "amoled";
}

function isAccentColor(value: unknown): value is AccentColor {
  return (
    value === "violet" ||
    value === "cyan" ||
    value === "emerald" ||
    value === "rose" ||
    value === "amber"
  );
}

function isGalaxyWallpaper(value: unknown): value is GalaxyWallpaper {
  return (
    value === "nebula-violet" ||
    value === "andromeda-blue" ||
    value === "cosmic-dust" ||
    value === "supercluster" ||
    value === "starlit-horizon" ||
    value === "planetary-dawn" ||
    value === "orbital-night" ||
    value === "red-giant-sky" ||
    value === "neon-purple" ||
    value === "magenta-bloom" ||
    value === "violet-aurora" ||
    value === "cyan-pop"
  );
}

function normalizeThemePreferences(value: unknown): ThemePreferences {
  const maybe = value as Partial<ThemePreferences> | null;
  if (!maybe || typeof maybe !== "object") {
    return DEFAULT_THEME;
  }

  return {
    mode: isThemeMode(maybe.mode) ? maybe.mode : DEFAULT_THEME.mode,
    accent: isAccentColor(maybe.accent) ? maybe.accent : DEFAULT_THEME.accent,
    wallpaper: isGalaxyWallpaper(maybe.wallpaper)
      ? maybe.wallpaper
      : DEFAULT_THEME.wallpaper,
  };
}

const GALAXY_WALLPAPERS: Record<GalaxyWallpaper, string> = {
  "nebula-violet":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/c/cf/A_%27wallpaper%27_of_distant_galaxies_is_a_stunning_backdrop_for_a_runaway_galaxy_%28heic0206a%29.jpg\")",
  "andromeda-blue":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/9/99/Center_of_the_Milky_Way_Galaxy_II_%E2%80%93_Hubble_%28Visible%29.jpg\")",
  "cosmic-dust":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/a/a0/Orion_Nebula_%28Hubble_Space_Telescope%29.jpg\")",
  supercluster:
    "url(\"https://upload.wikimedia.org/wikipedia/commons/1/11/Hubble%E2%80%99s_Hidden_Galaxy_%2834939152954%29.jpg\")",
  "starlit-horizon":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/7/71/The_Great_Orion_Nebula_%28M42%29.jpg\")",
  "planetary-dawn":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/4/43/Galactic.jpg\")",
  "orbital-night":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/9/99/Center_of_the_Milky_Way_Galaxy_II_%E2%80%93_Hubble_%28Visible%29.jpg\")",
  "red-giant-sky":
    "url(\"https://upload.wikimedia.org/wikipedia/commons/a/a0/Orion_Nebula_%28Hubble_Space_Telescope%29.jpg\")",
  "neon-purple":
    "radial-gradient(900px 520px at 15% 10%, rgba(196, 72, 255, 0.92), transparent 62%), radial-gradient(1100px 620px at 86% 92%, rgba(107, 66, 255, 0.88), transparent 64%), linear-gradient(140deg, #18002f 0%, #2f0f6d 52%, #0f0328 100%)",
  "magenta-bloom":
    "radial-gradient(980px 560px at 80% 12%, rgba(255, 77, 170, 0.92), transparent 60%), radial-gradient(860px 500px at 15% 82%, rgba(255, 130, 230, 0.85), transparent 64%), linear-gradient(150deg, #29001f 0%, #5a0f4b 52%, #1c0424 100%)",
  "violet-aurora":
    "radial-gradient(960px 560px at 12% 18%, rgba(165, 90, 255, 0.9), transparent 58%), radial-gradient(900px 500px at 88% 80%, rgba(98, 51, 255, 0.85), transparent 64%), linear-gradient(145deg, #100020 0%, #341168 52%, #0a011a 100%)",
  "cyan-pop":
    "radial-gradient(950px 540px at 20% 18%, rgba(55, 224, 255, 0.9), transparent 60%), radial-gradient(980px 560px at 84% 86%, rgba(34, 128, 255, 0.86), transparent 62%), linear-gradient(145deg, #001a2f 0%, #0a3b73 50%, #001126 100%)",
};

export function getThemeStorageKey(userKey?: string | number | null): string {
  return userKey ? `${STORAGE_PREFIX}:${userKey}` : `${STORAGE_PREFIX}:guest`;
}

export function loadThemePreferences(
  userKey?: string | number | null,
): ThemePreferences {
  const key = getThemeStorageKey(userKey);
  const stored = localStorage.getItem(key);
  if (!stored) {
    return DEFAULT_THEME;
  }

  try {
    return normalizeThemePreferences(JSON.parse(stored));
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveThemePreferences(
  preferences: ThemePreferences,
  userKey?: string | number | null,
): void {
  const key = getThemeStorageKey(userKey);
  localStorage.setItem(key, JSON.stringify(preferences));
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : clean;
  const parsed = Number.parseInt(normalized, 16);

  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

export function applyThemePreferences(preferences: ThemePreferences): void {
  const root = document.documentElement;
  const palette = ACCENT_PALETTES[preferences.accent];
  const [r, g, b] = hexToRgb(palette.primary);
  const wallpaper = GALAXY_WALLPAPERS[preferences.wallpaper];

  root.setAttribute("data-theme", preferences.mode);
  root.classList.toggle("dark", preferences.mode !== "light");

  root.style.setProperty("--primary", palette.primary);
  root.style.setProperty("--primary-hover", palette.primaryHover);
  root.style.setProperty("--accent", palette.accentSoft);
  root.style.setProperty("--ring", palette.ring);
  root.style.setProperty("--sidebar-primary", palette.primary);
  root.style.setProperty("--sidebar-ring", palette.ring);
  root.style.setProperty("--border", `rgba(${r}, ${g}, ${b}, 0.28)`);
  root.style.setProperty("--input", `rgba(${r}, ${g}, ${b}, 0.36)`);
  root.style.setProperty("--app-wallpaper", wallpaper);
}

export const ACCENT_OPTIONS: Array<{ value: AccentColor; label: string }> = [
  { value: "violet", label: "Violet" },
  { value: "cyan", label: "Cyan" },
  { value: "emerald", label: "Emerald" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
];

export const MODE_OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "amoled", label: "AMOLED" },
];

export const WALLPAPER_OPTIONS: Array<{
  value: GalaxyWallpaper;
  label: string;
}> = [
  { value: "nebula-violet", label: "Nebula Violet" },
  { value: "andromeda-blue", label: "Andromeda Blue" },
  { value: "cosmic-dust", label: "Cosmic Dust" },
  { value: "supercluster", label: "Supercluster" },
  { value: "starlit-horizon", label: "Starlit Horizon" },
  { value: "planetary-dawn", label: "Planetary Dawn" },
  { value: "orbital-night", label: "Orbital Night" },
  { value: "red-giant-sky", label: "Red Giant Sky" },
  { value: "neon-purple", label: "Neon Purple" },
  { value: "magenta-bloom", label: "Magenta Bloom" },
  { value: "violet-aurora", label: "Violet Aurora" },
  { value: "cyan-pop", label: "Cyan Pop" },
];
