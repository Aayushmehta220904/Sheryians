import { useState } from "react";
import { Github, Sparkles } from "lucide-react";
import { Navbar, type NavbarLink } from "@/components/navbar";
import ComponentDemo from "../ComponentsDemo";
import PropsTable from "@/components/Personal/PropsTable";

const links: NavbarLink[] = [
  { label: "Home", href: "#home" },
  { label: "Docs", href: "#docs" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
];

const NavbarPage = () => {
  const [activeHref, setActiveHref] = useState("#home");

  const usageCode = `import { Navbar } from "@/components/navbar";

const links = [
  { label: "Home", href: "#home" },
  { label: "Docs", href: "#docs" },
  { label: "Examples", href: "#examples" },
];

<Navbar
  brand={<strong>Acme</strong>}
  links={links}
  actions={<button>Get started</button>}
/>`;

  const variantsCode = `<Navbar variant="light" links={links} />
<Navbar variant="dark" links={links} />
<Navbar variant="primary" links={links} />
<Navbar variant="glass" links={links} />`;

  const activeCode = `<Navbar
  links={links}
  activeHref="#docs"
  onLinkClick={(link) => console.log(link)}
/>`;

  const propsData = [
    { prop: "brand", type: "ReactNode", default: '"Componentra"', description: "Brand, logo or custom identity rendered at the start of the navbar." },
    { prop: "links", type: "NavbarLink[]", default: "Default links", description: "Navigation items with label, href, external and disabled support." },
    { prop: "actions", type: "ReactNode", default: "-", description: "Optional call-to-action content rendered at the end of the navbar." },
    { prop: "activeHref", type: "string", default: "-", description: "Marks the matching link as the current page." },
    { prop: "variant", type: '"light" | "dark" | "primary" | "glass"', default: '"light"', description: "Visual style of the navbar surface." },
    { prop: "size", type: '"sm" | "default" | "lg" | "xl"', default: '"default"', description: "Controls the navbar minimum height." },
    { prop: "collapseOnMobile", type: "boolean", default: "true", description: "Collapses links into a keyboard-accessible mobile menu." },
    { prop: "sticky", type: "boolean", default: "false", description: "Pins the navbar to the top of its scroll container." },
    { prop: "animation", type: "EntranceAnimation", default: '"fadeIn"', description: "Entrance animation applied when the component mounts." },
    { prop: "hoverAnimation", type: "HoverAnimation", default: '"none"', description: "Optional animation applied to the navbar on hover." },
    { prop: "onLinkClick", type: "(link: NavbarLink) => void", default: "-", description: "Callback invoked when a navigation item is selected." },
  ];

  const action = (
    <a
      href="#navbar-api"
      className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
    >
      Get started
    </a>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-4 md:p-6">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
            <Sparkles size={21} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Navbar</h1>
        </div>
        <p className="docs-muted max-w-2xl text-lg leading-8">
          A reusable responsive navigation shell with custom branding, links,
          actions, active states, variants and a built-in mobile menu.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Complete navigation</h2>
          <p className="docs-muted mt-1 text-sm">
            Resize the viewport to see the links collapse into the mobile menu.
          </p>
        </div>
        <ComponentDemo code={usageCode}>
          <div className="w-full max-w-4xl">
            <Navbar
              animation="none"
              hoverAnimation="none"
              brand={
                <span className="inline-flex items-center gap-2 font-bold">
                  <span className="grid size-7 place-items-center rounded-lg bg-violet-600 text-xs text-white">C</span>
                  Componentra
                </span>
              }
              links={links}
              activeHref={activeHref}
              onLinkClick={(link) => setActiveHref(link.href)}
              actions={action}
            />
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Variants</h2>
          <p className="docs-muted mt-1 text-sm">
            The same navigation API can be placed on light, dark, branded or translucent surfaces.
          </p>
        </div>
        <ComponentDemo code={variantsCode}>
          <div className="flex w-full max-w-4xl flex-col gap-4">
            <Navbar animation="none" hoverAnimation="none" size="sm" variant="light" links={links.slice(0, 3)} brand="Light" />
            <Navbar animation="none" hoverAnimation="none" size="sm" variant="dark" links={links.slice(0, 3)} brand="Dark" />
            <Navbar animation="none" hoverAnimation="none" size="sm" variant="primary" links={links.slice(0, 3)} brand="Primary" />
            <div className="rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-fuchsia-600 p-3">
              <Navbar animation="none" hoverAnimation="none" size="sm" variant="glass" links={links.slice(0, 3)} brand="Glass" />
            </div>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Custom actions and active state</h2>
          <p className="docs-muted mt-1 text-sm">
            Brand, links and end actions are all composable instead of being hard-coded into the component.
          </p>
        </div>
        <ComponentDemo code={activeCode}>
          <div className="w-full max-w-4xl">
            <Navbar
              animation="none"
              hoverAnimation="none"
              variant="dark"
              links={links}
              activeHref="#docs"
              brand={<span className="font-bold">Developer Hub</span>}
              actions={
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  <Github size={15} /> GitHub
                </a>
              }
            />
          </div>
        </ComponentDemo>
      </section>

      <section id="navbar-api" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <PropsTable data={propsData} />
      </section>
    </div>
  );
};

export default NavbarPage;
