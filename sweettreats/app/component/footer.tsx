"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Cat, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useState } from "react";

const SOCIAL_LINKS = [
    {
        name: "Instagram",
        href: "https://instagram.com/",
        icon: Cat,
    },
    {
        name: "X",
        href: "https://x.com/",
        icon: X,
    },
    {
        name: "Facebook",
        href: "https://facebook.com/",
        icon: MessageCircle,
    },
    {
        name: "YouTube",
        href: "https://youtube.com/",
        icon: Cat,
    },
];

export default function Footer() {

    const [adminShow,setAdminShow] = useState(false)
    return (
        <>
        <AnimatePresence>
  {adminShow && (
    <motion.div
    data-lenis-prevent
      className="fixed inset-0 z-[11000] overflow-scroll sidebar-none overscroll-contain flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close admin login"
        className="absolute inset-0 cursor-default bg-black/10 backdrop-blur-sm"
        onClick={() => setAdminShow(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) =>  {
          e.preventDefault();
          // handle login here
          const formData = new FormData(e.currentTarget);

            const userId = formData.get("userId") as string;
            const password = formData.get("password") as string;

            const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/admin/login",{
                credentials:"include",
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username:userId, 
                    password:password
                })
            })

            const data = await (await response).json()
            if(data.success){
                window.location.reload()
            }else{
                alert(data.message)
            }



        }}
        className="
          relative z-10 w-full max-w-sm
          rounded-xl border border-black/10
          bg-[var(--background)]
          p-7 sm:p-8
          shadow-[0_20px_70px_rgba(0,0,0,0.12)]
        "
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.97 }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Header */}
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-black/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-black/50">
              Restricted
            </span>

            <button
              type="button"
              onClick={() => setAdminShow(false)}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full text-lg text-black/40
                transition hover:bg-black/[0.05] hover:text-black
              "
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Admin access
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-black/50">
            Enter your credentials to continue.
          </p>
        </div>

        {/* User ID */}
        <div className="mb-5">
          <label
            htmlFor="admin-user"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            User ID
          </label>

          <input
            id="admin-user"
            name="userId"
            type="text"
            autoComplete="username"
            required
            className="
              h-11 w-full rounded-lg
              border border-black/10
              bg-white/50 px-3.5
              text-sm outline-none
              transition
              placeholder:text-black/30
              hover:border-black/20
              focus:border-black/30
              focus:bg-white
              focus:ring-4 focus:ring-black/[0.04]
            "
            placeholder="Enter your user ID"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-medium text-black/75"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="
                h-11 w-full rounded-lg
                border border-black/10
                bg-white/50 px-3.5 pr-12
                text-sm outline-none
                transition
                placeholder:text-black/30
                hover:border-black/20
                focus:border-black/30
                focus:bg-white
                focus:ring-4 focus:ring-black/[0.04]
              "
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={(e) => {
                const input = document.getElementById(
                  "admin-password"
                ) as HTMLInputElement;

                input.type =
                  input.type === "password" ? "text" : "password";

                e.currentTarget.textContent =
                  input.type === "password" ? "Show" : "Hide";
              }}
              className="
                absolute right-2 top-1/2
                -translate-y-1/2
                rounded-md px-2 py-1
                text-xs font-medium text-black/40
                transition hover:bg-black/[0.05] hover:text-black
              "
            >
              Show
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
            group flex h-11 w-full items-center justify-center
            gap-2 rounded-lg
            bg-[var(--foreground)]
            px-4 text-sm font-medium text-[var(--background)]
            transition-all duration-200
            hover:-translate-y-0.5
            hover:shadow-lg
            active:translate-y-0
          "
        >
          <span>Continue</span>

          <span
            className="
              transition-transform duration-200
              group-hover:translate-x-1
            "
          >
            →
          </span>
        </button>
      </motion.form>
    </motion.div>
  )}
</AnimatePresence>
            <footer className="relative overflow-hidden bg-[#351A16] text-[#FCF9F4] rounded-b-[32px">

                {/* Top wavy border */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 28"
                    preserveAspectRatio="none"
                    className="absolute left-0 top-0 h-4 w-full text-[#fff] sm:h-5"
                >
                    <path
                        d="M0 0H1440V8C1320 23 1200 0 1080 8S840 22 720 8 480 22 360 8 120 22 0 8Z"
                        fill="#fff"
                    />
                </svg>

                <div className="grid gap-8 px-6 pb-7 pt-10 sm:px-9 sm:pt-12 lg:grid-cols-[1.2fr_0.7fr_0.8fr_1.25fr] lg:gap-8 lg:px-10 xl:px-12">

                    {/* Brand */}
                    <div>
                        <p onClick={()=>setAdminShow(true)} className="uppercase font-title text-3xl tracking-wider">Sweetreats<span className="text-[#FF6E31]">.</span></p>

                        <p className="mt-3 max-w-[220px] font-text text-[11px] leading-5 text-white/65">
                            Handcrafted treats, baked with love.
                        </p>

                        <div className="mt-5 flex font-text items-center gap-2 text-[10px] text-white/45">
                            <HeartIcon />
                            Made for cookie lovers.
                        </div>
                    </div>

                    {/* Quick links */}
                    <FooterColumn title="Quick Links">
                        <FooterLink href="/">Home</FooterLink>
                        <FooterLink href="/about">About Us</FooterLink>
                        <FooterLink href="/contact">Contact</FooterLink>
                        <FooterLink href="#faqs">FAQ</FooterLink>
                    </FooterColumn>

                    {/* Treats */}
                    <FooterColumn title="Our Treats">
                        <FooterLink href="/cake">Cake</FooterLink>
                        <FooterLink href="/cookies">Cookies</FooterLink>
                        <FooterLink href="/bakery">Pastries</FooterLink>
                        <FooterLink href="/products">Croissant</FooterLink>
                        <FooterLink href="/products">Bagel</FooterLink>
                    </FooterColumn>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xs font-title tracking-wider">
                            Stay Connected
                        </h3>


                        <NewsletterForm />

                        <div className="mt-2 flex items-center">
                            <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none" className="size-10 cursor-pointer transition duration-200 hover:scale-110 p-2">
                                <path stroke="#fff" strokeLinejoin="round" strokeWidth="12" d="M22 57.265V142c0 5.523 4.477 10 10 10h24V95.056l40 30.278 40-30.278V152h24c5.523 0 10-4.477 10-10V57.265c0-13.233-15.15-20.746-25.684-12.736L96 81.265 47.684 44.53C37.15 36.519 22 44.032 22 57.265Z" />
                            </svg>
                            <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-10 cursor-pointer transition duration-200 hover:scale-110 p-2">
                                <g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" />
                                <path clipRule="evenodd" d="M15.5 5h-6a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path clipRule="evenodd" d="M12.5 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="15.5" y="9" width="2" height="2" rx="1" transform="rotate(-90 15.5 9)" fill="#fff" />
                                <rect x="16" y="8.5" width="1" height="1" rx=".5" transform="rotate(-90 16 8.5)" stroke="#fff" strokeLinecap="round" />
                            </svg>
                            <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none" className="size-10 cursor-pointer transition duration-200 hover:scale-110 p-2">
                                <g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" />
                                <rect width="132" height="132" x="30" y="30" stroke="#fff" strokeWidth="12" rx="16" />
                                <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M66 86v44" />
                                <circle cx="66" cy="64" r="8" fill="#fff" />
                                <path stroke="#fff" strokeLinecap="round" strokeWidth="12" d="M126 130v-26c0-9.941-8.059-18-18-18v0c-9.941 0-18 8.059-18 18v26" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 px-6 py-4 text-[9px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-9 lg:px-10 xl:px-12">
                    <p className="text-[10px] font-text">&copy; 2026 <span className="text-[#FF6E31] cursor-pointer">Sweetreats</span>. All rights Reserved</p>



                    <div className="flex gap-4">
                        <a
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Terms &amp; Conditions
                        </a>
                    </div>
                </div>

            </footer>
        </>
    )
}



/* -------------------------------------------------------------------------- */
/* NEWSLETTER                                                                 */
/* -------------------------------------------------------------------------- */

function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("Enter a valid email address.");
            return;
        }

        setMessage(
            "Connect your newsletter API to complete signup."
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex h-[42px] overflow-hidden rounded-full bg-[#FCF9F4] p-1">
                <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                </label>

                <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setMessage("");
                    }}
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 bg-transparent px-3 text-[10px] text-[#351A16] outline-none placeholder:text-[#351A16]/45"
                />

                <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="flex w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD91A] text-[#351A16] transition-colors hover:bg-[#FFE65A]"
                >
                    <Send size={14} />
                </button>
            </div>

            {message && (
                <p className="mt-2 text-[9px] leading-4 text-[#FFD91A]">
                    {message}
                </p>
            )}
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/* FOOTER HELPERS                                                             */
/* -------------------------------------------------------------------------- */

function FooterColumn({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="mb-4 text-xs font-title tracking-wider">{title}</h3>

            <div className="flex flex-col items-start gap-1 font-text">
                {children}
            </div>
        </div>
    );
}

function FooterLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            className="text-[11px] text-white/60 transition-colors hover:text-[#FFD91A]"
        >
            {children}
        </a>
    );
}

function HeartIcon() {
    return (
        <span aria-hidden="true" className="text-[#FFD91A]">
            ♥
        </span>
    );
}