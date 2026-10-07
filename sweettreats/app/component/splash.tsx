"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";

const BAKERY_IMAGES = {
  cookie:
    "/hero-card.png",
  croissant:
    "/product-hero.png",
  rollingPin:
    "/crossiant.png",
};

function CookieMascot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotate: -8, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      className="relative mx-auto h-28 w-36 sm:h-32 sm:w-40"
      aria-label="A cheerful cookie mascot wearing sunglasses"
      role="img"
    >
      {/* Motion wrapper */}
      <motion.div
        animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative h-full w-full"
      >
        {/* Cookie body */}
        <div className="absolute left-1/2 top-2 h-[76px] w-[76px] -translate-x-1/2 rounded-[46%_54%_48%_52%] border-[2.5px] border-[#351A16] bg-[#F5D39B] shadow-[inset_-5px_-5px_0_rgba(121,65,31,0.09)] sm:h-[84px] sm:w-[84px]">
          {/* Chocolate chips */}
          {[
            "left-4 top-3",
            "left-9 top-6",
            "right-3 top-4",
            "left-5 bottom-4",
            "right-4 bottom-5",
            "left-1/2 top-1/2",
            "right-3 top-1/2",
          ].map((position, index) => (
            <span
              key={index}
              className={`absolute ${position} h-2 w-2 rounded-full bg-[#5A281B]`}
            />
          ))}

          {/* Sunglasses */}
          <div className="absolute left-2 top-[28px] flex gap-1">
            <span className="h-[17px] w-[25px] rounded-b-xl rounded-t-md border-2 border-[#351A16] bg-[#351A16]" />
            <span className="h-[17px] w-[25px] rounded-b-xl rounded-t-md border-2 border-[#351A16] bg-[#351A16]" />
          </div>

          {/* Sunglasses bridge */}
          <span className="absolute left-[35px] top-[32px] h-[2px] w-3 bg-[#351A16]" />
        </div>

        {/* Tiny legs */}
        <div className="absolute bottom-0 left-[42px] h-5 w-[3px] rotate-6 rounded-full bg-[#351A16]" />
        <div className="absolute bottom-0 right-[42px] h-5 w-[3px] -rotate-6 rounded-full bg-[#351A16]" />

        {/* Arms */}
        <motion.div
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute left-[11px] top-[47px] h-7 w-[3px] -rotate-[35deg] rounded-full bg-[#351A16]"
        />

        <div className="absolute right-[11px] top-[45px] h-7 w-[3px] rotate-[35deg] rounded-full bg-[#351A16]" />

        {/* Little sparkle */}
        <motion.span
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -right-1 top-1 text-2xl text-[#F36A3D]"
        >
          ✳
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function CornerIllustration({
  type,
}: {
  type: "cookie" | "croissant" | "rollingPin";
}) {
  const image = BAKERY_IMAGES[type];

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`pointer-events-none absolute z-0 ${
        type === "cookie"
          ? "-left-12 -top-10 h-48 w-48 sm:-left-14 sm:-top-12 sm:h-64 sm:w-64"
          : type === "croissant"
            ? "-bottom-10 -right-12 h-44 w-60 sm:-bottom-12 sm:-right-12 sm:h-56 sm:w-72"
            : "-bottom-12 -left-16 h-40 w-60 sm:-bottom-16 sm:-left-14 sm:h-52 sm:w-72"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          type === "cookie"
            ? "-rotate-12 rounded-[45%] bg-[#FFD91A]"
            : type === "croissant"
              ? "rotate-[-12deg] rounded-[45%] bg-[#FFD91A]"
              : "rotate-[8deg] rounded-[45%] bg-[#FFD91A]"
        }`}
      />

      <motion.img
        src={image}
        alt=""
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute h-full w-full object-cover ${
          type === "cookie"
            ? "rounded-[45%] [clip-path:circle(48%)]"
            : type === "croissant"
              ? "rounded-[45%] [clip-path:polygon(10%_0%,100%_0%,100%_100%,0%_100%)]"
              : "rounded-[45%] [clip-path:polygon(0%_15%,100%_0%,90%_100%,0%_85%)]"
        }`}
      />
    </motion.div>
  );
}

function DecorativeDoodles() {
  return (
    <>
      <motion.div
        aria-hidden="true"
        animate={{ rotate: [0, 8, 0], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute right-[8%] top-[7%] hidden rotate-[-10deg] text-right sm:block"
      >
        <p className="font-[cursive] text-xs leading-tight text-[#351A16] ">
          Good
          <br />
          Food
          <br />
          Happy Mood
        </p>
        <span className="absolute -right-3 top-0 text-xl text-[#FFD91A]">
          ✦
        </span>
        <span className="ml-20 text-3xl">⌣</span>
      </motion.div>

      <motion.span
        aria-hidden="true"
        animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-[18%] top-[43%] hidden text-4xl text-[#FFD91A] sm:block"
      >
        ✳
      </motion.span>

      <motion.span
        aria-hidden="true"
        animate={{ rotate: [0, -12, 0], y: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className="absolute bottom-[20%] left-[8%] hidden text-3xl text-[#351A16] sm:block"
      >
        ♡
      </motion.span>

      <motion.span
        aria-hidden="true"
        animate={{ rotate: [0, 12, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-[23%] right-[28%] hidden text-2xl text-[#F36A3D] sm:block"
      >
        ✦
      </motion.span>
    </>
  );
}

export default function SplashPage({exiting}:{exiting:boolean}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    let redirected = false;

    const progressTimer = window.setInterval(() => {
      value += Math.random() * 12 + 5;

      if (value >= 100) {
        value = 100;
        window.clearInterval(progressTimer);
      }

      setProgress(Math.min(100, Math.round(value)));
    }, 100);

    // const exitTimer = window.setTimeout(
    //   () => {
    //     if (redirected) return;
    //     redirected = true;
    //     setExiting(true);

    //     window.setTimeout(() => {
    //       router.replace("/home");
    //     }, reduceMotion ? 0 : 450);
    //   },
    //   reduceMotion ? 1400 : 2400,
    // );

    return () => {
      window.clearInterval(progressTimer);
    //   window.clearTimeout(exitTimer);
    };
  }, [router, reduceMotion]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.main
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[15000] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#F8F0E5] px-5 py-12 text-[#351A16]"
        >
          {/* Ambient background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_65%)]"
          />

          {/* Corner artwork */}
          <CornerIllustration type="cookie" />
          <CornerIllustration type="rollingPin" />
          <CornerIllustration type="croissant" />

          {/* Hand-drawn details */}
          <DecorativeDoodles />

          {/* Main content */}
          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
            {/* Mascot */}
            <CookieMascot />

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="mt-5"
            >
              <h1 className="text-[clamp(2.8rem,9.5vw,6.5rem)] font-black leading-[0.95] font-title tracking-[0.075em]">
                SWEETTREATS<span className="text-[#FFD91A]">.</span>
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mx-auto mt-5 h-1 w-16 origin-center rounded-full bg-[#FFD91A]"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              className="mt-5 font-text text-lg text-[#5A3027] sm:text-2xl md:text-3xl"
            >
              Freshly baked. Always a good idea.
            </motion.p>

            {/* Loading progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 w-full max-w-[230px] sm:mt-16 sm:max-w-[260px]"
            >
              <div
                role="progressbar"
                aria-label="Loading SweetTreats"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-[14px] overflow-hidden rounded-full border border-white bg-white/50 p-[2px] shadow-sm"
              >
                <motion.div
                  className="h-full rounded-full bg-[#FFD91A]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                />
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <motion.span
                  animate={reduceMotion ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-[#F36A3D]"
                />

                <p className="text-[10px] font-text font-bold uppercase tracking-[0.35em] sm:text-xs">
                  Loading...
                </p>
              </div>
            </motion.div>


          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}