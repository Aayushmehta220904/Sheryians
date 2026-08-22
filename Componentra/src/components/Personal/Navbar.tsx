import { toggleTheme } from "@/features/ThemeSlice";
import {
  ChevronDown,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import type { RootState } from "@/store/Store";

const componentNames = [
  "Button",
  "Card",
  "Modal",
  "Input",
  "Navbar",
  "Carousel",
  "Tooltip",
  "Layout",
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const shortcutLabel = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘ K" : "Ctrl K";

  const filteredComponents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return componentNames;
    return componentNames.filter((name) =>
      name.toLowerCase().includes(normalized)
    );
  }, [query]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setComponentsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node)
      ) {
        setComponentsOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
        return;
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setComponentsOpen(false);
        setMobileOpen(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  const goToComponent = (name: string) => {
    setQuery("");
    setSearchOpen(false);
    setComponentsOpen(false);
    setMobileOpen(false);
    navigate(`/components/${name.toLowerCase()}`);
  };

  const goTo = (path: string) => {
    setMobileOpen(false);
    setComponentsOpen(false);
    navigate(path);
  };

  const navItemClass = (path: string) =>
    `rounded-lg px-2.5 py-2 text-sm font-medium transition ${
      location.pathname === path ||
      (path === "/components" && location.pathname.startsWith("/components"))
        ? "bg-violet-500/10 text-violet-500"
        : "docs-muted hover:bg-violet-500/8 hover:text-violet-500"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 h-16 w-full border-b px-4 md:px-6"
      style={{
        background: "color-mix(in srgb, var(--bg-color) 90%, transparent)",
        borderColor: "var(--border-color)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 4px 24px var(--nav-shadow)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3">
        <button
          type="button"
          onClick={() => goTo("/")}
          className="mr-1 flex shrink-0 items-center gap-2 rounded-lg text-left"
          aria-label="Componentra home"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-sm font-black text-white shadow-sm">
            C
          </span>
          <span className="text-xl font-bold tracking-tight">
            Component<span className="text-violet-500">ra</span>
          </span>
        </button>

        <div ref={searchRef} className="relative ml-2 hidden min-w-0 flex-1 sm:block sm:max-w-40 md:max-w-32 lg:max-w-56 xl:max-w-72">
          <div className="nav-search flex w-full items-center rounded-xl px-3 py-2">
            <Search size={17} className="docs-muted shrink-0" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && filteredComponents[0]) {
                  goToComponent(filteredComponents[0]);
                }
                if (event.key === "Escape") setSearchOpen(false);
              }}
              type="search"
              placeholder="Search components..."
              className="ml-2 w-full bg-transparent text-sm outline-none"
              aria-label="Search components"
            />
            <kbd className="docs-muted hidden rounded-md border px-1.5 py-0.5 text-[10px] lg:inline" style={{ borderColor: "var(--border-color)" }}>
              {shortcutLabel}
            </kbd>
          </div>

          {searchOpen && (
            <div className="nav-search-results absolute left-0 top-[calc(100%+8px)] w-full overflow-hidden rounded-xl p-1">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToComponent(name)}
                    className="nav-search-result flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm"
                  >
                    <span>{name}</span>
                    <span className="docs-muted text-xs">Component</span>
                  </button>
                ))
              ) : (
                <p className="docs-muted px-3 py-2 text-sm">
                  No components found.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <div ref={desktopMenuRef} className="relative">
            <button
              type="button"
              className={navItemClass("/components")}
              aria-expanded={componentsOpen}
              aria-haspopup="menu"
              onClick={() => setComponentsOpen((open) => !open)}
            >
              <span className="inline-flex items-center gap-1.5">
                Components
                <ChevronDown
                  size={15}
                  className={`transition-transform ${componentsOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {componentsOpen && (
              <div
                role="menu"
                className="nav-search-results absolute right-0 top-[calc(100%+8px)] w-72 rounded-2xl p-2"
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <div>
                    <p className="text-sm font-semibold">Components</p>
                    <p className="docs-muted mt-0.5 text-xs">
                      Browse all {componentNames.length} primitives
                    </p>
                  </div>
                  <LayoutGrid size={18} className="text-violet-500" />
                </div>

                <div className="mt-1 grid grid-cols-2 gap-1">
                  {componentNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="menuitem"
                      onClick={() => goToComponent(name)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                        location.pathname === `/components/${name.toLowerCase()}`
                          ? "bg-violet-500/10 font-semibold text-violet-500"
                          : "docs-muted hover:bg-violet-500/8 hover:text-violet-500"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goTo("/components")}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-left text-xs font-semibold text-violet-500 transition hover:bg-violet-500/8"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  View component overview →
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => goTo("/templates")}
            className={navItemClass("/templates")}
          >
            Templates
          </button>

          <button
            type="button"
            onClick={() => goTo("/about")}
            className={navItemClass("/about")}
          >
            About
          </button>

          <button
            type="button"
            aria-label={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="ml-1 grid size-9 place-items-center rounded-full border transition hover:bg-violet-500/10"
            style={{ borderColor: "var(--border-color)" }}
            onClick={() => dispatch(toggleTheme())}
          >
            {mode === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="docs-muted" />
            )}
          </button>

          <button
            type="button"
            onClick={() => goTo("/components/tooltip")}
            className="ml-1 hidden rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 lg:inline-flex"
          >
            Tooltip docs
          </button>
        </div>

        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-lg border md:hidden"
          style={{ borderColor: "var(--border-color)" }}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-panel absolute left-0 right-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b p-4 shadow-xl md:hidden">
          <div className="mx-auto max-w-7xl">
            <div className="nav-search flex items-center rounded-xl px-3 py-2 sm:hidden">
              <Search size={17} className="docs-muted shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search components..."
                className="ml-2 w-full bg-transparent text-sm outline-none"
                aria-label="Search components"
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {(query.trim() ? filteredComponents : componentNames).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => goToComponent(name)}
                  className="rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition hover:border-violet-400 hover:text-violet-500"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="my-4 border-t" style={{ borderColor: "var(--border-color)" }} />

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => goTo("/components")}
                className="rounded-lg px-3 py-3 text-left font-medium hover:bg-violet-500/10"
              >
                Components overview
              </button>
              <button
                type="button"
                onClick={() => goTo("/templates")}
                className="rounded-lg px-3 py-3 text-left font-medium hover:bg-violet-500/10"
              >
                Templates
              </button>
              <button
                type="button"
                onClick={() => goTo("/about")}
                className="rounded-lg px-3 py-3 text-left font-medium hover:bg-violet-500/10"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-left font-medium hover:bg-violet-500/10"
              >
                {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {mode === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
