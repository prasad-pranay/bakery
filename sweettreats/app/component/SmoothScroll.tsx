"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { usePathname } from "next/navigation";
import Lenis from "lenis";

type LenisContextType = {
  lenis: Lenis | null;
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
});

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Create Lenis once
  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true,
      prevent: (node) =>
        !!node.closest("[data-lenis-prevent]"),
    });

    setLenis(instance);

    let rafId: number;

    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Reset scroll whenever route changes
  useEffect(() => {
    if (!lenis) return;

    lenis.stop();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    lenis.scrollTo(0, {
      immediate: true,
    });

    requestAnimationFrame(() => {
      lenis.resize();
      lenis.start();
    });
  }, [pathname, lenis]);

  // Automatically update Lenis when page dimensions change
  useEffect(() => {
    if (!lenis) return;

    let timeout: ReturnType<typeof setTimeout>;

    const resize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        lenis.resize();
      }, 50);
    };

    const observer = new ResizeObserver(resize);

    observer.observe(document.documentElement);
    observer.observe(document.body);

    window.addEventListener("resize", resize);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [lenis]);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}

// "use client";

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     type ReactNode,
// } from "react";
// import { usePathname } from "next/navigation";
// import Lenis from "lenis";

// type LenisContextType = {
//     lenis: Lenis | null;
// };

// const LenisContext = createContext<LenisContextType>({
//     lenis: null,
// });

// export function useLenis() {
//     return useContext(LenisContext);
// }

// export default function SmoothScroll({
//     children,
// }: {
//     children: ReactNode;
// }) {
//     const pathname = usePathname();
//     const [lenis, setLenis] = useState<Lenis | null>(null);

//     // Create Lenis once
//     useEffect(() => {
//         const instance = new Lenis({
//             duration: 1.2,
//             smoothWheel: true,
//             syncTouch: true,
//             prevent: (node) =>
//                 !!node.closest("[data-lenis-prevent]"),
//         });

//         setLenis(instance);

//         let rafId: number;

//         const raf = (time: number) => {
//             instance.raf(time);
//             rafId = requestAnimationFrame(raf);
//         };

//         rafId = requestAnimationFrame(raf);

//         return () => {
//             cancelAnimationFrame(rafId);
//             instance.destroy();
//             setLenis(null);
//         };
//     }, []);

//     // Reset scroll whenever route changes
//     useEffect(() => {
//         if (!lenis) return;

//         // Stop any current Lenis animation
//         lenis.stop();

//         // Reset the actual browser scroll position
//         window.scrollTo({
//             top: 0,
//             left: 0,
//             behavior: "instant",
//         });

//         // Reset Lenis' internal scroll position
//         lenis.scrollTo(0, {
//             immediate: true,
//         });

//         // Recalculate dimensions after the new page renders
//         requestAnimationFrame(() => {
//             lenis.resize();
//             lenis.start();
//         });
//     }, [pathname, lenis]);

//     return (
//         <LenisContext.Provider value={{ lenis }}>
//             {children}
//         </LenisContext.Provider>
//     );
// }
