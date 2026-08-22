import { Layout } from "@/components/Layout/Layout";
import PropsTable from "@/components/Personal/PropsTable";
import ComponentDemo from "../ComponentsDemo";

const LayoutPage = () => {
  const usageCode = `import { Layout } from "@/components/Layout";

<Layout
  header={<strong>Workspace</strong>}
  sidebar={<nav>...</nav>}
  footer={<span>Updated just now</span>}
  sidebarWidth={190}
>
  <main>Your content</main>
</Layout>`;

  const rightSidebarCode = `<Layout
  header="Analytics"
  sidebarPosition="right"
  sidebar={<aside>Filters</aside>}
>
  Dashboard content
</Layout>`;

  const propsData = [
    { prop: "header", type: "ReactNode", default: "-", description: "Optional content rendered in the top header region." },
    { prop: "sidebar", type: "ReactNode", default: "-", description: "Optional sidebar content." },
    { prop: "footer", type: "ReactNode", default: "-", description: "Optional footer region." },
    { prop: "children", type: "ReactNode", default: "-", description: "Primary layout content." },
    { prop: "sidebarPosition", type: '"left" | "right"', default: '"left"', description: "Places the sidebar on either side of the content." },
    { prop: "sidebarWidth", type: "number | string", default: "240", description: "Controls the sidebar width." },
    { prop: "stickyHeader", type: "boolean", default: "false", description: "Keeps the header pinned within the layout shell." },
    { prop: "bordered", type: "boolean", default: "true", description: "Shows the outer and region separators." },
    { prop: "minHeight", type: "number | string", default: "360", description: "Sets a minimum height for the layout shell." },
  ];

  const sideNavigation = (
    <div className="space-y-2 text-sm">
      <p className="font-semibold">Workspace</p>
      {["Overview", "Projects", "Team", "Settings"].map((item, index) => (
        <div
          key={item}
          className={`rounded-lg px-3 py-2 ${index === 0 ? "bg-violet-600 text-white" : "docs-muted"}`}
        >
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Layout</h1>
        <p className="docs-muted text-lg max-w-2xl">
          A flexible application shell for composing headers, sidebars, content
          areas and footers without rebuilding structural markup each time.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Application shell</h2>
        <ComponentDemo code={usageCode}>
          <div className="w-full max-w-3xl">
            <Layout
              header={
                <div className="flex items-center justify-between">
                  <strong>Acme Workspace</strong>
                  <span className="docs-muted text-xs">Live</span>
                </div>
              }
              sidebar={sideNavigation}
              footer={<span className="docs-muted text-xs">Componentra layout primitive</span>}
              sidebarWidth={190}
              minHeight={390}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {["Revenue", "Users", "Conversion", "Retention"].map((metric, index) => (
                  <article
                    key={metric}
                    className="rounded-xl border p-4"
                    style={{ background: "var(--surface-muted)", borderColor: "var(--border-color)" }}
                  >
                    <p className="docs-muted text-xs">{metric}</p>
                    <strong className="mt-2 block text-2xl">{["₹82K", "12.4K", "8.7%", "74%"][index]}</strong>
                  </article>
                ))}
              </div>
              <div
                className="mt-4 h-36 rounded-xl border"
                style={{
                  borderColor: "var(--border-color)",
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 12%, var(--surface-color)), var(--surface-muted))",
                }}
              />
            </Layout>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Right sidebar</h2>
        <ComponentDemo code={rightSidebarCode}>
          <div className="w-full max-w-3xl">
            <Layout
              header={<strong>Analytics</strong>}
              sidebarPosition="right"
              sidebar={
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Filters</p>
                  <button className="w-full rounded-lg border px-3 py-2 text-left text-sm" style={{ borderColor: "var(--border-color)" }}>Last 30 days</button>
                  <button className="w-full rounded-lg border px-3 py-2 text-left text-sm" style={{ borderColor: "var(--border-color)" }}>All channels</button>
                </div>
              }
              sidebarWidth={180}
              minHeight={280}
            >
              <div className="h-full rounded-xl border p-5" style={{ borderColor: "var(--border-color)", background: "var(--surface-muted)" }}>
                <p className="docs-muted text-sm">Primary dashboard content stays flexible while the sidebar moves to the right.</p>
              </div>
            </Layout>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <PropsTable data={propsData} />
      </section>
    </div>
  );
};

export default LayoutPage;
