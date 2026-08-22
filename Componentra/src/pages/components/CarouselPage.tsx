import { Carousel } from "@/components/Carousel/Carousel";
import PropsTable from "@/components/Personal/PropsTable";
import ComponentDemo from "../ComponentsDemo";

const slides = [
  { title: "Build faster", body: "Composable components for product teams.", accent: "from-violet-500 to-violet-600" },
  { title: "Stay consistent", body: "A shared visual language across your interface.", accent: "from-cyan-500 to-blue-600" },
  { title: "Ship confidently", body: "Accessible interactions and sensible defaults.", accent: "from-emerald-500 to-teal-600" },
];

const CarouselPage = () => {
  const usageCode = `import { Carousel } from "@/components/Carousel";

<Carousel autoplay interval={3200}>
  <div className="h-72">Slide one</div>
  <div className="h-72">Slide two</div>
  <div className="h-72">Slide three</div>
</Carousel>`;

  const simpleCode = `<Carousel loop={false} showIndicators>
  <div>First slide</div>
  <div>Second slide</div>
  <div>Third slide</div>
</Carousel>`;

  const propsData = [
    { prop: "children", type: "ReactNode", default: "-", description: "The slides rendered inside the carousel." },
    { prop: "index", type: "number", default: "-", description: "Controlled active slide index." },
    { prop: "initialIndex", type: "number", default: "0", description: "Initial slide for uncontrolled usage." },
    { prop: "onIndexChange", type: "(index: number) => void", default: "-", description: "Runs whenever the active slide changes." },
    { prop: "loop", type: "boolean", default: "true", description: "Wraps navigation from the last slide to the first and vice versa." },
    { prop: "autoplay", type: "boolean", default: "false", description: "Automatically advances slides." },
    { prop: "interval", type: "number", default: "3500", description: "Autoplay delay in milliseconds." },
    { prop: "pauseOnHover", type: "boolean", default: "true", description: "Pauses autoplay while the pointer is over the carousel." },
    { prop: "showControls", type: "boolean", default: "true", description: "Shows previous and next buttons." },
    { prop: "showIndicators", type: "boolean", default: "true", description: "Shows clickable slide indicators." },
    { prop: "transitionDuration", type: "number", default: "450", description: "Slide transition duration in milliseconds." },
    { prop: "ariaLabel", type: "string", default: '"Carousel"', description: "Accessible label for the carousel region." },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Carousel</h1>
        <p className="docs-muted text-lg max-w-2xl">
          A responsive, keyboard-accessible carousel with controls, indicators,
          controlled state, looping and optional autoplay.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Autoplay carousel</h2>
          <p className="docs-muted mt-1 text-sm">Hover to pause. Use the arrow keys when the carousel is focused.</p>
        </div>
        <ComponentDemo code={usageCode}>
          <div className="w-full max-w-2xl">
            <Carousel autoplay interval={3200} ariaLabel="Componentra feature highlights">
              {slides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`h-72 bg-gradient-to-br ${slide.accent} p-8 text-white flex flex-col justify-end`}
                >
                  <span className="text-sm font-medium text-white/75">0{index + 1} / 03</span>
                  <h3 className="mt-2 text-3xl font-bold">{slide.title}</h3>
                  <p className="mt-2 max-w-md text-white/85">{slide.body}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Non-looping navigation</h2>
        <ComponentDemo code={simpleCode}>
          <div className="w-full max-w-xl">
            <Carousel loop={false} autoplay={false}>
              {["Design", "Develop", "Deliver"].map((label, index) => (
                <div
                  key={label}
                  className="h-56 grid place-items-center"
                  style={{ background: "var(--surface-color)", border: "1px solid var(--border-color)" }}
                >
                  <div className="text-center">
                    <span className="docs-muted text-xs uppercase tracking-[0.24em]">Stage {index + 1}</span>
                    <h3 className="mt-2 text-3xl font-bold">{label}</h3>
                  </div>
                </div>
              ))}
            </Carousel>
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

export default CarouselPage;
