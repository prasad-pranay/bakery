'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCategoryCarouselProps {
    productAccortion: Record<string, string>;
    autoScrollSpeed?: number;
    pauseOnHover?: boolean;
    imageHeight?: string;
    onCategoryClick?: (category: string) => void;
}

export default function ProductCategoryCarousel({
    productAccortion,
    autoScrollSpeed = 0.5,
    pauseOnHover = true,
    imageHeight = 'h-48 sm:h-56 md:h-60',
    onCategoryClick,
}: ProductCategoryCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const isHoveringRef = useRef(false);
    const isInteractingRef = useRef(false);
    const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );

    const [isPaused, setIsPaused] = useState(false);
    const [canScroll, setCanScroll] = useState(false);

    const categories = Object.entries(productAccortion);

    // Duplicate the categories for seamless infinite scrolling.
    const duplicatedCategories = [...categories, ...categories];

    const stopAnimation = useCallback(() => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    }, []);

    const resumeAutoScroll = useCallback(() => {
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }


        resumeTimeoutRef.current = setTimeout(() => {
            isInteractingRef.current = false;
            setIsPaused(false);
        }, 1800);


    }, []);

    // Smooth, continuous auto-scroll.
    useEffect(() => {
        const container = scrollRef.current;


        if (!container || categories.length <= 1) return;

        let previousTime = 0;

        const animate = (time: number) => {
            if (!previousTime) previousTime = time;

            const delta = Math.min(time - previousTime, 32);
            previousTime = time;

            const shouldPause =
                (pauseOnHover && isHoveringRef.current) ||
                isInteractingRef.current;

            if (!shouldPause && !isPaused) {
                // The first half and second half have identical content.
                const loopWidth = container.scrollWidth / 2;

                if (loopWidth > 0) {
                    container.scrollLeft +=
                        autoScrollSpeed * (delta / 16.67);

                    if (container.scrollLeft >= loopWidth) {
                        container.scrollLeft -= loopWidth;
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            stopAnimation();

            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };


    }, [
        autoScrollSpeed,
        categories.length,
        isPaused,
        pauseOnHover,
        stopAnimation,
    ]);

    // Detect whether the carousel has enough content to scroll.
    useEffect(() => {
        const container = scrollRef.current;


        if (!container) return;

        const updateScrollState = () => {
            setCanScroll(
                container.scrollWidth > container.clientWidth + 1
            );
        };

        updateScrollState();

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(container);

        return () => observer.disconnect();


    }, [categories.length]);

    // Pause auto-scroll and smoothly move in the requested direction.
    const handleNavigation = (direction: 'left' | 'right') => {
        const container = scrollRef.current;


        if (!container) return;

        isInteractingRef.current = true;
        setIsPaused(true);

        const distance = Math.max(container.clientWidth * 0.65, 220);

        const loopWidth = container.scrollWidth / 2;

        if (direction === 'right') {
            const target = container.scrollLeft + distance;

            if (loopWidth > 0 && target >= loopWidth) {
                // Normalize the position before moving to avoid a loop boundary.
                container.scrollLeft -= loopWidth;
            }
        } else if (container.scrollLeft <= 0 && loopWidth > 0) {
            // Move into the duplicate section when navigating backward.
            container.scrollLeft = loopWidth;
        }

        container.scrollBy({
            left: direction === 'right' ? distance : -distance,
            behavior: 'smooth',
        });

        resumeAutoScroll();


    };

    if (categories.length === 0) return null;

    return (<section
        className="relative my-5 w-full group/outer"
        aria-label="Product categories"
    >
        {/* Left navigation */}
        {canScroll && (
            <button
                type="button"
                onClick={() => handleNavigation('left')}
                aria-label="Scroll categories left"
                className="
absolute left-2 sm:left-3 top-1/2 z-20
-translate-y-1/2
flex h-10 w-10 sm:h-11 sm:w-11
items-center justify-center
rounded-full border border-black/5
bg-white/95 text-neutral-800
shadow-[0_4px_16px_rgba(0,0,0,0.10)]
backdrop-blur-sm
transition-all duration-200
hover:scale-105 hover:bg-white hover:shadow-lg
active:scale-95
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-neutral-500
opacity-0 group-hover/outer:opacity-100
"
            > <ChevronLeft size={21} strokeWidth={2.5} /> </button>
        )}


        {/* Scroll container */}
        <div
            ref={scrollRef}
            className="
      flex w-full items-center gap-0
      overflow-x-auto overflow-y-hidden
      py-8 sm:py-10
      scrollbar-none
      select-none
    "
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'auto',
            }}
            onMouseEnter={() => {
                isHoveringRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveringRef.current = false;
            }}
            onTouchStart={() => {
                isInteractingRef.current = true;
                setIsPaused(true);
            }}
            onTouchEnd={resumeAutoScroll}
            onWheel={() => {
                isInteractingRef.current = true;
                setIsPaused(true);
                resumeAutoScroll();
            }}
        >
            {duplicatedCategories.map(([category, image], index) => (
                <button
                    key={`${category}-${index}`}
                    type="button"
                    onClick={() => onCategoryClick?.(category)}
                    className="
          group flex shrink-0 flex-col
          items-center justify-center gap-3
          px-5 sm:px-7
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-inset
        "
                    aria-label={`Explore ${category}`}
                >
                    <div
                        className={`
            relative flex items-center justify-center
            ${imageHeight}
            overflow-hidden
          `}
                    >
                        <img
                            src={`/${image}`}
                            alt={category}
                            draggable={false}
                            loading={index < categories.length ? 'eager' : 'lazy'}
                            className="
              h-full w-full object-contain
              transition-transform duration-500 ease-out
              group-hover:scale-105
            "
                        />
                    </div>

                    <span
                        className="
            text-center text-sm sm:text-base md:text-lg
            font-title font-medium uppercase tracking-wide
            text-neutral-800
            transition-colors duration-200
            group-hover:text-neutral-500
          "
                    >
                        {category}
                    </span>
                </button>
            ))}
        </div>

        {/* Right navigation */}
        {canScroll && (
            <button
                type="button"
                onClick={() => handleNavigation('right')}
                aria-label="Scroll categories right"
                className="
        absolute right-2 sm:right-3 top-1/2 z-20
        -translate-y-1/2
        flex h-10 w-10 sm:h-11 sm:w-11
        items-center justify-center
        rounded-full border border-black/5
        bg-white/95 text-neutral-800
        shadow-[0_4px_16px_rgba(0,0,0,0.10)]
        backdrop-blur-sm
        transition-all duration-200
        hover:scale-105 hover:bg-white hover:shadow-lg
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-neutral-500
        opacity-0 group-hover/outer:opacity-100
      "
            >
                <ChevronRight size={21} strokeWidth={2.5} />
            </button>
        )}
    </section>

    );
}
