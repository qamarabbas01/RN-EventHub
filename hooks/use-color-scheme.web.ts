import React from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
type Scheme = "light" | "dark";
type SchemePreference = Scheme | "system";

type ColorSchemeContextValue = {
  colorScheme: Scheme;
  preference: SchemePreference;
  setPreference: (pref: SchemePreference) => void;
  toggle: () => void;
};

const STORAGE_KEY = "eventhub:colorSchemePreference";
const ColorSchemeContext = React.createContext<ColorSchemeContextValue | null>(null);

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const systemScheme = useRNColorScheme() === "dark" ? "dark" : "light";
  const [hasHydrated, setHasHydrated] = React.useState(false);
  const [preference, setPreferenceState] = React.useState<SchemePreference>("system");

  React.useEffect(() => {
    setHasHydrated(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreferenceState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setPreference = React.useCallback((pref: SchemePreference) => {
    setPreferenceState(pref);
    try {
      window.localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // ignore
    }
  }, []);

  const colorScheme: Scheme = preference === "system" ? systemScheme : preference;
  const toggle = React.useCallback(() => {
    setPreference(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setPreference]);

  const value = React.useMemo<ColorSchemeContextValue>(
    () => ({ colorScheme, preference, setPreference, toggle }),
    [colorScheme, preference, setPreference, toggle]
  );

  // Keep static rendering consistent.
  if (!hasHydrated) {
    return React.createElement(
      ColorSchemeContext.Provider,
      {
        value: {
          colorScheme: "light",
          preference: "system",
          setPreference,
          toggle,
        },
      },
      children
    );
  }

  return React.createElement(ColorSchemeContext.Provider, { value }, children);
}

export function useColorScheme(): Scheme {
  const ctx = React.useContext(ColorSchemeContext);
  if (ctx) return ctx.colorScheme;
  return useRNColorScheme() === "dark" ? "dark" : "light";
}

export function useColorSchemePreference(): {
  preference: SchemePreference;
  setPreference: (pref: SchemePreference) => void;
  toggle: () => void;
} {
  const ctx = React.useContext(ColorSchemeContext);
  if (!ctx) {
    return { preference: "system", setPreference: () => {}, toggle: () => {} };
  }
  return { preference: ctx.preference, setPreference: ctx.setPreference, toggle: ctx.toggle };
}
