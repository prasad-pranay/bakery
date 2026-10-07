"use client";
import React, { useEffect } from 'react'
import BlobButton from './ordernow'
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore';
import AuthPage from './authPage';
import SplashPage from './splash';
import CartDrawer from './cartPage';
import OrderModal from './OrdersModal';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { div } from 'framer-motion/client';
import { usePathname } from 'next/navigation';


const Header = () => {
    const paths = {
        "/": "bakery",
        "/items": "bakery",
        "/order": "orders",
        "/about": "about",
        "/contact": "contact",
        "/logout": "logout",
    }
    const {  user, cart, toggleShowCart, showCart, } = useAuthStore();

    const [loginPage, setLoginPage] = React.useState(false);
    // const [splashPage, setSplashPage] = React.useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setSplashPage(false);
    //     }, 2000)
    //     return () => clearTimeout(timer);
    // }, [])

    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = React.useState(false);


    return (
        <>
            {pathname!="/checkout" && <header className="sticky top-0 z-[1000] relative flex items-center justify-between gap-4 bg-[var(--background)] px-5 py-4 backdrop-blur-sm sm:px-7 lg:px-10 lg:py-5">
                {/* Logo */}
                <Link href="/" onClick={()=>setMenuOpen(false)}>
                    <div className="shrink-0 font-title text-2xl font-medium uppercase sm:text-3xl">
                        sweetreats<span className="text-[#FF6E31]">.</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-6 lg:flex xl:gap-10 2xl:gap-16">
                    <li className={`${((pathname=="/" && user) || pathname=="/items")  && 'text-[#ff6e31]'}`}>
                        <Link
                            href={user ? "/" : "/items"}
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            Bakery
                        </Link>
                    </li>

                   {user && <li className={`${pathname=="/order" && 'text-[#ff6e31]'}`}>
                        <Link
                            href="/order"
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            Orders
                        </Link>
                    </li>}


                    {!user && <li className={`${pathname=="/about" && 'text-[#ff6e31]'}`}>
                        <Link
                            href="/about"
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            About Me
                        </Link>
                    </li>}
                    {user && <li className={`${pathname=="/about" && 'text-[#ff6e31]'}`}>
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            Profile
                        </Link>
                    </li>}
                    <li className={`${pathname=="/contact" && 'text-[#ff6e31]'}`}>
                        <Link
                            href="/contact"
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            {user ? "Help":"Contact"}
                        </Link>
                    </li>
                    {user && <li className={`${pathname=="/logout" && 'text-[#ff6e31]'}`}>
                        <Link
                            href="/logout"
                            className="flex items-center gap-2 whitespace-nowrap font-header text-base font-bold uppercase xl:text-lg"
                        >
                            Log Out
                        </Link>
                    </li>}
                </ul>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">

                    {!user && (
                        <div
                            onClick={() => setLoginPage(prev => !prev)}
                            className="cursor-pointer"
                        >
                            <BlobButton className="uppercase font-title text-xs tracking-wider sm:text-sm">
                                Login
                            </BlobButton>
                        </div>
                    )}

                    {user && (
                        <div
                            onClick={() => toggleShowCart()}
                            className="relative cursor-pointer rounded-full bg-white p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                        >
                            <ShoppingBag size={20} />

                            {cart.length !== 0 && (
                                <p className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffd91a] text-[10px] font-semibold text-black">
                                    {cart.length}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] lg:hidden"
                        aria-label="Open menu"
                    >
                        {menuOpen ?
                            <X size={22} strokeWidth={2.5} /> :
                            <Menu size={22} strokeWidth={2.5} />}
                    </button>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            data-lenis-prevent
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="
                absolute
                left-0
                top-[100%]
                z-40
                h-[calc(100dvh-80px)]
                w-full
                overflow-y-auto
                overscroll-contain
                bg-[var(--background)]
                lg:hidden
            "
                        >
                            <div className="flex min-h-full flex-col px-5 pb-8 pt-6 sm:px-8">

                                {/* ------------------------------------------------
                    TOP INTRO
                ------------------------------------------------ */}
                                <div className="mb-8 flex items-end justify-between border-b border-[#321714]/15 pb-5">
                                    <div>

                                        <h2 className="font-text font-bold text-3xl uppercase leading-none tracking-tight sm:text-4xl">
                                            What are you
                                            <br />
                                            craving?
                                        </h2>
                                    </div>

                                    <span className="mb-1 font-title text-4xl font-black text-[#FFD91A]">
                                        ?
                                    </span>
                                </div>

                                {/* ------------------------------------------------
                    NAVIGATION
                ------------------------------------------------ */}
                                <nav>
                                    <ul className="divide-y divide-[#321714]/15">

                                        {/* Bakery */}
                                        <li>
                                            <Link
                                                href={user ? "/" : "/items"}
                                                onClick={() => setMenuOpen(false)}
                                                className="
                                    group
                                    flex
                                    items-center
                                    justify-between
                                    py-5
                                    transition-transform
                                    active:translate-x-1
                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-text text-[10px] font-bold text-[#321714]/35">
                                                        01
                                                    </span>

                                                    <span className="font-header text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                                                        Bakery
                                                    </span>
                                                </div>

                                                <span className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#FFD91A]
                                    text-lg
                                    transition-transform
                                    group-hover:rotate-45
                                ">
                                                    ↗
                                                </span>
                                            </Link>
                                        </li>

                                        {/* Orders */}
                                        <li>
                                            <Link
                                                href="/order"
                                                onClick={() => setMenuOpen(false)}
                                                className="
                                    group
                                    flex
                                    items-center
                                    justify-between
                                    py-5
                                    transition-transform
                                    active:translate-x-1
                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-text text-[10px] font-bold text-[#321714]/35">
                                                        02
                                                    </span>

                                                    <span className="font-header text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                                                        Orders
                                                    </span>
                                                </div>

                                                <span className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#321714]/20
                                    text-lg
                                    transition-all
                                    group-hover:border-[#321714]
                                    group-hover:translate-x-1
                                ">
                                                    →
                                                </span>
                                            </Link>
                                        </li>

                                        {/* About */}
                                        <li>
                                            <Link
                                                href="/about"
                                                onClick={() => setMenuOpen(false)}
                                                className="
                                    group
                                    flex
                                    items-center
                                    justify-between
                                    py-5
                                    transition-transform
                                    active:translate-x-1
                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-text text-[10px] font-bold text-[#321714]/35">
                                                        03
                                                    </span>

                                                    <span className="font-header text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                                                        About Me
                                                    </span>
                                                </div>

                                                <span className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#321714]/20
                                    text-lg
                                    transition-all
                                    group-hover:border-[#321714]
                                    group-hover:translate-x-1
                                ">
                                                    →
                                                </span>
                                            </Link>
                                        </li>

                                        {/* Contact */}
                                        <li>
                                            <Link
                                                href="/contact"
                                                onClick={() => setMenuOpen(false)}
                                                className="
                                    group
                                    flex
                                    items-center
                                    justify-between
                                    py-5
                                    transition-transform
                                    active:translate-x-1
                                "
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-text text-[10px] font-bold text-[#321714]/35">
                                                        04
                                                    </span>

                                                    <span className="font-header text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                                                        Contact
                                                    </span>
                                                </div>

                                                <span className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#321714]/20
                                    text-lg
                                    transition-all
                                    group-hover:border-[#321714]
                                    group-hover:translate-x-1
                                ">
                                                    →
                                                </span>
                                            </Link>
                                        </li>

                                        {/* Logout */}
                                        {user && (
                                            <li>
                                                <Link
                                                    href="/logout"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        py-5
                                        transition-transform
                                        active:translate-x-1
                                    "
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-text text-[10px] font-bold text-[#321714]/35">
                                                            05
                                                        </span>

                                                        <span className="font-header text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
                                                            Log Out
                                                        </span>
                                                    </div>

                                                    <span className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#321714]/20
                                        text-lg
                                    ">
                                                        →
                                                    </span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </nav>

                                {/* ------------------------------------------------
                    BOTTOM AREA
                ------------------------------------------------ */}
                                <div className="mt-auto pt-12">

                                    <div className="relative overflow-hidden rounded-[24px] bg-[#FFD91A] px-5 py-5">
                                        {/* decorative circle */}
                                        <div className="
                            absolute
                            -right-8
                            -top-8
                            h-24
                            w-24
                            rounded-full
                            border-[10px]
                            border-[#321714]/10"
                                        />

                                        <div className="relative">
                                            <p className="font-text text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
                                                Freshly made
                                            </p>

                                            <p className="mt-1 max-w-[260px] font-title text-xl font-black uppercase leading-tight">
                                                A little sweetness goes a long way.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="font-text text-[10px] font-bold uppercase tracking-[0.15em] text-[#321714]/40">
                                            Sweetreats Bakery
                                        </span>

                                        <span className="text-lg">
                                            ✦
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


            </header>}
            {loginPage && <AuthPage onClose={() => setLoginPage(false)} />}
            {/* {splashPage && <SplashPage />} */}
            <CartDrawer
                isOpen={showCart}
                onClose={toggleShowCart}
            />

            {/* <OrderModal
  order={orders}
  open={showOrders}
  onClose={() => toggleShowOrders()}
/> */}
        </>
    )
}

export default Header