import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/Store.tsx";
import { setTheme, type ThemeMode } from "./features/ThemeSlice.tsx";

let savedTheme: ThemeMode = "light";

try {
  savedTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
} catch {
  savedTheme = "light";
}

store.dispatch(setTheme(savedTheme));

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
