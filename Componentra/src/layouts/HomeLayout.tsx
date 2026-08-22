import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Personal/Navbar";

const HomeLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer
        className="border-t px-4 py-5 md:px-6"
        style={{
          borderColor: "var(--border-color)",
          background: "var(--surface-muted)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="font-semibold transition hover:text-violet-500"
          >
            Componentra
          </button>

          <span className="docs-muted">
            Reusable React components for faster interface development.
          </span>

          <span className="docs-muted">
            Enhanced by <span className="font-medium docs-soft">Aayush Mehta</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
