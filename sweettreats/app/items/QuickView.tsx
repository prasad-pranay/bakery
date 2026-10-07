import { useMemo, useState } from "react";
import {
    ArrowDownUp,
    ArrowRight,
    Check,
    ChevronDown,
    ChevronRight,
    Heart,
    Menu,
    Plus,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    Star,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useEffect, useRef } from "react";
import {
    useReducedMotion,
} from "framer-motion";

import {Product,Category} from "../type/product";

export default function QuickView({
    product,
    onClose,
    onAdd,
}: {
    product: Product;
    onClose: () => void;
    onAdd: () => void;
}) {
    const [activeSection, setActiveSection] = useState<
        "details" | "reviews" | "ingredients"
    >("details");

    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const rating = product.rating ?? 4.8;
    const reviewCount =  product.reviews?.length ?? 0;

    const reviews = product.reviews ?? [];

    const handleSubmitReview = () => {
        if (!userRating || !review.trim()) return;

        // Connect this to your backend later.
        console.log({
            productId: product._id,
            rating: userRating,
            review: review.trim(),
        });

        setReview("");
        setUserRating(0);
    };

    return (
        <>
            {/* BACKDROP */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="
                    fixed inset-0 z-[10000]
                    bg-[#321714]/45
                    backdrop-blur-[3px]
                "
            />

            {/* MODAL */}
            <motion.div
            data-lenis-prevent
                initial={{
                    opacity: 0,
                    scale: 0.94,
                    y: 28,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.97,
                    y: 20,
                }}
                transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="
                    fixed left-1/2 top-1/2
                    z-[11000]
                    flex
                    w-[calc(100%-20px)]
                    max-w-[980px]
                    -translate-x-1/2
                    -translate-y-1/2
                    flex-col
                    h-[85vh]
                    overscroll-contain
                    rounded-[30px]
                    bg-[#F8F2E9]
                    shadow-[0_35px_100px_rgba(50,23,20,0.22)]
                    sm:w-[calc(100%-32px)]
                "
            >
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="
                        absolute
                        right-4
                        top-4
                        z-30
                        cursor-pointer
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F8F2E9]/85
                        text-[#321714]
                        shadow-sm
                        backdrop-blur-md
                        transition-all
                        duration-300
                        hover:rotate-90
                        hover:bg-white
                    "
                >
                    <X size={16} strokeWidth={2} />
                </button>

                    {/* =========================================
                        HERO PRODUCT
                    ========================================== */}

                    <div className="grid md:grid-cols-[1.05fr_0.95fr] h-full w-full sidebar-none overflow-y-scroll overscroll-contain">

                        {/* IMAGE */}
                        <div
                            className="
                                relative
                                min-h-[330px]
                                overflow-hidden
                                sm:min-h-[430px]
                                md:min-h-[560px]
                            "
                            // style={{
                            //     backgroundColor: product.accent,
                            // }}
                        >
                            {/* soft decorative circle */}
 
                            {/* product */}

                            <motion.img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/images/${product.image}`}
                                alt={product.name}
                                initial={{
                                    opacity: 0,
                                    scale: 0.86,
                                    rotate: -3,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0,
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.08,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    h-[72%]
                                    w-[88%]
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    object-contain
                                    drop-shadow-[0_30px_30px_rgba(50,23,20,0.18)]
                                "
                            />

                            {/* handwritten note */}
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    rotate: -8,
                                    scale: 0.8,
                                }}
                                animate={{
                                    opacity: 1,
                                    rotate: -5,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 0.45,
                                    delay: 0.35,
                                }}
                                className="
                                    absolute
                                    bottom-8
                                    left-7
                                    max-w-[150px]
                                    rounded-[12px]
                                    bg-[#FFF9E8]
                                    px-4
                                    py-3
                                    font-[cursive]
                                    text-[11px]
                                    font-semibold
                                    leading-tight
                                    text-[#321714]
                                    shadow-[3px_4px_0_rgba(50,23,20,0.08)]
                                "
                            >
                                {product.note}
                            </motion.span>

                        </div>

                        {/* DETAILS */}
                        <div
                            className="
                                flex
                                flex-col
                                px-6
                                py-8
                                sm:px-8
                                sm:py-10
                                md:px-11
                                md:py-12
                                h-full
                                overflow-y-scroll sidebar-none
                            "
                        >
                            {/* category */}
                            <motion.span
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="
                                    text-[9px]
                                    font-text font-md
                                    uppercase
                                    tracking-[0.22em]
                                "
                            >
                                {product.category}
                            </motion.span>

                            {/* name */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="
                                    mt-3
                                    max-w-[390px]
                                    text-[38px]
                                    font-header font-bold
                                    leading-[0.88]
                                    tracking-[1.3px]
                                    text-[#321714]
                                    sm:text-[46px]
                                    md:text-[50px]
                                "
                            >
                                {product.name}
                            </motion.h2>

                            {/* RATING */}
                            <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                onClick={() => setActiveSection("reviews")}
                                className="
                                    mt-5
                                    flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-[10px]
                                    text-left
                                "
                            >
                                <div className="flex items-center gap-[2px]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={20}
                                            fill={
                                                star <= Math.round(rating)
                                                    ? "#ffd91a"
                                                    : "transparent"
                                            }
                                            className="text-[#ffd91a]"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </div>

                                <span className="text-[11px] font-text text-[#321714]">
                                    {rating.toFixed(1)}
                                </span>

                                <span className="text-[10px] font-text font-medium text-[#321714]/70">
                                    ({reviewCount} reviews)
                                </span>
                            </motion.button>

                            {/* divider */}
                            {/* <div className="mt-6 flex items-center gap-3">
                                <span className="h-px w-8 bg-[#321714]/20" />

                                <span
                                    className="
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#321714]/35
                                    "
                                >
                                    Made with love
                                </span>
                            </div> */}

                            {/* description */}
                            {activeSection === "details" &&<motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="
                                    mt-6
                                    max-w-[390px]
                                    text-[13px]
                                    leading-[1.75] font-text
                                    text-[#321714]/60
                                "
                            >
                                {product.description}
                            </motion.p>}

                            {/* tags */}
                            {activeSection === "details" && <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
    {product.tags.map((tag, i) => (
        <motion.div
            key={tag}
            initial={{
                opacity: 0,
                y: 12,
                rotate: i % 2 === 0 ? -4 : 3,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: i % 2 === 0 ? -4 : 3,
            }}
            whileHover={{
                y: -5,
                rotate: 0,
                scale: 1.06,
            }}
            transition={{
                delay: 0.25 + i * 0.07,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative cursor-default"
        >
            {/* little marker */}
            <span
                className="
                    absolute
                    -left-2
                    -top-1
                    text-[10px]
                    text-[#321714]/30
                    transition-transform
                    duration-300
                    group-hover:scale-125
                "
            >
                ✦
            </span>

            {/* actual tag */}
            <span
                className="
                    block
                    border-b
                    border-[#321714]/25
                    pb-1
                    pl-1
                    font-[cursive]
                    text-[10px]
                    font-semibold
                    leading-none
                    text-[#321714]/70
                    transition-colors
                    duration-300
                    group-hover:border-[#321714]/60
                    group-hover:text-[#321714]
                "
            >
                {tag}
            </span>
        </motion.div>
    ))}
</div>}

                            {/* =====================================
                                PRODUCT INFORMATION NAV
                            ====================================== */}

                            <div className="mt-7 border-t border-[#321714]/[0.08]">
                                <div className="flex gap-1 pt-2">
                                    <button
                                        onClick={() =>
                                            setActiveSection("details")
                                        }
                                        className={`
                                            relative
                                            px-1
                                            py-3
                                            text-xs
                                            font-text font-semibold
                                            uppercase
                                            cursor-pointer
                                            tracking-[0.1em]
                                            transition-colors
                                            ${activeSection === "details"
                                                ? "text-[#321714]"
                                                : "text-[#321714]/35 hover:text-[#321714]/70"
                                            }
                                        `}
                                    >
                                        Details

                                        {activeSection === "details" && (
                                            <motion.span
                                                layoutId="quickview-tab"
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    right-0
                                                    h-[2px]
                                                    rounded-full
                                                    bg-[#FFD91A]
                                                "
                                            />
                                        )}
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveSection("ingredients")
                                        }
                                        className={`
                                            relative
                                            px-3
                                            py-3
                                            text-xs
                                            font-text font-semibold
                                            uppercase cursor-pointer
                                            tracking-[0.1em]
                                            transition-colors
                                            ${activeSection === "ingredients"
                                                ? "text-[#321714]"
                                                : "text-[#321714]/35 hover:text-[#321714]/70"
                                            }
                                        `}
                                    >
                                        Ingredients

                                        {activeSection === "ingredients" && (
                                            <motion.span
                                                layoutId="quickview-tab"
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-3
                                                    right-3
                                                    h-[2px]
                                                    rounded-full
                                                    bg-[#FFD91A]
                                                "
                                            />
                                        )}
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveSection("reviews")
                                        }
                                        className={`
                                            relative
                                            px-3
                                            py-3
                                            text-xs
                                            font-text font-semibold
                                            uppercase cursor-pointer
                                            tracking-[0.1em]
                                            transition-colors
                                            ${activeSection === "reviews"
                                                ? "text-[#321714]"
                                                : "text-[#321714]/35 hover:text-[#321714]/70"
                                            }
                                        `}
                                    >
                                        Reviews

                                        {activeSection === "reviews" && (
                                            <motion.span
                                                layoutId="quickview-tab"
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-3
                                                    right-3
                                                    h-[2px]
                                                    rounded-full
                                                    bg-[#FFD91A]
                                                "
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* =====================================
                                TAB CONTENT
                            ====================================== */}

                            <AnimatePresence mode="wait">
                                {/* DETAILS */}
                                {activeSection === "details" && (
                                    <motion.div
                                        key="details"
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        className="pt-4"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-[13px] bg-white/55 p-3">
                                                <span className="block text-[11px] font-header uppercase tracking-wider text-[#321714]/35">
                                                    Freshness
                                                </span>
                                                <span className="mt-1 block text-sm font-text font-semibold text-[#321714]">
                                                    Baked fresh
                                                </span>
                                            </div>

                                            <div className="rounded-[13px] bg-white/55 p-3">
                                                <span className="block text-xs font-header uppercase tracking-wider text-[#321714]/35">
                                                    Serving
                                                </span>
                                                <span className="mt-1 block text-sm font-text font-semibold text-[#321714]">
                                                    1 piece
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* INGREDIENTS */}
                                {activeSection === "ingredients" && (
                                    <motion.div
                                        key="ingredients"
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        className="pt-4"
                                    >


                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {(
                                                product.ingredients ?? [
                                                    "Wheat flour",
                                                    "Butter",
                                                    "Sugar",
                                                    "Eggs",
                                                    "Vanilla",
                                                    "Sea salt",
                                                ]
                                            ).map((ingredient) => (
                                                <span
                                                    key={ingredient}
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-[10px]
                                                        bg-white/60 font-text tracking-wider
                                                        px-3
                                                        py-2
                                                        text-[11px]
                                                        font-medium
                                                        text-[#321714]/65
                                                    "
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD91A]" />
                                                    {ingredient}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* REVIEWS */}
                                {activeSection === "reviews" && (
                                    <motion.div
                                        key="reviews"
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        className="pt-4"
                                    >
                                        {/* REVIEW SUMMARY */}
                                        <div className="flex items-center justify-between rounded-[15px] bg-white/55 p-4">
                                            <div>
                                                <div className="flex items-end gap-2">
                                                    <span className="text-[28px] font-text font-bold leading-none text-[#321714]">
                                                        {rating.toFixed(1)}
                                                    </span>

                                                    <span className="pb-0.5 text-[9px] font-text font-bold text-[#321714]/35">
                                                        / 5
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex gap-[2px]">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                size={18}
                                                                fill={
                                                                    star <=
                                                                        Math.round(
                                                                            rating
                                                                        )
                                                                        ? "#FFD91A"
                                                                        : "transparent"
                                                                }
                                                                className="text-[#FFD91A]"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <span className="text-right text-xs font-medium font-text leading-4 text-[#321714]/40">
                                                Based on
                                                <br />
                                                <strong className="text-[#321714]">
                                                    {reviewCount}
                                                </strong>{" "}
                                                reviews
                                            </span>
                                        </div>

                                        {/* WRITE REVIEW */}
                                        <div className="mt-4 rounded-[15px] border border-[#321714]/[0.07] bg-white/35 p-4">
                                            <span className="text-xs font-header font-bold uppercase tracking-[0.17em] text-[#321714]/45">
                                                Rate this treat
                                            </span>

                                            <div className="mt-3 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(
                                                    (star) => {
                                                        const active =
                                                            star <=
                                                            (hoverRating ||
                                                                userRating);

                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                aria-label={`${star} star`}
                                                                onMouseEnter={() =>
                                                                    setHoverRating(
                                                                        star
                                                                    )
                                                                }
                                                                onMouseLeave={() =>
                                                                    setHoverRating(
                                                                        0
                                                                    )
                                                                }
                                                                onClick={() =>
                                                                    setUserRating(
                                                                        star
                                                                    )
                                                                }
                                                                className="
                                                                    rounded-md
                                                                    p-1
                                                                    transition-transform
                                                                    hover:scale-110
                                                                "
                                                            >
                                                                <Star
                                                                    size={19}
                                                                    fill={
                                                                        active
                                                                            ? "#FFD91A"
                                                                            : "transparent"
                                                                    }
                                                                    className="text-[#321714]"
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                />
                                                            </button>
                                                        );
                                                    }
                                                )}

                                                {userRating > 0 && (
                                                    <motion.span
                                                        initial={{
                                                            opacity: 0,
                                                            x: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        className="ml-2 text-[9px] font-bold text-[#321714]/45"
                                                    >
                                                        {userRating === 5
                                                            ? "Loved it!"
                                                            : userRating === 4
                                                                ? "Really good!"
                                                                : userRating === 3
                                                                    ? "Pretty good"
                                                                    : userRating ===
                                                                        2
                                                                        ? "Could be better"
                                                                        : "Not for me"}
                                                    </motion.span>
                                                )}
                                            </div>

                                            <textarea
                                                value={review}
                                                onChange={(e) =>
                                                    setReview(e.target.value)
                                                }
                                                placeholder="Tell us what you thought..."
                                                rows={3}
                                                className="
                                                    mt-3
                                                    w-full
                                                    resize-none
                                                    rounded-[11px]
                                                    border
                                                    border-[#321714]/[0.07]
                                                    bg-[#F8F2E9]/70
                                                    px-3
                                                    font-text font-medium
                                                    py-3
                                                    text-[11px]
                                                    text-[#321714]
                                                    outline-none
                                                    placeholder:text-[#321714]/25
                                                    focus:border-[#321714]/20
                                                "
                                            />

                                            <button
                                                type="button"
                                                disabled={
                                                    !userRating ||
                                                    !review.trim()
                                                }
                                                onClick={handleSubmitReview}
                                                className="
                                                    mt-2
                                                    rounded-[10px]
                                                    bg-[#321714]
                                                    px-4
                                                    py-2
                                                    text-sm
                                                    font-title
                                                    uppercase
                                                    tracking-[0.2em]
                                                    text-white
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-25
                                                "
                                            >
                                                Post review
                                            </button>
                                        </div>

                                        {/* EXISTING REVIEWS */}
                                        {reviews.length > 0 && (
                                            <div className="mt-5">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#321714]/45">
                                                        From the bakery crowd
                                                    </span>

                                                    <span className="font-[cursive] text-[11px] text-[#321714]/40">
                                                        sweet words
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {reviews.map(
                                                        (item, index) => (
                                                            <motion.div
                                                                key={item.id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 8,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.05,
                                                                }}
                                                                className="
                                                                    rounded-[14px]
                                                                    bg-white/50
                                                                    p-4
                                                                "
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        <span className="text-[10px] font-black text-[#321714]">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </span>

                                                                        <div className="mt-1 flex gap-[1px]">
                                                                            {[
                                                                                1,
                                                                                2,
                                                                                3,
                                                                                4,
                                                                                5,
                                                                            ].map(
                                                                                (
                                                                                    star
                                                                                ) => (
                                                                                    <Star
                                                                                        key={
                                                                                            star
                                                                                        }
                                                                                        size={
                                                                                            9
                                                                                        }
                                                                                        fill={
                                                                                            star <=
                                                                                                item.rating
                                                                                                ? "#FFD91A"
                                                                                                : "transparent"
                                                                                        }
                                                                                        className="text-[#321714]"
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <span className="text-[8px] font-medium text-[#321714]/25">
                                                                        {
                                                                            item.date
                                                                        }
                                                                    </span>
                                                                </div>

                                                                <p className="mt-2 text-[10px] leading-5 text-[#321714]/55">
                                                                    {
                                                                        item.text
                                                                    }
                                                                </p>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* PRICE + ADD */}
                            <div className="mt-7 flex items-center justify-between gap-5 border-t border-[#321714]/[0.08] pt-6">
                                <div>
                                    <span
                                        className="
                                            block
                                            text-3xl
                                            font-text font-semibold
                                            leading-none
                                            tracking-[1px]
                                            text-[#321714]
                                        "
                                    >
                                        ₹{product.price}
                                    </span>

                                    <span
                                        className="
                                            mt-1.5
                                            block
                                            text-[9px]
                                            font-text font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#321714]/35
                                        "
                                    >
                                        Per piece
                                    </span>
                                </div>

                                <motion.button
                                    onClick={onAdd}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="
                                        group
                                        relative
                                        flex
                                        min-h-[48px]
                                        items-center
                                        gap-3
                                        rounded-[15px]
                                        bg-[#FFD91A]
                                        px-5
                                        text-xs cursor-pointer
                                        font-text font-bold
                                        uppercase
                                        tracking-[0.08em]
                                        text-[#321714]
                                        shadow-[3px_4px_0_#321714]
                                        transition-shadow
                                        duration-300
                                        hover:shadow-[5px_7px_0_#321714]
                                    "
                                >
                                    Add to bag

                                    <span
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:rotate-[-8deg]
                                        "
                                    >
                                        <ShoppingBag
                                            size={15}
                                            strokeWidth={2.3}
                                        />
                                    </span>
                                </motion.button>
                            </div>

                            {/* FOOTNOTE */}
                            {/* <span
                                className="
                                    mt-5
                                    text-center
                                    text-[8px]
                                    font-medium
                                    tracking-[0.04em]
                                    text-[#321714]/30
                                "
                            >
                                Baked fresh · Packed with care
                            </span> */}
                        </div>
                    </div>
            </motion.div>
        </>
    );
}