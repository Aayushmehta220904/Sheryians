import {
  ArrowRight,
  GalleryHorizontal,
  Info,
  Layers3,
  MoonStar,
  MousePointerClick,
  TextCursorInput,
  CreditCard,
  Box,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toggleTheme } from "@/features/ThemeSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const featured = [
    {
      icon: Info,
      label: "Tooltip",
      note: "Smart positioning",
      action: () => navigate("/components/tooltip"),
    },
    {
      icon: GalleryHorizontal,
      label: "Carousel",
      note: "Autoplay + keyboard",
      action: () => navigate("/components/carousel"),
    },
    {
      icon: Layers3,
      label: "Layout",
      note: "Composable regions",
      action: () => navigate("/components/layout"),
    },
    {
      icon: MoonStar,
      label: "Dark mode",
      note: "Theme-aware docs",
      action: () => dispatch(toggleTheme()),
    },
  ];

  const catalog = [
    { icon: MousePointerClick, label: "Button" },
    { icon: CreditCard, label: "Card" },
    { icon: Box, label: "Modal" },
    { icon: TextCursorInput, label: "Input" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold text-violet-500"
            style={{ borderColor: "var(--border-color)" }}
          >
            React · TypeScript · GSAP
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-[-0.05em] md:text-7xl">
            Build interfaces with less friction.
          </h1>

          <p className="docs-muted mt-6 max-w-2xl text-lg leading-8">
            Componentra is a compact component library with reusable primitives,
            live documentation, accessible interactions and motion-ready APIs.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/components")}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Explore components <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/templates")}
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:text-violet-500"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--surface-color)",
              }}
            >
              View templates
            </button>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t pt-5" style={{ borderColor: "var(--border-color)" }}>
            <div>
              <strong className="text-xl">8</strong>
              <p className="docs-muted mt-1 text-xs">Documented components</p>
            </div>
            <div>
              <strong className="text-xl">2</strong>
              <p className="docs-muted mt-1 text-xs">Theme modes</p>
            </div>
            <div>
              <strong className="text-xl">100%</strong>
              <p className="docs-muted mt-1 text-xs">Typed APIs</p>
            </div>
          </div>
        </div>

        <div className="home-card rounded-3xl p-5 transition-all">
          <div
            className="flex items-center justify-between border-b pb-4"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div>
              <p className="text-sm font-semibold">Component explorer</p>
              <p className="docs-muted mt-1 text-xs">Live building blocks</p>
            </div>
            <Layers3 size={20} className="text-violet-500" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {featured.map(({ icon: Icon, label, note, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className="rounded-2xl border p-4 text-left transition hover:border-violet-400"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--surface-muted)",
                }}
              >
                <Icon size={18} className="text-violet-500" />
                <p className="mt-4 font-semibold">{label}</p>
                <p className="docs-muted mt-1 text-xs">{note}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500">
              Library
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Start with a primitive. Compose the rest.
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/components")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-500"
          >
            Browse all components <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(`/components/${label.toLowerCase()}`)}
              className="home-card rounded-2xl p-5 text-left transition-all"
            >
              <Icon size={19} className="text-violet-500" />
              <p className="mt-5 font-semibold">{label}</p>
              <p className="docs-muted mt-1 text-xs">View examples and API</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
