import { ArrowRight, BarChart3, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

const templates = [
  { icon: LayoutDashboard, title: "SaaS Dashboard", description: "A dashboard shell using Layout, Cards, Buttons and Tooltips.", components: ["Layout", "Card", "Tooltip"] },
  { icon: ShoppingBag, title: "Commerce UI", description: "A product-focused surface built from Cards, Carousel and Buttons.", components: ["Carousel", "Card", "Button"] },
  { icon: BarChart3, title: "Analytics Workspace", description: "A data workspace pattern with navigation, forms and contextual help.", components: ["Navbar", "Input", "Tooltip"] },
];

const TemplatesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-500">Templates</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Patterns built from the same components.</h1>
        <p className="docs-muted mt-5 text-lg leading-8">Use these compositions as starting points for your own screens. Each template points back to the reusable components that make it work.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {templates.map(({ icon: Icon, title, description, components }) => (
          <article key={title} className="home-card rounded-2xl p-6 transition-all">
            <div className="grid size-12 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><Icon size={23} /></div>
            <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
            <p className="docs-muted mt-3 min-h-16 leading-7">{description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {components.map((component) => (
                <button
                  key={component}
                  type="button"
                  onClick={() => navigate(`/components/${component.toLowerCase()}`)}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:text-violet-500"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {component}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate(`/components/${components[0].toLowerCase()}`)}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-500"
            >
              Explore building blocks <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
