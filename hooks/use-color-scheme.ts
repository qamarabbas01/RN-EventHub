import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type Scheme = "light" | "dark";
type SchemePreference = Scheme | "system";

type ColorSchemeContextValue = {
  /** The current, resolved scheme (system or user override). */
  colorScheme: Scheme;
  /** The user's explicit preference. */
  preference: SchemePreference;
  setPreference: (pref: SchemePreference) => void;
  toggle: () => void;
};

const STORAGE_KEY = "eventhub:colorSchemePreference";

const ColorSchemeContext = React.createContext<ColorSchemeContextValue | null>(
  null,
);

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const systemScheme = useSystemColorScheme() === "dark" ? "dark" : "light";
  const [preference, setPreferenceState] =
    React.useState<SchemePreference>("system");
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      } finally {
        if (!cancelled) setHasLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = React.useCallback((pref: SchemePreference) => {
    setPreferenceState(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => {});
  }, []);

  const colorScheme: Scheme =
    preference === "system" ? systemScheme : preference;

  const toggle = React.useCallback(() => {
    setPreference(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, setPreference]);

  const value = React.useMemo<ColorSchemeContextValue>(
    () => ({
      colorScheme,
      preference,
      setPreference,
      toggle,
    }),
    [colorScheme, preference, setPreference, toggle],
  );

  // Avoid a flash on first render by sticking to light until storage is loaded.
  if (!hasLoaded) {
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
      children,
    );
  }

  return React.createElement(ColorSchemeContext.Provider, { value }, children);
}

/** Returns the resolved color scheme (`light`/`dark`). */
export function useColorScheme(): Scheme {
  const ctx = React.useContext(ColorSchemeContext);
  if (ctx) return ctx.colorScheme;
  return useSystemColorScheme() === "dark" ? "dark" : "light";
}

export function useColorSchemePreference(): {
  preference: SchemePreference;
  setPreference: (pref: SchemePreference) => void;
  toggle: () => void;
} {
  const ctx = React.useContext(ColorSchemeContext);
  if (!ctx) {
    return {
      preference: "system",
      setPreference: () => {},
      toggle: () => {},
    };
  }
  return {
    preference: ctx.preference,
    setPreference: ctx.setPreference,
    toggle: ctx.toggle,
  };
}
