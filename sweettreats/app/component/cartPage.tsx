"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Handbag,
    LockKeyhole,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    X,
} from "lucide-react";
import { Product } from "../type/product";
import { useAuthStore } from "../store/authStore";
import { useEffect, useMemo } from "react";
import { cartItemRemove, cartUpdateBackend } from "../type/cart";
import Link from "next/link";

export type cartItemType = {
    productId: number;
    quantity: number;
};

type CartDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartDrawer({
    isOpen,
    onClose,
}: CartDrawerProps) {

 const {  products, cart, setCartItem } = useAuthStore();

    
    const subtotal = products.reduce(
        (accumulator, currentValue) =>{
            const cartItemIndex = (cart||[]).find((item) => 
                currentValue._id === item.productId
            );
            const itemPrice = cartItemIndex ? currentValue.price * cartItemIndex .quantity : 0;

            return accumulator + itemPrice; 
        },
        0
    );


    const total = subtotal ;



    async function updateBag(id: number, quantity: number) {
        try {
            const response =
                quantity === 0
                    ? await cartItemRemove(id)
                    : await cartUpdateBackend(id, quantity);
    
            if (!response.success) {
                console.log(response.message || "Failed to update value");
                return;
            }
    
            setCartItem(response.data);

    
        } catch (error) {
            console.error("Failed to update bag:", error);
        }
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[11000] " data-lenis-prevent>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="
                            fixed
                            inset-0
                            z-[11000]
                            bg-[#321714]/30
                            backdrop-blur-[6px]
                        "
                    />

                    {/* Drawer */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8,
                        }}
                        className="
                            fixed
                            right-0
                            top-0
                            z-[11000]
                            flex
                            h-dvh
                            w-full
                            max-w-[520px]
                            flex-col
                            overflow-hidden
                            bg-[#FCF9F3]
                            text-[#321714]
                            shadow-[-20px_0_70px_rgba(50,23,20,0.15)]
                        "
                    >
                        {/* Decorative glow */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-20
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-[#FFD91A]/20
                                blur-[2px]
                            "
                        />

                        {/* Header */}
                        <header
                            className="
                                relative
                                shrink-0
                                px-6
                                pb-5
                                pt-7
                                sm:px-8
                            "
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-3 flex items-center gap-2">

                                            <Handbag
                                                className="size-14"
                                                strokeWidth={1}
                                            />

                                        <span
                                            className="
                                                text-4xl
                                                uppercase
                                                tracking-[0.18em]
                                                font-text
                                            "
                                        >
                                            Your Bag 
                                        </span>
                                    </div>


                                    {/* <p
                                        className="
                                            mt-2
                                            text-sm
                                            font-text
                                            text-[#321714]/70
                                        "
                                    >
                                        Good things are inside{" "}
                                        <span className="text-[#E9B800]">
                                            ♡
                                        </span>
                                    </p> */}
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close cart"
                                    className="
                                        flex
                                        h-10 cursor-pointer
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#321714]/10
                                        bg-white/50
                                        text-[#321714]/65
                                        transition-all
                                        duration-200
                                        hover:rotate-90
                                        hover:bg-[#321714]
                                        hover:text-[#FFF9E8]
                                        active:scale-90
                                    "
                                >
                                    <X
                                        className="h-4 w-4"
                                        strokeWidth={1.8}
                                    />
                                </button>
                            </div>
                        </header>

                        {/* Scrollable products */}
                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-y-auto
                                overscroll-contain
                                px-6
                                sm:px-8
                            "
                        >
                            {cart.length === 0 ? (
                                <EmptyCart />
                            ) : (
                                <div className="pb-8">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase font-text
                                                tracking-[0.16em]
                                                text-[#321714]/40
                                            "
                                        >
                                            {cart.length}{" "}
                                            {cart.length === 1
                                                ? "item"
                                                : "items"}
                                        </span>

                                    </div>

                                    <div className="divide-y divide-[#321714]/[0.08]">
                                        {cart.map(
                                            ({ productId, quantity }, index) => {
                                                const productItem : Product | undefined = products.find(
                                                    (product) =>
                                                        product._id ===
                                                        productId
                                                );

                                                
                                                return <motion.div
                                                    key={productId}
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        x: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            index * 0.05,
                                                        duration: 0.35,
                                                    }}
                                                    className="
                                                        group
                                                        flex
                                                        gap-4
                                                        py-5
                                                    "
                                                >
                                                    {/* Product image */}
                                                    <div
                                                        className="
                                                            relative
                                                            h-[92px]
                                                            w-[92px]
                                                            shrink-0
                                                            overflow-hidden
                                                            rounded-[18px]
                                                            bg-[#F1EAE0]
                                                        "
                                                    >
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${productItem!.image}`}
                                                            alt={productItem!.name}
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                                transition-transform
                                                                duration-500
                                                                group-hover:scale-105
                                                            "
                                                        />
                                                    </div>

                                                    {/* Product details */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <h3
                                                                    className="
                                                                        truncate
                                                                        font-serif
                                                                        text-xl font-header
                                                                        leading-tight
                                                                    "
                                                                >
                                                                    {
                                                                        productItem!.name
                                                                    }
                                                                </h3>

                                                            </div>

                                                            {/* Remove */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateBag(
                                                                        productItem!._id,
                                                                        0
                                                                    )
                                                                }
                                                                aria-label={`Remove ${productItem!.name}`}
                                                                className="
                                                                    shrink-0
                                                                    text-[#321714]/30
                                                                    transition-colors
                                                                    duration-200
                                                                    hover:text-[#321714]
                                                                "
                                                            >
                                                                <Trash2
                                                                    className="h-3.5 w-3.5"
                                                                    strokeWidth={
                                                                        1.7
                                                                    }
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            {/* Single Price */}
                                                            <span className="text-xs font-semibold">
                                                                ₹{ productItem!.price} x {quantity}
                                                            </span>
                                                            {/* Price */}
                                                            <span className="text-base font-semibold">
                                                                ₹
                                                                {(
                                                                    productItem!.price *
                                                                    quantity
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </span>

                                                            {/* Quantity */}
                                                            <div
                                                                className="
                                                                    flex
                                                                    h-8
                                                                    items-center
                                                                    overflow-hidden
                                                                    rounded-full
                                                                    border
                                                                    border-[#321714]/10
                                                                    bg-white/50
                                                                "
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateBag(
                                                                                productItem!._id,
                                                                                quantity-1
                                                                        )
                                                                    }
                                                                    className="
                                                                        flex
                                                                        h-full
                                                                        w-8
                                                                        items-center
                                                                        justify-center
                                                                        text-[#321714]/50
                                                                        transition-colors
                                                                        hover:bg-[#FFD91A]/20
                                                                        hover:text-[#321714]
                                                                        active:scale-90
                                                                    "
                                                                >
                                                                    <Minus
                                                                        className="h-3 w-3"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                    />
                                                                </button>

                                                                <AnimatePresence
                                                                    mode="popLayout"
                                                                    initial={
                                                                        false
                                                                    }
                                                                >
                                                                    <motion.span
                                                                        key={
                                                                            quantity
                                                                        }
                                                                        initial={{
                                                                            opacity: 0,
                                                                            y: 5,
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
                                                                            duration: 0.18,
                                                                        }}
                                                                        className="
                                                                            flex
                                                                            min-w-7
                                                                            justify-center
                                                                            text-[11px]
                                                                            font-semibold
                                                                            tabular-nums
                                                                        "
                                                                    >
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </motion.span>
                                                                </AnimatePresence>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateBag(
                                                                            productItem!._id,
                                                                            quantity+1
                                                                        )
                                                                    }
                                                                    className="
                                                                        flex
                                                                        h-full
                                                                        w-8
                                                                        items-center
                                                                        justify-center
                                                                        text-[#321714]/50
                                                                        transition-colors
                                                                        hover:bg-[#FFD91A]/20
                                                                        hover:text-[#321714]
                                                                        active:scale-90
                                                                    "
                                                                >
                                                                    <Plus
                                                                        className="h-3 w-3"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
})}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Checkout footer */}
                        {cart.length > 0 && (
                            <div
                                className="
                                    relative
                                    shrink-0
                                    border-t
                                    border-[#321714]/[0.08]
                                    bg-[#FCF9F3]
                                    px-6
                                    pb-6
                                    pt-4 flex items-center
                                    sm:px-8
                                "
                            >
                                <div className="flex flex-col items-start justify-center min-w-25">
                                        <span
                                            className="
                                                text-[9px]
                                                font-semibold
                                                font-text
                                                uppercase
                                                tracking-[0.12em]
                                            "
                                        >
                                            Total
                                        </span>

                                        <span
                                            className="
                                                font-serif
                                                text-[28px]
                                                font-text
                                                tracking-[-0.03em]
                                            "
                                        >
                                            ₹
                                            {total.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>
                                <Link
                                onClick={onClose}
                                href="/checkout"
                                    // type="button"
                                    // whileHover={{ scale: 1.01 }}
                                    // whileTap={{ scale: 0.98 }}
                                    className="
                                        flex
                                        h-[54px]
                                        w-full
                                        items-center
                                        justify-center
                                        gap-3
                                        rounded-full font-text
                                        bg-[#FFD91A]
                                        text-sm cursor-pointer
                                        font-semibold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#321714]
                                        shadow-[0_8px_24px_rgba(255,217,26,0.22)]
                                        transition-shadow
                                        duration-300
                                        hover:shadow-[0_12px_30px_rgba(255,217,26,0.3)]
                                    "
                                >
                                    Proceed to Checkout

                                    <ArrowRight
                                        className="h-4 w-4"
                                        strokeWidth={2}
                                    />
                                </Link>

                            </div>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}

function EmptyCart() {
    return (
        <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <div
                className="
                    relative
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F3EBDD]
                "
            >
                <ShoppingBag
                    className="h-8 w-8 text-[#321714]/40"
                    strokeWidth={1.3}
                />

                <span
                    className="
                        absolute
                        right-2
                        top-2
                        text-lg
                        text-[#E9B800]
                    "
                >
                    ✦
                </span>
            </div>

            <h3 className="mt-6 font-text font-serif text-[25px]">
                Your bag is waiting
            </h3>

            <p className="mt-2 font-text max-w-[250px] text-[11px] leading-relaxed text-[#321714]/45">
                Nothing delicious here yet. Find something you love
                and we’ll keep it safe for you.
            </p>
        </div>
    );
}

