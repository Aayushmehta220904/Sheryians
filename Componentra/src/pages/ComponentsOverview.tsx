import { useNavigate } from "react-router";
import { Box, Columns3, CreditCard, GalleryHorizontal, Info, MenuSquare, MousePointerClick, TextCursorInput } from "lucide-react";

const items = [
  { name: "Button", icon: MousePointerClick, description: "Buttons with variants and motion." },
  { name: "Card", icon: CreditCard, description: "Content containers with hover effects." },
  { name: "Modal", icon: Box, description: "Overlay dialogs for focused interactions." },
  { name: "Input", icon: TextCursorInput, description: "Form controls and specialized inputs." },
  { name: "Navbar", icon: MenuSquare, description: "Navigation patterns for application shells." },
  { name: "Carousel", icon: GalleryHorizontal, description: "Accessible slides with autoplay and controls." },
  { name: "Tooltip", icon: Info, description: "Contextual information with smart positioning." },
  { name: "Layout", icon: Columns3, description: "Composable application layout regions." },
];

const ComponentsOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Componentra Library</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Components</h1>
        <p className="docs-muted mt-3 text-lg">Explore reusable React components, their variants, live previews and API references.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ name, icon: Icon, description }) => (
          <button
            key={name}
            type="button"
            onClick={() => navigate(`/components/${name.toLowerCase()}`)}
            className="home-card rounded-2xl p-5 text-left transition-all duration-200"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
              <Icon size={20} />
            </div>
            <h2 className="mt-5 text-lg font-semibold">{name}</h2>
            <p className="docs-muted mt-2 text-sm leading-6">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentsOverview;
