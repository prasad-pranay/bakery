"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "./SmoothScroll";

const THUMB_HEIGHT = 70;

export default function CustomScrollbar() {
    const { lenis } = useLenis();

    const trackRef = useRef<HTMLDivElement>(null);

    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!lenis) return;

        const handleScroll = ({ progress }: { progress: number }) => {
            setProgress(progress);
        };

        lenis.on("scroll", handleScroll);

        return () => {
            lenis.off("scroll", handleScroll);
        };
    }, [lenis]);

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!trackRef.current || !lenis) return;

        event.preventDefault();

        setIsDragging(true);

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!isDragging || !trackRef.current || !lenis) return;

        const track = trackRef.current.getBoundingClientRect();

        const availableHeight = track.height - THUMB_HEIGHT;

        const y = event.clientY - track.top - THUMB_HEIGHT / 2;

        const clampedY = Math.max(
            0,
            Math.min(availableHeight, y),
        );

        const percentage =
            availableHeight > 0
                ? clampedY / availableHeight
                : 0;

        lenis.scrollTo(percentage * lenis.limit, {
            immediate: true,
        });
    };

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        setIsDragging(false);

        try {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        } catch { }
    };

    return (
        <div
            ref={trackRef}
            className="fixed right-1 top-3 bottom-3 z-9999 w-2 hidden sm:block"
        >
            {/* Track */}
            <div className="absolute inset-0 rounded-full bg-black/5" />

            {/* Thumb */}
            <div
                className={`
          absolute left-0 top-0
          w-full
          rounded-full
          bg-[#122438]
          touch-none
          select-none
          cursor-grab
          transition-[transform]
          duration-75
          ${isDragging ? "cursor-grabbing" : ""}
        `}
                style={{
                    height: THUMB_HEIGHT,
                    transform: `translateY(${progress *
                        (trackRef.current
                            ? trackRef.current.clientHeight - THUMB_HEIGHT
                            : 0)
                        }px)`,
                    transition: isDragging
                        ? "none"
                        : "transform 75ms linear",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            />
        </div>
    );
}