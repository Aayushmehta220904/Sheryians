import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/libs/utils";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarWidth?: number | string;
  stickyHeader?: boolean;
  bordered?: boolean;
  minHeight?: number | string;
  contentClassName?: string;
  sidebarClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const toCssSize = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

const Layout = ({
  header,
  sidebar,
  footer,
  children,
  sidebarPosition = "left",
  sidebarWidth = 240,
  stickyHeader = false,
  bordered = true,
  minHeight = 360,
  className,
  contentClassName,
  sidebarClassName,
  headerClassName,
  footerClassName,
  style,
  ...props
}: LayoutProps) => {
  const width = toCssSize(sidebarWidth);
  const shellStyle: CSSProperties = {
    minHeight: toCssSize(minHeight),
    ...style,
  };

  const mainArea = (
    <main className={cn("min-w-0 flex-1 p-5", contentClassName)}>
      {children}
    </main>
  );

  const sideArea = sidebar ? (
    <aside
      className={cn(
        "shrink-0 p-4",
        bordered && sidebarPosition === "left" && "border-r",
        bordered && sidebarPosition === "right" && "border-l",
        sidebarClassName
      )}
      style={{ width, borderColor: "var(--border-color)" }}
    >
      {sidebar}
    </aside>
  ) : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        bordered && "border",
        className
      )}
      style={{
        ...shellStyle,
        background: "var(--surface-color)",
        borderColor: "var(--border-color)",
        color: "var(--text-color)",
      }}
      {...props}
    >
      {header && (
        <header
          className={cn(
            "z-10 px-5 py-4",
            bordered && "border-b",
            stickyHeader && "sticky top-0",
            headerClassName
          )}
          style={{
            background: "var(--surface-color)",
            borderColor: "var(--border-color)",
          }}
        >
          {header}
        </header>
      )}

      <div className="flex min-h-0 flex-1">
        {sidebarPosition === "left" && sideArea}
        {mainArea}
        {sidebarPosition === "right" && sideArea}
      </div>

      {footer && (
        <footer
          className={cn(
            "px-5 py-3",
            bordered && "border-t",
            footerClassName
          )}
          style={{ borderColor: "var(--border-color)" }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
};

export { Layout };
