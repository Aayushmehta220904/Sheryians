import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

export type ThemeState = {
  mode: ThemeMode;
};

const getInitialTheme = (): ThemeMode => {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    }
  } catch {}

  return "light";
};

const initialTheme = getInitialTheme();

const initialState: ThemeState = {
  mode: initialTheme,
};

const applyTheme = (mode: ThemeMode) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute("content", mode === "dark" ? "#0f1115" : "#f6f5fb");
  }

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", mode);
    }
  } catch {}
};

applyTheme(initialTheme);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      applyTheme(state.mode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      applyTheme(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
