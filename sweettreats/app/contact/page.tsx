"use client";

import {
    useState,
    useRef,
    type FormEvent,
    type ReactNode,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    Clock3,
    Cat,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Sparkles,
    X,
} from "lucide-react";
import CustomerSupport from "./CustomerSupport";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

/* ========================================================================= */
/* TYPES                                                                     */
/* ========================================================================= */

type ContactMethod = {
    title: string;
    description: string;
    note: string;
    color: string;
    href: string;
    icon: typeof Mail;
};

type FAQ = {
    question: string;
    answer: string;
};

type QuickTopic =
    | "My order"
    | "Delivery"
    | "Products"
    | "Custom order";

/* ========================================================================= */
/* DATA                                                                      */
/* ========================================================================= */

const CONTACT_METHODS: ContactMethod[] = [
    {
        title: "Email Us",
        description: "hello@sweettreats.com",
        note: "We usually reply within 24 hours.",
        color: "#FFD91A",
        href: "mailto:hello@sweettreats.com",
        icon: Mail,
    },
    {
        title: "Call Us",
        description: "+91 98765 43210",
        note: "Mon – Sat · 9:00 AM – 6:00 PM",
        color: "#FF956F",
        href: "tel:+919876543210",
        icon: Phone,
    },
    {
        title: "Visit Us",
        description: "123 Bakery Lane, New Delhi",
        note: "By appointment only.",
        color: "#94C58E",
        href: "https://maps.google.com/?q=New+Delhi",
        icon: MapPin,
    },
];

const FAQS: FAQ[] = [
    {
        question: "How long does delivery take?",
        answer:
            "Most orders arrive within 2–4 business days. Freshly baked items may have different delivery windows depending on your location. We will share your estimated delivery date at checkout.",
    },
    {
        question: "Do you have gluten-free options?",
        answer:
            "We offer selected gluten-free treats. Please check each product's ingredient information before ordering. If you have an allergy or dietary concern, contact our team before placing your order.",
    },
    {
        question: "Do you offer custom orders?",
        answer:
            "Absolutely! Tell us about your celebration, preferred flavours, quantity, and date. We recommend contacting us at least 5–7 days in advance for custom requests.",
    },
    {
        question: "Can I cancel or modify my order?",
        answer:
            "Contact us as soon as possible with your order number. Changes depend on whether your order has entered preparation or dispatch, and our team will explain the available options.",
    },
    {
        question: "What are your payment options?",
        answer:
            "Available payment methods are displayed during checkout. For custom orders, our team will confirm the accepted payment methods and any advance payment requirements.",
    },
    {
        question: "Do you ship outside the city?",
        answer:
            "Delivery availability depends on the product and destination. Share your PIN code with our team and we will help you check the available delivery options.",
    },
    {
        question: "Can I track my order?",
        answer:
            "Once your order has been dispatched, you will receive tracking details if tracking is available for your delivery method. You can also contact us with your order number.",
    },
    {
        question: "How can I provide feedback?",
        answer:
            "We would love to hear from you! Email hello@sweettreats.com, use the support section on this page, or reach out through our social channels.",
    },
];

const QUICK_TOPICS: QuickTopic[] = [
    "My order",
    "Delivery",
    "Products",
    "Custom order",
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ========================================================================= */
/* PAGE                                                                      */
/* ========================================================================= */

export default function ContactPage() {
    const {user,admin} = useAuthStore()
    const prefersReducedMotion = useReducedMotion();

    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const [chatOpen, setChatOpen] = useState(false);


    const chatSectionRef = useRef<HTMLDivElement>(null);
    const chatMessageRef = useRef<HTMLTextAreaElement>(null);

    /* --------------------------------------------------------------------- */
    /* OPEN / CLOSE SUPPORT                                                  */
    /* --------------------------------------------------------------------- */

    function openSupport() {
        setChatOpen(true);

        window.setTimeout(() => {
            chatSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            window.setTimeout(() => {
                chatMessageRef.current?.focus();
            }, 500);
        }, 100);
    }

    function closeSupport() {
        setChatOpen(false);
    }

    function toggleSupport() {
        if (chatOpen) {
            closeSupport();
        } else {
            openSupport();
        }
    }

    const router = useRouter();
    if(!user && admin){
        router.replace("/admin/contact")
        return;
      }

    return (
        <>
        <main className="min-h-screen overflow-x-clip bg-[#F5EEE5] text-[#351A16]">
            <div className="mx-auto w-full max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10 xl:px-12">

                {/* ========================================================= */}
                {/* HERO                                                      */}
                {/* ========================================================= */}

                <section className="relative flex min-h-[calc(100vh-100px)] flex-col justify-center py-12 lg:py-16">

                    {/* Floating doodles */}
                    <FloatingShape
                        className="left-[4%] top-[12%]"
                        delay={0}
                        reduced={Boolean(prefersReducedMotion)}
                    >
                        <div className="h-3 w-3 rounded-full bg-[#FFD91A]" />
                    </FloatingShape>

                    <FloatingShape
                        className="right-[10%] top-[18%]"
                        delay={0.7}
                        reduced={Boolean(prefersReducedMotion)}
                    >
                        <Sparkles
                            size={24}
                            strokeWidth={1.5}
                        />
                    </FloatingShape>

                    <FloatingShape
                        className="bottom-[16%] left-[8%]"
                        delay={1.2}
                        reduced={Boolean(prefersReducedMotion)}
                    >
                        <span className="text-3xl">♡</span>
                    </FloatingShape>

                    <FloatingShape
                        className="bottom-[12%] right-[5%]"
                        delay={1.7}
                        reduced={Boolean(prefersReducedMotion)}
                    >
                        <div className="h-4 w-4 rounded-full bg-[#FF7043]" />
                    </FloatingShape>

                    {/* Hero content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.7,
                                ease,
                            }}
                            className="flex items-center gap-3"
                        >
                            <span className="rounded-full bg-[#2E8B57] px-4 py-2 font-title text-[10px] uppercase tracking-wide text-white">
                                We&apos;re here for you
                            </span>

                            <span className="hidden rounded-full bg-[#FFD91A] px-4 py-2 font-title text-[10px] uppercase sm:inline-flex">
                                Say hello
                            </span>
                        </motion.div>

                        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

                            {/* Heading */}
                            <div>
                                <motion.h1
                                    initial={{
                                        opacity: 0,
                                        y: 50,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.85,
                                        delay: 0.1,
                                        ease,
                                    }}
                                    className="max-w-[1000px] font-title text-[clamp(4.2rem,11vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[0.065em]"
                                >
                                    GET IN
                                    <br />
                                    TOUCH
                                    <span className="text-[#F36D43]">
                                        .
                                    </span>
                                </motion.h1>

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.45,
                                        ease,
                                    }}
                                    className="mt-8 flex max-w-2xl items-start gap-3"
                                >
                                    <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[#FFD91A]" />

                                    <p className="max-w-xl font-text text-sm leading-6 text-[#351A16]/65 sm:text-base">
                                        Questions about your order?
                                        Looking for something
                                        special? Or simply want to
                                        say hello?
                                        <br className="hidden sm:block" />
                                        We&apos;d love to hear from you.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Decorative message */}
                            <motion.div
                             onClick={toggleSupport}
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    rotate: 8,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: -5,
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.5,
                                    ease,
                                }}
                                className="hidden rounded-[35px] bg-white px-8 py-6 shadow-[0_15px_40px_rgba(53,26,22,0.06)] lg:block"
                            >
                                <motion.div

                                    animate={
                                        prefersReducedMotion
                                            ? undefined
                                            : {
                                                  y: [0, -7, 0],
                                              }
                                    }
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="flex items-center gap-5"
                                >
                                    <span className="text-5xl">
                                        🍪
                                    </span>

                                    <div>
                                        <p className="font-title text-lg uppercase leading-none">
                                            Got a question?
                                        </p>

                                        <p className="mt-2 font-text text-xs text-[#351A16]/55">
                                            Just ask us!
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            delay: 1,
                        }}
                        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
                    >
                        <span className="font-title text-[9px] uppercase tracking-[0.2em] text-[#351A16]/45">
                            Scroll for more
                        </span>

                        <motion.div
                            animate={
                                prefersReducedMotion
                                    ? undefined
                                    : {
                                          y: [0, 5, 0],
                                      }
                            }
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                            }}
                        >
                            <ArrowDownRight size={16} />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ========================================================= */}
                {/* CONTACT METHODS                                           */}
                {/* ========================================================= */}

                <section
                    aria-labelledby="contact-options"
                    className="py-10 sm:py-16"
                >
                    <SectionHeading
                        id="contact-options"
                        eyebrow="Reach out"
                        title="Pick your favourite way"
                        subtitle="Whatever works for you. We're listening."
                    />

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {CONTACT_METHODS.map(
                            (method, index) => (
                                <ContactCard
                                    key={method.title}
                                    method={method}
                                    index={index}
                                    reducedMotion={Boolean(
                                        prefersReducedMotion
                                    )}
                                />
                            )
                        )}

                        {/* Social card */}
                        <SocialCard
                            reducedMotion={Boolean(
                                prefersReducedMotion
                            )}
                        />
                    </div>
                </section>

                {/* ========================================================= */}
                {/* LITTLE MARQUEE                                           */}
                {/* ========================================================= */}

                <Marquee reducedMotion={Boolean(prefersReducedMotion)} />

                {/* ========================================================= */}
                {/* FAQ                                                       */}
                {/* ========================================================= */}

                <section
                    id="faqs"
                    className="scroll-mt-10 py-14 sm:py-20"
                >
                    <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">

                        {/* FAQ intro */}
                        <div className="lg:sticky lg:top-24 lg:h-max">
                            <SectionHeading
                                id="faq-heading"
                                eyebrow="Need answers?"
                                title="Good questions."
                                subtitle="Here are a few things people ask us a lot."
                            />

                            <motion.div
                                whileHover={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              rotate: -2,
                                              y: -3,
                                          }
                                }
                                className="mt-8 hidden w-max rounded-[28px] bg-[#FFD91A] px-7 py-5 sm:block"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">
                                        🥐
                                    </span>

                                    <div>
                                        <p className="font-title text-sm uppercase">
                                            Still curious?
                                        </p>

                                        <p className="mt-1 font-text text-xs text-[#351A16]/60">
                                            Ask us directly below.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* FAQ list */}
                        <div className="grid gap-3">
                            {FAQS.map((faq, index) => (
                                <FAQItem
                                    key={faq.question}
                                    faq={faq}
                                    index={index}
                                    open={openFAQ === index}
                                    onClick={() =>
                                        setOpenFAQ(
                                            openFAQ === index
                                                ? null
                                                : index
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================= */}
                {/* SUPPORT CTA                                               */}
                {/* ========================================================= */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.6,
                        ease,
                    }}
                    className="py-6 sm:py-10"
                >
                    <div className="relative overflow-hidden rounded-[32px] bg-[#351A16] p-6 text-white sm:p-8 lg:p-10">

                        {/* Decorations */}
                        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#FFD91A]" />

                        <div className="absolute -bottom-20 left-[30%] h-36 w-36 rounded-full bg-[#FF7043] opacity-60" />

                        <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-start gap-4">
                                <motion.div
                                    animate={
                                        prefersReducedMotion
                                            ? undefined
                                            : {
                                                  rotate: [
                                                      0,
                                                      -8,
                                                      8,
                                                      0,
                                                  ],
                                              }
                                    }
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFD91A] text-[#351A16]"
                                >
                                    <MessageCircle size={21} />
                                </motion.div>

                                <div>
                                    <h2 className="font-title text-2xl uppercase leading-none sm:text-3xl">
                                        Still have questions?
                                    </h2>

                                    <p className="mt-2 max-w-md font-text text-xs leading-5 text-white/60 sm:text-sm">
                                        Our team would love to help you
                                        out.
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                onClick={toggleSupport}
                                whileHover={
                                    prefersReducedMotion
                                        ? undefined
                                        : {
                                              y: -3,
                                          }
                                }
                                whileTap={{
                                    scale: 0.97,
                                }}
                                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FFD91A] px-6 font-title text-[10px] uppercase text-[#351A16] shadow-[0_5px_0_rgba(0,0,0,0.2)] transition-shadow sm:w-auto"
                            >
                                {chatOpen
                                    ? "CLOSE SUPPORT"
                                    : "CHAT WITH SUPPORT"}

                                <motion.span
                                    animate={{
                                        rotate: chatOpen
                                            ? 90
                                            : 0,
                                    }}
                                >
                                    <ArrowRight size={15} />
                                </motion.span>
                            </motion.button>
                        </div>
                    </div>
                </motion.section>

                {/* ========================================================= */}
                {/* INTEGRATED CUSTOMER SUPPORT                               */}
                {/* ========================================================= */}

                {/* ========================================================= */}
                {/* FOOTER NOTE                                               */}
                {/* ========================================================= */}

                <div className="mt-8 border-t-2 border-[#351A16] pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD91A] text-xs">
                                ★
                            </span>

                            <p className="font-title text-[10px] uppercase tracking-wide">
                                Good things take time.
                            </p>
                        </div>

                        <p className="font-text text-xs text-[#351A16]/45">
                            Baked fresh. Made with love.
                        </p>
                    </div>
                </div>
            </div>
        </main>

<CustomerSupport 
open={chatOpen}
onClose={toggleSupport}/>
        </>
    );
}

/* ========================================================================= */
/* FLOATING SHAPE                                                            */
/* ========================================================================= */

function FloatingShape({
    children,
    className,
    delay,
    reduced,
}: {
    children: ReactNode;
    className: string;
    delay: number;
    reduced: boolean;
}) {
    return (
        <motion.div
            className={`pointer-events-none absolute ${className}`}
            animate={
                reduced
                    ? undefined
                    : {
                          y: [0, -8, 0],
                          rotate: [0, 5, 0],
                      }
            }
            transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}

/* ========================================================================= */
/* SECTION HEADING                                                           */
/* ========================================================================= */

function SectionHeading({
    id,
    eyebrow,
    title,
    subtitle,
}: {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF7043]" />

                <span className="font-title text-[10px] uppercase tracking-[0.18em] text-[#351A16]/45">
                    {eyebrow}
                </span>
            </div>

            <h2
                id={id}
                className="mt-3 max-w-3xl font-title text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] tracking-[0.045em]"
            >
                {title}
            </h2>

            <p className="mt-4 max-w-xl font-text text-sm leading-6 text-[#351A16]/55">
                {subtitle}
            </p>
        </div>
    );
}

/* ========================================================================= */
/* CONTACT CARD                                                              */
/* ========================================================================= */

function ContactCard({
    method,
    index,
    reducedMotion,
}: {
    method: ContactMethod;
    index: number;
    reducedMotion: boolean;
}) {
    const Icon = method.icon;

    return (
        <motion.a
            href={method.href}
            target={
                method.title === "Visit Us"
                    ? "_blank"
                    : undefined
            }
            rel={
                method.title === "Visit Us"
                    ? "noreferrer"
                    : undefined
            }
            initial={
                reducedMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 25,
                      }
            }
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease,
            }}
            whileHover={
                reducedMotion
                    ? undefined
                    : {
                          y: -7,
                          rotate: index % 2 === 0 ? -1 : 1,
                      }
            }
            className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(53,26,22,0.045)]"
        >
            {/* Background blob */}
            <motion.div
                initial={false}
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-60"
                style={{
                    backgroundColor: method.color,
                }}
                whileHover={
                    reducedMotion
                        ? undefined
                        : {
                              scale: 1.3,
                          }
                }
                transition={{
                    duration: 0.5,
                    ease,
                }}
            />

            <div className="relative z-10 flex h-full flex-col">
                <motion.div
                    whileHover={
                        reducedMotion
                            ? undefined
                            : {
                                  rotate: -8,
                                  scale: 1.08,
                              }
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{
                        backgroundColor: method.color,
                    }}
                >
                    <Icon
                        size={21}
                        strokeWidth={2}
                    />
                </motion.div>

                <h3 className="mt-6 font-title text-xl uppercase">
                    {method.title}
                </h3>

                <p className="mt-2 break-words font-text text-sm font-semibold leading-5">
                    {method.description}
                </p>

                <p className="mt-2 font-text text-xs leading-5 text-[#351A16]/50">
                    {method.note}
                </p>

                <div className="mt-auto flex justify-end pt-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#351A16]/10 transition-all group-hover:bg-[#351A16] group-hover:text-white">
                        <ArrowUpRight size={15} />
                    </span>
                </div>
            </div>
        </motion.a>
    );
}

/* ========================================================================= */
/* SOCIAL CARD                                                               */
/* ========================================================================= */

function SocialCard({
    reducedMotion,
}: {
    reducedMotion: boolean;
}) {
    const socials = [
        {
            name: "Instagram",
            href: "https://instagram.com/",
            icon: Cat,
            bg: "#E8B7F5",
        },
        {
            name: "YouTube",
            href: "https://youtube.com/",
            icon: Cat,
            bg: "#FFB09A",
        },
    ];

    return (
        <motion.article
            initial={
                reducedMotion
                    ? false
                    : {
                          opacity: 0,
                          y: 25,
                      }
            }
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            transition={{
                duration: 0.55,
                delay: 0.25,
                ease,
            }}
            whileHover={
                reducedMotion
                    ? undefined
                    : {
                          y: -7,
                      }
            }
            className="relative flex min-h-[220px] flex-col overflow-hidden rounded-[28px] bg-[#FCF9F4] p-6"
        >
            <div className="flex gap-2">
                {socials.map((social) => {
                    const Icon = social.icon;

                    return (
                        <motion.a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.name}
                            whileHover={
                                reducedMotion
                                    ? undefined
                                    : {
                                          scale: 1.12,
                                          rotate: -5,
                                      }
                            }
                            whileTap={{
                                scale: 0.95,
                            }}
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{
                                backgroundColor:
                                    social.bg,
                            }}
                        >
                            <Icon size={19} />
                        </motion.a>
                    );
                })}
            </div>

            <h3 className="mt-6 font-title text-xl uppercase">
                Follow us
            </h3>

            <p className="mt-2 max-w-[220px] font-text text-xs leading-5 text-[#351A16]/50">
                Stay close to the oven and see what&apos;s
                baking next.
            </p>

            <div className="mt-auto flex items-center gap-2 pt-5 font-title text-[9px] uppercase">
                Instagram
                <span>·</span>
                YouTube
            </div>
        </motion.article>
    );
}

/* ========================================================================= */
/* MARQUEE                                                                   */
/* ========================================================================= */

function Marquee({
    reducedMotion,
}: {
    reducedMotion: boolean;
}) {
    const items = [
        "BAKED FRESH EVERY MORNING",
        "MADE BY HAND",
        "GOOD THINGS TAKE TIME",
        "TREAT YOURSELF",
    ];

    return (
        <div className="relative -mx-4 overflow-hidden border-y-2 border-[#351A16] bg-[#FFD91A] py-4 sm:-mx-6 lg:-mx-10 xl:-mx-12">
            <motion.div
                animate={
                    reducedMotion
                        ? undefined
                        : {
                              x: ["0%", "-50%"],
                          }
                }
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex w-max items-center"
            >
                {[...items, ...items, ...items].map(
                    (item, index) => (
                        <div
                            key={`${item}-${index}`}
                            className="flex items-center"
                        >
                            <span className="mx-7 whitespace-nowrap font-title text-[10px] uppercase tracking-[0.16em] sm:text-xs">
                                {item}
                            </span>

                            <span className="text-lg">
                                ✦
                            </span>
                        </div>
                    )
                )}
            </motion.div>
        </div>
    );
}

/* ========================================================================= */
/* FAQ ITEM                                                                  */
/* ========================================================================= */

function FAQItem({
    faq,
    index,
    open,
    onClick,
}: {
    faq: FAQ;
    index: number;
    open: boolean;
    onClick: () => void;
}) {
    const answerId = `faq-answer-${index}`;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 12,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.4,
                delay: (index % 4) * 0.05,
                ease,
            }}
            className={`overflow-hidden rounded-[22px] border-2 transition-colors ${
                open
                    ? "border-[#FFD91A] bg-white"
                    : "border-transparent bg-[#FCF9F4] hover:border-[#351A16]/10"
            }`}
        >
            <button
                type="button"
                onClick={onClick}
                aria-expanded={open}
                aria-controls={answerId}
                className="flex min-h-[72px] w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
            >
                <span className="font-text text-sm font-bold leading-5 sm:text-base">
                    {faq.question}
                </span>

                <motion.span
                    animate={{
                        rotate: open ? 180 : 0,
                    }}
                    transition={{
                        duration: 0.25,
                    }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                        open
                            ? "bg-[#FFD91A]"
                            : "bg-[#F2E9DF]"
                    }`}
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        id={answerId}
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease,
                        }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-6 font-text text-sm leading-6 text-[#351A16]/55 sm:px-6">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}
