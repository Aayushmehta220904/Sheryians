import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Menu, X } from "lucide-react";
import { cn } from "@/libs/utils";
import { entranceAnimations } from "@/libs/animations/entranceAnimation";
import { hoverAnimations } from "@/libs/animations/hoverAnimation";
import gsap from "gsap";

const navbarVariants = cva(
  "relative w-full rounded-xl border transition-all",
  {
    variants: {
      variant: {
        dark: "border-slate-800 bg-slate-950 text-white",
        light: "border-slate-200 bg-white text-slate-900 shadow-sm",
        primary: "border-violet-500 bg-violet-600 text-white",
        glass:
          "border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur-xl",
      },
      size: {
        sm: "min-h-12",
        default: "min-h-16",
        lg: "min-h-20",
        xl: "min-h-24",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "default",
    },
  }
);

export interface NavbarLink {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

export interface NavbarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof navbarVariants> {
  brand?: ReactNode;
  links?: NavbarLink[];
  actions?: ReactNode;
  activeHref?: string;
  mobileBreakpointLabel?: string;
  collapseOnMobile?: boolean;
  sticky?: boolean;
  animation?: keyof typeof entranceAnimations;
  hoverAnimation?: keyof typeof hoverAnimations;
  onLinkClick?: (link: NavbarLink) => void;
}

const defaultLinks: NavbarLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      variant,
      size,
      brand = <span className="font-bold tracking-tight">Componentra</span>,
      links = defaultLinks,
      actions,
      activeHref,
      mobileBreakpointLabel = "Navigation",
      collapseOnMobile = true,
      sticky = false,
      animation = "fadeIn",
      hoverAnimation = "none",
      onLinkClick,
      ...props
    },
    ref
  ) => {
    const navbarRef = useRef<HTMLElement | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
      if (!navbarRef.current || animation === "none") return;
      entranceAnimations[animation]?.(navbarRef.current);
    }, [animation]);

    useEffect(() => {
      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMobileOpen(false);
      };

      window.addEventListener("keydown", closeOnEscape);
      return () => window.removeEventListener("keydown", closeOnEscape);
    }, []);

    const handleMouseEnter = () => {
      if (!navbarRef.current || hoverAnimation === "none") return;
      hoverAnimations[hoverAnimation]?.(navbarRef.current);
    };

    const handleMouseLeave = () => {
      if (!navbarRef.current || hoverAnimation === "none") return;
      gsap.to(navbarRef.current, {
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 0.1,
      });
    };

    const handleLinkClick = (link: NavbarLink) => {
      if (link.disabled) return;
      onLinkClick?.(link);
      setMobileOpen(false);
    };

    const linkClasses = (link: NavbarLink) =>
      cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition",
        activeHref === link.href
          ? variant === "primary"
            ? "bg-white/15 text-white"
            : variant === "dark" || variant === "glass"
              ? "bg-white/10 text-white"
              : "bg-violet-50 text-violet-700"
          : variant === "primary"
            ? "text-violet-50 hover:bg-white/10 hover:text-white"
            : variant === "dark" || variant === "glass"
              ? "text-slate-300 hover:bg-white/10 hover:text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        link.disabled && "pointer-events-none opacity-45"
      );

    return (
      <nav
        ref={(node) => {
          navbarRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn(
          navbarVariants({ variant, size }),
          sticky && "sticky top-0 z-40",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div className="flex min-h-[inherit] items-center justify-between gap-4 px-4 sm:px-5">
          <div className="min-w-0 shrink-0 text-base sm:text-lg">{brand}</div>

          <div className={cn("items-center gap-1", collapseOnMobile ? "hidden md:flex" : "flex")}>
            {links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer noopener" : undefined}
                aria-current={activeHref === link.href ? "page" : undefined}
                aria-disabled={link.disabled || undefined}
                className={linkClasses(link)}
                onClick={() => handleLinkClick(link)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions && (
              <div className={cn(collapseOnMobile && "hidden sm:flex")}>
                {actions}
              </div>
            )}

            {collapseOnMobile && (
              <button
                type="button"
                className={cn(
                  "grid size-9 place-items-center rounded-lg border transition md:hidden",
                  variant === "primary"
                    ? "border-white/25 hover:bg-white/10"
                    : variant === "dark" || variant === "glass"
                      ? "border-white/15 hover:bg-white/10"
                      : "border-slate-200 hover:bg-slate-100"
                )}
                aria-label={mobileOpen ? `Close ${mobileBreakpointLabel}` : `Open ${mobileBreakpointLabel}`}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>

        {collapseOnMobile && mobileOpen && (
          <div
            className={cn(
              "border-t px-3 py-3 md:hidden",
              variant === "primary"
                ? "border-white/20"
                : variant === "dark" || variant === "glass"
                  ? "border-white/10"
                  : "border-slate-200"
            )}
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={`mobile-${link.label}-${link.href}`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer noopener" : undefined}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  aria-disabled={link.disabled || undefined}
                  className={linkClasses(link)}
                  onClick={() => handleLinkClick(link)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {actions && <div className="mt-3 border-t border-current/10 pt-3 sm:hidden">{actions}</div>}
          </div>
        )}
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar, navbarVariants };
