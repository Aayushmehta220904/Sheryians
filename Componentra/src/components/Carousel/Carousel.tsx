import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/libs/utils";

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  index?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  transitionDuration?: number;
  ariaLabel?: string;
}

const Carousel = ({
  children,
  index,
  initialIndex = 0,
  onIndexChange,
  loop = true,
  autoplay = false,
  interval = 3500,
  pauseOnHover = true,
  showControls = true,
  showIndicators = true,
  transitionDuration = 450,
  ariaLabel = "Carousel",
  className,
  ...props
}: CarouselProps) => {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const [internalIndex, setInternalIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0))
  );
  const [hovered, setHovered] = useState(false);

  const controlled = typeof index === "number";
  const activeIndex = controlled
    ? Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0))
    : internalIndex;

  const updateIndex = useCallback(
    (next: number) => {
      if (slides.length === 0) return;

      let resolved = next;
      if (loop) {
        resolved = (next + slides.length) % slides.length;
      } else {
        resolved = Math.min(Math.max(next, 0), slides.length - 1);
      }

      if (!controlled) setInternalIndex(resolved);
      onIndexChange?.(resolved);
    },
    [controlled, loop, onIndexChange, slides.length]
  );

  const previous = useCallback(
    () => updateIndex(activeIndex - 1),
    [activeIndex, updateIndex]
  );

  const next = useCallback(
    () => updateIndex(activeIndex + 1),
    [activeIndex, updateIndex]
  );

  useEffect(() => {
    if (!autoplay || slides.length <= 1 || (pauseOnHover && hovered)) return;
    const timer = window.setInterval(next, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, hovered, interval, next, pauseOnHover, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className={cn("relative w-full", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex ease-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transitionProperty: "transform",
            transitionDuration: `${transitionDuration}ms`,
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slides.length}`}
              aria-hidden={slideIndex !== activeIndex}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showControls && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={previous}
            disabled={!loop && activeIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-white/40 bg-black/55 text-white shadow-lg backdrop-blur transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            disabled={!loop && activeIndex === slides.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full border border-white/40 bg-black/55 text-white shadow-lg backdrop-blur transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showIndicators && slides.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-3 py-2 backdrop-blur"
          role="tablist"
          aria-label="Choose slide"
        >
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-selected={slideIndex === activeIndex}
              role="tab"
              onClick={() => updateIndex(slideIndex)}
              className={`h-2 rounded-full transition-all duration-300 ${
                slideIndex === activeIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/55 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Carousel };
