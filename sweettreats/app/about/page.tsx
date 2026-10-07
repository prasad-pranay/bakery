"use client";

import { motion, Variants } from "framer-motion";
import {
    ArrowDownRight,
    ArrowRight,
    BookOpen,
    GraduationCap,
    IdCard,
    MapPin,
    Sparkles,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const student = {
    name: "Sumit Kumar",
    enrollmentNumber: "2250718757",
    studyCentre: "07162P (MERIT)",
    regionalCentre: "07, RC",
    image: "/user.webp",
};

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const academicDetails = [
    {
        label: "Full Name",
        value: student.name,
        icon: UserRound,
        number: "01",
    },
    {
        label: "Enrollment Number",
        value: student.enrollmentNumber,
        icon: IdCard,
        number: "02",
    },
    {
        label: "Study Centre",
        value: student.studyCentre,
        icon: BookOpen,
        number: "03",
    },
    {
        label: "Regional Centre Code",
        value: student.regionalCentre,
        icon: MapPin,
        number: "04",
    },
];

export default function AboutPage() {
    return (
        <main className="w-full">


            {/* Hero */}
            <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="
        mx-auto flex w-full max-w-7xl
        min-h-[calc(100vh-90px)]
        items-center justify-between
        gap-10 px-5 py-10
        sm:px-8 sm:py-12
        lg:flex-row lg:gap-16 lg:px-10
        xl:gap-24
    "
>
    {/* Introduction */}
    <div className="relative z-10 w-full lg:max-w-2xl">
        <motion.h1
            variants={itemVariants}
            className="
                max-w-3xl
                font-title font-black
                text-[clamp(3.2rem,13vw,7.5rem)]
                leading-[0.84]
                tracking-[0.04em]
                sm:text-[clamp(4rem,10vw,7rem)]
                lg:tracking-[0.075em]
            "
        >
            I&apos;M
            <br />

            <span className="relative inline-block">
                SUMIT

                <span
                    aria-hidden="true"
                    className="
                        absolute
                        -bottom-1 left-0 -z-10
                        h-[20%] w-full
                        -rotate-2
                        rounded-sm
                        bg-[#FFD91A]
                        sm:-bottom-2
                    "
                />
            </span>

            <br />

            KUMAR
            <span className="text-[#F36A3D]">.</span>
        </motion.h1>

        <motion.div
            variants={itemVariants}
            className="
                mt-7
                flex flex-wrap
                items-center gap-3
                sm:mt-8 sm:gap-4
            "
        >
            <a
                href="#academics"
                className="
                    group inline-flex
                    items-center gap-2.5
                    rounded-full
                    bg-[#351A16]
                    px-5 py-3.5
                    font-title text-sm
                    tracking-wider text-white
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:bg-[#4B2821]
                    hover:shadow-xl
                    sm:gap-3
                    sm:px-6 sm:py-4
                "
            >
                Discover my profile

                <ArrowDownRight
                    size={18}
                    className="
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:translate-y-1
                    "
                />
            </a>
        </motion.div>
    </div>

    {/* Profile image */}
    <motion.div
        variants={itemVariants}
        className="
            relative
            w-full max-w-[520px]
            lg:order-2
            lg:w-[42vw]
            lg:max-w-[500px]
        "
    >
        {/* Image frame */}
        <motion.div
            whileHover={{ rotate: 0, y: -5 }}
            initial={{ rotate: 2 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
            }}
            className="
                relative
                aspect-[4/4.7]
                w-full
                overflow-hidden
                rounded-[1.5rem]
                border-4 border-white
                bg-[#E8D9C8]
                shadow-[0_24px_80px_rgba(53,26,22,0.12)]
                sm:rounded-[2.5rem]
                sm:border-[8px]
            "
        >
            <img
                src={student.image}
                alt={`Portrait of ${student.name}`}
                sizes="
                    (max-width: 640px) 90vw,
                    (max-width: 1024px) 70vw,
                    45vw
                "
                className="
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-[1.04]
                "
            />

            {/* Image overlay */}
            <div
                className="
                    absolute inset-x-0 bottom-0
                    h-1/3
                    bg-gradient-to-t
                    from-[#351A16]/60
                    to-transparent
                "
            />

            <div
                className="
                    absolute
                    bottom-4 left-4 right-4
                    flex items-end
                    justify-between gap-3
                    text-white
                    sm:bottom-7 sm:left-7 sm:right-7
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-white/80
                            sm:text-xs
                            sm:tracking-[0.2em]
                        "
                    >
                        Nice to meet you
                    </p>

                    <p
                        className="
                            mt-1
                            text-xl
                            font-black
                            tracking-tight
                            sm:text-3xl
                        "
                    >
                        {student.name}
                    </p>
                </div>

                <div
                    className="
                        flex
                        h-10 w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FFD91A]
                        text-[#351A16]
                        sm:h-14 sm:w-14
                    "
                >
                    <ArrowDownRight
                        size={22}
                        className="sm:h-6 sm:w-6"
                    />
                </div>
            </div>
        </motion.div>
    </motion.div>
</motion.div>

            {/* Academic information */}
            <section
                id="academics"
                className="relative scroll-mt-10 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
            >
                <div className="mx-auto max-w-[1400px]">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        {/* Section heading */}
                        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
                            <div>
                                <motion.h2
                                    variants={itemVariants}
                                    className="max-w-2xl text-4xl font-title leading-tight tracking-[0.055em] sm:text-5xl lg:text-6xl"
                                >
                                    A little more
                                    <br className="hidden sm:block" /> about me
                                    <span className="text-[#F36A3D]">.</span>
                                </motion.h2>
                            </div>

                        </div>

                        {/* Information cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {academicDetails.map((detail) => {
                                const Icon = detail.icon;

                                return (
                                    <motion.article
                                        key={detail.number}
                                        variants={itemVariants}
                                        whileHover={{ y: -6 }}
                                        className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[1.5rem] border border-[#351A16]/10  p-6 transition-colors duration-300 hover:border-[#FFD91A] sm:p-7"
                                    >
                                        {/* Background number */}
                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-1 -top-5 text-8xl font-black tracking-tighter text-[#351A16]/[0.035] transition-colors duration-300 group-hover:text-[#351A16]/[0.07]"
                                        >
                                            {detail.number}
                                        </span>

                                        <div className="relative flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#351A16] shadow-sm transition-all duration-300 group-hover:rotate-[-6deg] group-hover:bg-[#FFD91A]">
                                                <Icon size={22} strokeWidth={1.8} />
                                            </div>

                                            <ArrowDownRight
                                                size={19}
                                                className="text-[#876F68] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                                            />
                                        </div>

                                        <div className="relative mt-10">
                                            <p className="mb-3 text-xs font-title uppercase tracking-[0.14em] text-[#876F68]">
                                                {detail.label}
                                            </p>

                                            <p className="break-words text-xl font-header font-bold leading-snug tracking-tight sm:text-4xl">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}