import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/libs/utils";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";
export type TooltipVariant =
  | "dark"
  | "light"
  | "primary"
  | "success"
  | "warning"
  | "danger";
export type TooltipSize = "sm" | "md" | "lg";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  delay?: number;
  closeDelay?: number;
  offset?: number;
  arrow?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  tooltipClassName?: string;
  maxWidth?: number | string;
}

interface Position {
  top: number;
  left: number;
  placement: TooltipPlacement;
}

const variantClasses: Record<TooltipVariant, string> = {
  dark: "bg-slate-950 text-white border-slate-800",
  light: "bg-white text-slate-900 border-slate-200 shadow-lg",
  primary: "bg-violet-600 text-white border-violet-500",
  success: "bg-emerald-600 text-white border-emerald-500",
  warning: "bg-amber-400 text-amber-950 border-amber-300",
  danger: "bg-rose-600 text-white border-rose-500",
};

const sizeClasses: Record<TooltipSize, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-sm",
};

const arrowVariantClasses: Record<TooltipVariant, string> = {
  dark: "bg-slate-950 border-slate-800",
  light: "bg-white border-slate-200",
  primary: "bg-violet-600 border-violet-500",
  success: "bg-emerald-600 border-emerald-500",
  warning: "bg-amber-400 border-amber-300",
  danger: "bg-rose-600 border-rose-500",
};

const oppositePlacement: Record<TooltipPlacement, TooltipPlacement> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};

const Tooltip = ({
  children,
  content,
  placement = "top",
  variant = "dark",
  size = "md",
  delay = 250,
  closeDelay = 80,
  offset = 10,
  arrow = true,
  disabled = false,
  interactive = false,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  tooltipClassName,
  maxWidth = 280,
}: TooltipProps) => {
  const generatedId = useId();
  const tooltipId = `componentra-tooltip-${generatedId.replace(/:/g, "")}`;
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    placement,
  });
  const [positioned, setPositioned] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updateOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const scheduleOpen = useCallback(() => {
    if (disabled) return;
    clearCloseTimer();
    clearOpenTimer();
    if (delay <= 0) {
      updateOpen(true);
      return;
    }
    openTimerRef.current = window.setTimeout(() => {
      updateOpen(true);
      openTimerRef.current = null;
    }, delay);
  }, [clearCloseTimer, clearOpenTimer, delay, disabled, updateOpen]);

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    if (closeDelay <= 0) {
      updateOpen(false);
      return;
    }
    closeTimerRef.current = window.setTimeout(() => {
      updateOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  }, [clearCloseTimer, clearOpenTimer, closeDelay, updateOpen]);

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const collisionPadding = 8;

    const getCoordinates = (candidate: TooltipPlacement) => {
      switch (candidate) {
        case "bottom":
          return {
            top: triggerRect.bottom + offset,
            left:
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
          };
        case "left":
          return {
            top:
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
            left: triggerRect.left - tooltipRect.width - offset,
          };
        case "right":
          return {
            top:
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
            left: triggerRect.right + offset,
          };
        case "top":
        default:
          return {
            top: triggerRect.top - tooltipRect.height - offset,
            left:
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
          };
      }
    };

    const fits = (candidate: TooltipPlacement) => {
      const coordinates = getCoordinates(candidate);
      return (
        coordinates.left >= collisionPadding &&
        coordinates.top >= collisionPadding &&
        coordinates.left + tooltipRect.width <=
          viewportWidth - collisionPadding &&
        coordinates.top + tooltipRect.height <=
          viewportHeight - collisionPadding
      );
    };

    let resolvedPlacement = placement;
    if (!fits(resolvedPlacement) && fits(oppositePlacement[resolvedPlacement])) {
      resolvedPlacement = oppositePlacement[resolvedPlacement];
    }

    const coordinates = getCoordinates(resolvedPlacement);
    const left = Math.min(
      Math.max(coordinates.left, collisionPadding),
      viewportWidth - tooltipRect.width - collisionPadding
    );
    const top = Math.min(
      Math.max(coordinates.top, collisionPadding),
      viewportHeight - tooltipRect.height - collisionPadding
    );

    setPosition({ top, left, placement: resolvedPlacement });
    setPositioned(true);
  }, [offset, placement]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPositioned(false);
      return;
    }

    calculatePosition();
    const frame = window.requestAnimationFrame(calculatePosition);
    return () => window.cancelAnimationFrame(frame);
  }, [calculatePosition, content, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const update = () => calculatePosition();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;

    if (triggerRef.current) resizeObserver?.observe(triggerRef.current);
    if (tooltipRef.current) resizeObserver?.observe(tooltipRef.current);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      resizeObserver?.disconnect();
    };
  }, [calculatePosition, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") updateOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, updateOpen]);

  useEffect(
    () => () => {
      clearOpenTimer();
      clearCloseTimer();
    },
    [clearCloseTimer, clearOpenTimer]
  );

  useEffect(() => {
    if (disabled && isOpen) updateOpen(false);
  }, [disabled, isOpen, updateOpen]);

  const arrowClasses: Record<TooltipPlacement, string> = {
    top: "left-1/2 top-full -translate-x-1/2 -translate-y-1/2",
    bottom: "left-1/2 bottom-full -translate-x-1/2 translate-y-1/2",
    left: "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "right-full top-1/2 translate-x-1/2 -translate-y-1/2",
  };

  const tooltip =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            onMouseEnter={interactive ? clearCloseTimer : undefined}
            onMouseLeave={interactive ? scheduleClose : undefined}
            className={cn(
              "fixed z-[9999] rounded-md border font-medium leading-snug shadow-sm",
              "transition-[opacity,transform] duration-150 ease-out",
              variantClasses[variant],
              sizeClasses[size],
              interactive ? "pointer-events-auto" : "pointer-events-none",
              positioned ? "opacity-100 scale-100" : "opacity-0 scale-95",
              tooltipClassName
            )}
            style={{
              top: position.top,
              left: position.left,
              maxWidth,
            }}
          >
            {content}
            {arrow && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute size-2 rotate-45 border",
                  arrowVariantClasses[variant],
                  arrowClasses[position.placement]
                )}
              />
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex", className)}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        {children}
      </span>
      {tooltip}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export { Tooltip };
