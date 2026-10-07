"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Cookie, Loader2, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function LogoutPage() {
  const router = useRouter();
  const {user,admin} = useAuthStore()

        if(!user && !admin){
            router.replace("/")
            return
        }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to logout");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 850);
    } catch (error) {
      console.error("Logout failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while logging out."
      );
      setLoading(false);
    }
  };

  

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-32 h-56 w-56 rounded-full bg-[#ffd21f]/20 blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-[#2d8c57]/10 blur-3xl"
        animate={{ x: [0, -16, 0], y: [0, 14, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px] lg:gap-14">
          <motion.section
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative max-w-2xl">
              <motion.div
                initial={{ rotate: -8, scale: 0.7, opacity: 0 }}
                animate={{ rotate: -4, scale: 1, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6, type: "spring" }}
                className="absolute -right-4 top-0 rounded-full bg-[#2d8c57] px-4 py-2 text-xs font-black uppercase tracking-wide text-white"
              >
                see you soon!
              </motion.div>

              <h1 className="text-[clamp(5rem,9vw,9.5rem)] font-title uppercase leading-[0.78] tracking-[0.075em]">
                GOOD
                <br />
                THINGS
                <br />
                <span className="relative inline-block">
                  TAKE
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
                    className="absolute -bottom-3 left-0 h-3 w-full origin-left rounded-full bg-[#ffd21f]"
                  />
                </span>
                <br />
                TIME.
              </h1>

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-3 right-20 hidden h-24 w-24 items-center justify-center rounded-[35%] bg-[#ffd21f] lg:flex"
              >
                <Cookie size={48} strokeWidth={1.7} />
              </motion.div>

              {/* <p className="mt-10 max-w-md text-base font-medium leading-7 opacity-65">
                Taking a little break? No worries. Your favourite treats will be right here when you come back.
              </p> */}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-[2.25rem] border border-[var(--foreground)]/10 bg-white p-6 shadow-[0_20px_70px_rgba(58,25,18,0.09)] sm:p-9">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffd21f]" />

              <div className="relative z-10">
                <motion.div
                  initial={{ rotate: -12, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 14 }}
                  className="mb-7 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[#3b1b16] text-[#ffd21f] shadow-sm"
                >
                  <LogOut size={27} strokeWidth={2.2} />
                </motion.div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="success" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-3">
                      <motion.div
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 250 }}
                        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d8c57] text-white"
                      >
                        <Check size={28} strokeWidth={3} />
                      </motion.div>
                      <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">ALL DONE!</h2>
                      <p className="mt-4 text-sm leading-6 opacity-60">You&apos;ve been safely logged out. See you next time!</p>
                    </motion.div>
                  ) : (
                    <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 className="text-4xl font-title uppercase leading-[0.88] tracking-[0.055em] sm:text-5xl">
                        READY
                        <br />
                        TO LOG
                        <br />
                        OUT?
                      </h1>
                      <p className="mt-5 max-w-sm font-text text-sm leading-6 opacity-60 sm:text-base">
                        You&apos;ll be signed out of your account on this device. Your sweet treats will still be waiting for you when you return.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} className="mt-6 overflow-hidden">
                      <div className="rounded-2xl font-text border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700">{error}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!success && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 space-y-3">
                    <motion.button
                      type="button"
                      onClick={handleLogout}
                      disabled={loading}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="group font-text flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#ffd21f] px-5 text-sm font-black uppercase tracking-wide text-[#3b1b16] shadow-[0_7px_0_#d7aa00] transition-shadow hover:shadow-[0_4px_0_#d7aa00] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                    >
                      {loading ? <><Loader2 size={18} className="animate-spin" /> Logging out...</> : <><LogOut size={18} /> Yes, log me out</>}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => router.back()}
                      disabled={loading}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2  font-text rounded-full border-2 border-[#3b1b16]/15 px-5 text-sm font-black uppercase tracking-wide transition-colors hover:bg-[#3b1b16]/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1 " /> Keep me here
                    </motion.button>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
