import { Accessibility, Code2, Layers3, Sparkles } from "lucide-react";

const AboutPage = () => {
  const principles = [
    { icon: Layers3, title: "Composable", text: "Small building blocks that can be combined into real interfaces." },
    { icon: Accessibility, title: "Accessible", text: "Keyboard interaction, semantic roles and clear focus behavior are treated as defaults." },
    { icon: Sparkles, title: "Delightful", text: "Motion is used to clarify interaction rather than distract from it." },
    { icon: Code2, title: "Developer friendly", text: "Typed APIs, practical examples and predictable component contracts." },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-500">About Componentra</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">A component library built for learning, experimenting and shipping faster.</h1>
        <p className="docs-muted mt-6 text-lg leading-8">
          Componentra is a React and TypeScript component library that combines reusable primitives with approachable documentation and purposeful animation. The project demonstrates how components can remain flexible while still providing sensible defaults.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {principles.map(({ icon: Icon, title, text }) => (
          <article key={title} className="home-card rounded-2xl p-6 transition-all">
            <div className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><Icon size={21} /></div>
            <h2 className="mt-5 text-xl font-semibold">{title}</h2>
            <p className="docs-muted mt-2 leading-7">{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
