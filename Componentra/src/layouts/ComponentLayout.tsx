import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";

const components = [
  "Button",
  "Card",
  "Modal",
  "Input",
  "Navbar",
  "Carousel",
  "Tooltip",
  "Layout",
];

const ComponentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectComponent = (item: string) => {
    navigate(`/components/${item.toLowerCase()}`);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close component navigation"
          className="fixed inset-0 z-20 bg-black/35 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`docs-sidebar fixed bottom-0 left-0 top-16 z-30 w-64 border-r p-6 transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <button type="button" onClick={() => navigate("/components")} className="font-bold">Components</button>
          <button type="button" className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={20} /></button>
        </div>
        <ul className="flex flex-col gap-1">
          {components.map((item) => {
            const active = location.pathname === `/components/${item.toLowerCase()}`;
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => selectComponent(item)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    active
                      ? "bg-violet-500/12 font-semibold text-violet-500"
                      : "docs-muted hover:translate-x-1 hover:bg-violet-500/8 hover:text-violet-500"
                  }`}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <div className="px-4 pt-4 md:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-color)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} /> Components
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ComponentLayout;
