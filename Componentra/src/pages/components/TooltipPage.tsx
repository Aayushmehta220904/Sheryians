import { HelpCircle, Info, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import PropsTable from "@/components/Personal/PropsTable";
import ComponentDemo from "../ComponentsDemo";

const TooltipPage = () => {
  const placementCode = `import { Tooltip } from "@/components/Tooltip/Tooltip";

<Tooltip content="Tooltip on top" placement="top">
  <button>Top</button>
</Tooltip>

<Tooltip content="Tooltip on the right" placement="right">
  <button>Right</button>
</Tooltip>

<Tooltip content="Tooltip on bottom" placement="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip content="Tooltip on the left" placement="left">
  <button>Left</button>
</Tooltip>`;

  const variantCode = `<Tooltip content="Default dark tooltip" variant="dark">
  <button>Dark</button>
</Tooltip>

<Tooltip content="Clean light tooltip" variant="light">
  <button>Light</button>
</Tooltip>

<Tooltip content="Primary information" variant="primary">
  <button>Primary</button>
</Tooltip>

<Tooltip content="Action completed" variant="success">
  <button>Success</button>
</Tooltip>`;

  const advancedCode = `<Tooltip
  content="Appears instantly and stays open while hovered"
  placement="bottom"
  delay={0}
  closeDelay={150}
  interactive
  arrow
>
  <button>Advanced tooltip</button>
</Tooltip>`;

  const propsData = [
    {
      prop: "content",
      type: "ReactNode",
      default: "-",
      description: "Content displayed inside the tooltip",
    },
    {
      prop: "children",
      type: "ReactNode",
      default: "-",
      description: "Element that triggers the tooltip",
    },
    {
      prop: "placement",
      type: '"top" | "right" | "bottom" | "left"',
      default: '"top"',
      description: "Preferred tooltip position with automatic collision flipping",
    },
    {
      prop: "variant",
      type: '"dark" | "light" | "primary" | "success" | "warning" | "danger"',
      default: '"dark"',
      description: "Visual style of the tooltip",
    },
    {
      prop: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Controls tooltip padding and text size",
    },
    {
      prop: "delay",
      type: "number",
      default: "250",
      description: "Delay in milliseconds before opening",
    },
    {
      prop: "closeDelay",
      type: "number",
      default: "80",
      description: "Delay in milliseconds before closing",
    },
    {
      prop: "offset",
      type: "number",
      default: "10",
      description: "Distance in pixels between trigger and tooltip",
    },
    {
      prop: "arrow",
      type: "boolean",
      default: "true",
      description: "Shows or hides the directional arrow",
    },
    {
      prop: "disabled",
      type: "boolean",
      default: "false",
      description: "Prevents the tooltip from opening",
    },
    {
      prop: "interactive",
      type: "boolean",
      default: "false",
      description: "Allows pointer interaction with tooltip content",
    },
    {
      prop: "open",
      type: "boolean",
      default: "-",
      description: "Controls tooltip visibility externally",
    },
    {
      prop: "defaultOpen",
      type: "boolean",
      default: "false",
      description: "Initial visibility for uncontrolled usage",
    },
    {
      prop: "onOpenChange",
      type: "(open: boolean) => void",
      default: "-",
      description: "Called whenever tooltip visibility changes",
    },
    {
      prop: "maxWidth",
      type: "number | string",
      default: "280",
      description: "Maximum tooltip width",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
            <Info size={22} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Tooltip</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          Displays contextual information when a user hovers over or focuses an
          element. The component supports placement, variants, delays, keyboard
          access and automatic viewport collision handling.
        </p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Placement</h2>
          <p className="mt-1 text-sm text-gray-500">
            Hover or focus each trigger to see the tooltip position.
          </p>
        </div>

        <ComponentDemo code={placementCode}>
          <div className="grid grid-cols-2 gap-7 sm:flex sm:flex-wrap sm:justify-center sm:gap-5">
            <Tooltip content="Tooltip on top" placement="top">
              <Button variant="outline" hoverAnimation="none" animation="none" size="sm">
                Top
              </Button>
            </Tooltip>

            <Tooltip content="Tooltip on the right" placement="right">
              <Button variant="outline" hoverAnimation="none" animation="none" size="sm">
                Right
              </Button>
            </Tooltip>

            <Tooltip content="Tooltip on bottom" placement="bottom">
              <Button variant="outline" hoverAnimation="none" animation="none" size="sm">
                Bottom
              </Button>
            </Tooltip>

            <Tooltip content="Tooltip on the left" placement="left">
              <Button variant="outline" hoverAnimation="none" animation="none" size="sm">
                Left
              </Button>
            </Tooltip>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Variants</h2>
          <p className="mt-1 text-sm text-gray-500">
            Use visual variants to match the meaning and hierarchy of your UI.
          </p>
        </div>

        <ComponentDemo code={variantCode}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Tooltip content="Default dark tooltip" variant="dark">
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                Dark
              </button>
            </Tooltip>

            <Tooltip content="Clean light tooltip" variant="light">
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50">
                Light
              </button>
            </Tooltip>

            <Tooltip content="Primary information" variant="primary">
              <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                Primary
              </button>
            </Tooltip>

            <Tooltip content="Action completed" variant="success">
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Success
              </button>
            </Tooltip>

            <Tooltip content="Requires your attention" variant="warning">
              <button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-300">
                Warning
              </button>
            </Tooltip>

            <Tooltip content="Destructive action" variant="danger">
              <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
                Danger
              </button>
            </Tooltip>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Icon tooltips</h2>
          <p className="mt-1 text-sm text-gray-500">
            Tooltips are useful for compact controls where an icon needs a clear
            accessible description.
          </p>
        </div>

        <ComponentDemo
          code={`<Tooltip content="Help and documentation"><button aria-label="Help"><HelpCircle /></button></Tooltip>`}
        >
          <div className="flex items-center justify-center gap-3">
            <Tooltip content="Help and documentation">
              <button
                aria-label="Help"
                className="grid size-10 place-items-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
              >
                <HelpCircle size={18} />
              </button>
            </Tooltip>

            <Tooltip content="Application settings" placement="bottom" variant="light">
              <button
                aria-label="Settings"
                className="grid size-10 place-items-center rounded-lg border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50"
              >
                <Settings size={18} />
              </button>
            </Tooltip>

            <Tooltip content="AI powered feature" placement="right" variant="primary">
              <button
                aria-label="AI feature"
                className="grid size-10 place-items-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-700"
              >
                <Sparkles size={18} />
              </button>
            </Tooltip>
          </div>
        </ComponentDemo>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Timing & advanced usage</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure opening delay, close delay, arrows and interactive content.
          </p>
        </div>

        <ComponentDemo code={advancedCode}>
          <div className="flex flex-wrap justify-center gap-4">
            <Tooltip content="I appear instantly" delay={0} placement="top">
              <Button variant="primary" hoverAnimation="none" animation="none" size="sm">
                No delay
              </Button>
            </Tooltip>

            <Tooltip
              content="This tooltip intentionally waits one second"
              delay={1000}
              placement="bottom"
              variant="light"
            >
              <Button variant="outline" hoverAnimation="none" animation="none" size="sm">
                1 second delay
              </Button>
            </Tooltip>

            <Tooltip
              content={
                <span>
                  <strong className="block">Interactive tooltip</strong>
                  <span className="mt-1 block font-normal opacity-80">
                    Move your pointer over this panel before it closes.
                  </span>
                </span>
              }
              placement="right"
              interactive
              closeDelay={180}
              size="lg"
              maxWidth={230}
            >
              <Button variant="dark" hoverAnimation="none" animation="none" size="sm">
                Interactive
              </Button>
            </Tooltip>

            <Tooltip content="You should not see this" disabled>
              <Button variant="ghost" hoverAnimation="none" animation="none" size="sm">
                Disabled
              </Button>
            </Tooltip>
          </div>
        </ComponentDemo>
      </section>

      <section className="rounded-xl border border-violet-100 bg-violet-50/70 p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 shrink-0 text-violet-600" size={20} />
          <div>
            <h2 className="font-semibold text-slate-900">Accessibility</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Tooltip opens on both hover and keyboard focus, exposes
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs text-violet-700">
                role=&quot;tooltip&quot;
              </code>
              and
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs text-violet-700">
                aria-describedby
              </code>
              , and can be dismissed with Escape.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Reference</h2>
        <PropsTable data={propsData} />
      </section>
    </div>
  );
};

export default TooltipPage;
