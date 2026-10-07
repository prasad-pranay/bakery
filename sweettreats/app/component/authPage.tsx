"use client";

import {
    useState,
    useEffect,
    useRef,
    type FormEvent,
} from "react";

import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import {
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronLeft,
    Eye,
    EyeOff,
    Heart,
    LockKeyhole,
    Mail,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type AuthMode = "signin" | "signup";

type FormValues = {
    name: string;
    email: string;
    password: string;
};

type AuthPageProps = {
    onSubmit?: (
        mode: AuthMode,
        values: FormValues
    ) => Promise<void> | void;

    onGoogleSignIn?: () => void;
    onAppleSignIn?: () => void;
    onClose: () => void;

};

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
};

const ease = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AuthPage({
    onGoogleSignIn,
    onAppleSignIn,
    onClose,
}: AuthPageProps) {
    const [mode, setMode] = useState<AuthMode>("signin");

    const [values, setValues] =
        useState<FormValues>(initialValues);

    const [showPassword, setShowPassword] =
        useState(false);

    const [rememberMe, setRememberMe] =
        useState(true);

    const [acceptedTerms, setAcceptedTerms] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [transitioning, setTransitioning] =
        useState(false);

    const [doorSide, setDoorSide] =
        useState<"left" | "right">("left");

    const [forgotPassword, setForgotPassword] =
        useState(false);

    const [showTerms, setShowTerms] =
        useState(false);

    const prefersReducedMotion = useReducedMotion();

    const timerRef = useRef<ReturnType<
        typeof setTimeout
    > | null>(null);

    const isSignup = mode === "signup";

    /* ---------------------------------------------------------------------- */
    /* CLEANUP                                                                */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /* CHANGE MODE: STORYBOOK DOOR TRANSITION                                 */
    /* ---------------------------------------------------------------------- */

    const switchMode = (nextMode: AuthMode) => {
        if (
            nextMode === mode ||
            transitioning ||
            loading
        ) {
            return;
        }

        setError("");
        setSuccess("");

        if (prefersReducedMotion) {
            setMode(nextMode);
            return;
        }

        setDoorSide(
            nextMode === "signup" ? "left" : "right"
        );

        setTransitioning(true);

        // The illustrated door closes, changes the form,
        // then opens to reveal the new experience.
        timerRef.current = setTimeout(() => {
            setMode(nextMode);

            timerRef.current = setTimeout(() => {
                setTransitioning(false);
            }, 430);
        }, 390);
    };

    /* ---------------------------------------------------------------------- */
    /* FORM HANDLING                                                          */
    /* ---------------------------------------------------------------------- */

    const updateField = (
        field: keyof FormValues,
        value: string
    ) => {
        setValues((current) => ({
            ...current,
            [field]: value,
        }));

        setError("");
        setSuccess("");
    };


     async function onSubmit(mode: AuthMode, values: FormValues) {
        // console.log("Form submitted:", mode, values);
        if(mode==="signin"){
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "email": values.email,
                    "password": values.password,
                }),
            });
            const data = await response.json();
            return data;
        }else{
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": values.name,
                    "email": values.email,
                    "password": values.password,
                }),
            });
            const data = await response.json();
            return data;
        }

    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!values.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                values.email
            )
        ) {
            setError("That email address doesn't look right.");
            return;
        }

        if (values.password.length < 8 && forgotPassword) {
            setError(
                "Your password must be at least 8 characters."
            );
            return;
        }

        if (isSignup && !values.name.trim()) {
            setError("What should we call you?");
            return;
        }

        if (isSignup && !acceptedTerms) {
            setError(
                "Please accept the terms to create your account."
            );
            return;
        }

        if (!onSubmit) {
            setError(
                "Authentication isn't connected yet. Connect your sign-in API to continue."
            );
            return;
        }

        try {
            setLoading(true);

            const value = await onSubmit(mode, values);
            if(value.success){

                setSuccess(
                    isSignup
                    ? "Your account request was successful!"
                    : "Welcome back!"
                );

                setTimeout(() => {
                    location.reload();
                }, 500);
            }else{
                setError(value.message);
            }
        } catch {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                values.email
            )
        ) {
            setError(
                "Enter your email address first so we know where to send the reset link."
            );
            return;
        }

        try{
            
            const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/forgot-password", {
                    method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    email:values.email
                })
            });
            const data = await (await response).json()
            if(data.success){
                setError("")
                setValiForToken(true)
            }else{
                setError(data.message)
            }
        }catch(error){
            setError(`${error}`)
        }
    };

    const forgotTokenValidation = async(event: FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
            try{
            const response = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/auth/reset-password", {
                    method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    token: tokenValue.token,
                    newPassword: tokenValue.newPassword
                })
            });
            const data = await (await response).json()
            if(data.success){
                setValiForToken(false)
                setForgotPassword(false);
                                            setError("");
            }else{
                setError(data.message)
            }
        }catch(error){
            setError(`${error}`)
        }
    }
    const [valiForToken,setValiForToken] = useState(false)
    const [tokenValue,setTokenValue] = useState({
        "token":"",
        'newPassword':""
    })

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="fixed inset-0 z-[5000]" data-lenis-prevent>
    <main  className="relative flex h-dvh w-screen items-center justify-center overflow-hidden bg-[#351A16]/10 p-2 backdrop-blur-lg sm:p-4 lg:p-6">
        {/* Close backdrop */}
        <div
            onClick={onClose}
            className="absolute inset-0"
        />

        {/* ================================================================
            MAIN AUTH CARD
        ================================================================= */}
        <section
            className="
                relative z-10
                grid
                h-full
                w-full
                max-w-[1330px]
                overflow-hidden
                rounded-[24px]
                border border-white/80
                bg-[#FCF9F4]
                shadow-[0_30px_100px_rgba(53,26,22,0.09)]

                sm:h-[94dvh]
                sm:max-h-[900px]
                sm:rounded-[30px]

                lg:grid-cols-[1.05fr_0.95fr]
                lg:rounded-[38px]
            "
        >
            {/* ============================================================
                LEFT STORY PANEL
            ============================================================= */}
            <motion.aside
                layout
                className="
                    relative
                    hidden
                    overflow-hidden
                    bg-[#F7F0E7]

                    lg:flex
                    lg:min-h-0
                    lg:flex-col
                    lg:p-12
                "
            >
                {/* Logo */}
                <div className="flex items-center font-title text-2xl font-medium uppercase sm:text-3xl">
                    sweetreats
                    <span className="text-[#FF6E31]">.</span>
                </div>

                {/* Rotating story content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{
                            opacity: 0,
                            x: prefersReducedMotion ? 0 : -14,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            x: prefersReducedMotion ? 0 : 12,
                        }}
                        transition={{
                            duration: 0.35,
                            ease,
                        }}
                        className="
                            relative
                            z-20
                            mt-12
                            max-w-[440px]
                            xl:mt-16
                        "
                    >
                        <div className="font-title text-[52px] font-black leading-[0.95] tracking-[2px] xl:text-[64px]">
                            {isSignup ? (
                                <>
                                    LET&apos;S
                                    <br />
                                    MAKE LIFE
                                    <br />
                                    <span className="relative inline-block">
                                        SWEETER.

                                        <motion.span
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.2,
                                            }}
                                            className="
                                                absolute
                                                -bottom-2
                                                left-0
                                                h-2
                                                w-full
                                                origin-left
                                                rounded-full
                                                bg-[#F4CC16]
                                            "
                                        />
                                    </span>
                                </>
                            ) : (
                                <div className="flex flex-col leading-[0.9]">
                                    <p className="-rotate-10">GOOD</p>
                                    <p className="-rotate-10">FOOD</p>
                                    <p className="-rotate-10">BRINGS</p>
                                    <p className="-rotate-10">PEOPLE</p>
                                    <p className="-rotate-10">TOGETHER.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Cookie illustration */}
                <div className="absolute bottom-0 right-0 z-10 w-full">
                    <img
                        src="/sign-in.jpg"
                        alt="Freshly baked chocolate chip cookies"
                        className="
                            ml-auto
                            w-[65%]
                            max-w-[620px]
                            object-cover
                            object-center
                            drop-shadow-[0_22px_20px_rgba(53,26,22,0.13)]
                        "
                    />
                </div>
            </motion.aside>

            {/* ============================================================
                RIGHT FORM PANEL
            ============================================================= */}
            <div
                className="
                    relative
                    flex
                    min-w-0
                    min-h-0
                    flex-col
                    overflow-y-auto
                    overscroll-contain
                    bg-[#FCF9F4]
                    px-4
                    py-6

                    sm:px-8
                    sm:py-8

                    md:px-12
                    md:py-10

                    lg:justify-center
                    lg:overflow-y-auto
                    lg:px-14
                    xl:px-20
                "
            >
                {/* Mobile logo / story header */}
                <div className="mb-7 lg:hidden">
                    <div className="flex items-center font-title text-2xl font-medium uppercase sm:text-3xl">
                        sweetreats
                        <span className="text-[#FF6E31]">.</span>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[20px] bg-[#F7F0E7] px-5 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <p className="max-w-[250px] font-title text-xl font-black leading-tight sm:text-2xl">
                                {isSignup
                                    ? "LET'S MAKE LIFE SWEETER."
                                    : "GOOD FOOD BRINGS PEOPLE TOGETHER."}
                            </p>

                            <img
                                src="/sign-in.jpg"
                                alt=""
                                aria-hidden="true"
                                className="
                                    h-20
                                    w-24
                                    shrink-0
                                    rounded-xl
                                    object-cover
                                    sm:h-24
                                    sm:w-28
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    FORM CONTENT
                ========================================================= */}
                <div className="mx-auto w-full max-w-[520px]">
                    {/* Form heading */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`heading-${mode}-${forgotPassword}`}
                            initial={{
                                opacity: 0,
                                y: prefersReducedMotion ? 0 : 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: prefersReducedMotion ? 0 : -8,
                            }}
                            transition={{
                                duration: 0.25,
                                ease,
                            }}
                            className="mb-6 mt-1 sm:mb-8"
                        >
                            <h2
                                className="
                                    font-title
                                    text-[28px]
                                    leading-tight
                                    tracking-[1px]

                                    sm:text-[36px]

                                    md:text-[40px]
                                "
                            >
                                {forgotPassword
                                    ? "Forgot your password?"
                                    : isSignup
                                      ? "Create Account"
                                      : "Welcome Back!"}
                            </h2>
                        </motion.div>
                    </AnimatePresence>

                    {/* Sign-in / Sign-up switch */}
                    {!forgotPassword && (
                        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-[#F0E8DC] p-1 sm:mb-8">
                            {(
                                [
                                    ["signin", "Sign In"],
                                    ["signup", "Sign Up"],
                                ] as const
                            ).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => switchMode(value)}
                                    disabled={transitioning || loading}
                                    className="
                                        relative
                                        min-h-[44px]
                                        rounded-xl
                                        px-3
                                        py-2.5
                                        text-xs
                                        font-title
                                        tracking-wider
                                        transition-colors
                                        disabled:cursor-wait
                                    "
                                >
                                    {mode === value && (
                                        <motion.span
                                            layoutId="auth-tab"
                                            transition={{
                                                type: "spring",
                                                stiffness: 360,
                                                damping: 30,
                                            }}
                                            className="absolute inset-0 rounded-xl bg-[#FFD91A] shadow-sm"
                                        />
                                    )}

                                    <span className="relative z-10">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ====================================================
                        FORM
                    ==================================================== */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${mode}-${forgotPassword}`}
                            initial={{
                                opacity: 0,
                                y: prefersReducedMotion ? 0 : 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: prefersReducedMotion ? 0 : -8,
                            }}
                            transition={{
                                duration: 0.28,
                                ease,
                            }}
                        >
                            <form
                                onSubmit={
                                    valiForToken? forgotTokenValidation :
                                    forgotPassword
                                        ? handleForgotPassword
                                        : handleSubmit
                                }
                                className="space-y-4"
                            >
                                {/* Full name */}
                                {isSignup && !forgotPassword && (
                                    <InputField
                                        label="Full name"
                                        icon={<UserRound size={18} />}
                                        placeholder="What should we call you?"
                                        autoComplete="name"
                                        value={values.name}
                                        onChange={(value) =>
                                            updateField("name", value)
                                        }
                                    />
                                )}

                                {/* Email */}
                                {!valiForToken && <InputField
                                    label="Email address"
                                    icon={<Mail size={18} />}
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={values.email}
                                    onChange={(value) =>
                                        updateField("email", value)
                                    }
                                />}
                                {/* for new password - TOKEN */}
                                {valiForToken && <InputField
                                    label="Token value"
                                    icon={<Mail size={18} />}
                                    type="text"
                                    placeholder="Enter the token recieved..."
                                    value={tokenValue.token}
                                    onChange={(value) =>
                                        setTokenValue(prev=>({...prev,"token":value}))
                                    }
                                    />}
                                    {/* for new password - NEW PASSWORD */}
                                {valiForToken && <InputField
                                    label="New Password"
                                    icon={<Mail size={18} />}
                                    type="text"
                                    placeholder="Enter new password"
                                    value={tokenValue.newPassword}
                                    onChange={(value) =>
                                        setTokenValue(prev=>({...prev,"newPassword":value}))
                                    }
                                />}

                                {/* Password */}
                                {!forgotPassword && (
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="
                                                mb-2
                                                block
                                                font-text
                                                text-[11px]
                                                font-semibold
                                                tracking-[1px]
                                            "
                                        >
                                            Password
                                        </label>

                                        <div
                                            className="
                                                group
                                                flex
                                                min-h-[52px]
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-[#351A16]/10
                                                bg-white/50
                                                px-3.5
                                                transition-all

                                                focus-within:border-[#D8B820]
                                                focus-within:bg-white
                                                focus-within:ring-4
                                                focus-within:ring-[#F4CC16]/10

                                                sm:min-h-[54px]
                                                sm:px-4
                                            "
                                        >
                                            <LockKeyhole
                                                size={18}
                                                className="
                                                    shrink-0
                                                    text-[#351A16]/45
                                                    transition-colors
                                                    group-focus-within:text-[#351A16]
                                                "
                                            />

                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                autoComplete={
                                                    isSignup
                                                        ? "new-password"
                                                        : "current-password"
                                                }
                                                placeholder={
                                                    isSignup
                                                        ? "Create a strong password"
                                                        : "Enter your password"
                                                }
                                                value={values.password}
                                                onChange={(event) =>
                                                    updateField(
                                                        "password",
                                                        event.target.value
                                                    )
                                                }
                                                className="
                                                    min-w-0
                                                    flex-1
                                                    bg-transparent
                                                    text-sm
                                                    outline-none
                                                    placeholder:text-[#351A16]/35
                                                "
                                            />

                                            <button
                                                type="button"
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                onClick={() =>
                                                    setShowPassword(
                                                        (value) => !value
                                                    )
                                                }
                                                className="
                                                    shrink-0
                                                    p-1
                                                    text-[#351A16]/45
                                                    transition-colors
                                                    hover:text-[#351A16]
                                                "
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={17} />
                                                ) : (
                                                    <Eye size={17} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Remember / forgot */}
                                {!isSignup && !forgotPassword && (
                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            justify-between
                                            gap-3
                                            py-1
                                        "
                                    >
                                        <label className="flex cursor-pointer items-center gap-2 font-text text-[11px] font-semibold">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(event) =>
                                                    setRememberMe(
                                                        event.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 accent-[#E9C500]"
                                            />

                                            Remember me
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setForgotPassword(true);
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="
                                                text-[11px]
                                                font-bold
                                                underline
                                                decoration-[#D8B820]
                                                underline-offset-4
                                                hover:text-[#A94A2F]
                                            "
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                {/* Terms */}
                                {isSignup && !forgotPassword && (
                                    <label
                                        className="
                                            flex
                                            cursor-pointer
                                            items-start
                                            gap-2.5
                                            py-1
                                            text-[11px]
                                            leading-5
                                            text-[#351A16]/65
                                        "
                                    >
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(event) =>
                                                setAcceptedTerms(
                                                    event.target.checked
                                                )
                                            }
                                            className="mt-1 h-4 w-4 shrink-0 accent-[#E9C500]"
                                        />

                                        <span>
                                            I agree to the{" "}
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setShowTerms(true);
                                                }}
                                                className="font-bold text-[#351A16] underline underline-offset-2"
                                            >
                                                Terms & Conditions
                                            </button>{" "}
                                            and{" "}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowTerms(true)
                                                }
                                                className="font-bold text-[#351A16] underline underline-offset-2"
                                            >
                                                Privacy Policy
                                            </button>
                                            .
                                        </span>
                                    </label>
                                )}

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            role="alert"
                                            className="overflow-hidden"
                                        >
                                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
                                                {error}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Success */}
                                <AnimatePresence>
                                    {success && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: 5,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            role="status"
                                            className="
                                                rounded-xl
                                                border
                                                border-green-200
                                                bg-green-50
                                                px-4
                                                py-3
                                                text-xs
                                                leading-5
                                                text-green-800
                                            "
                                        >
                                            <span className="mr-2 inline-flex align-middle">
                                                <Check size={15} />
                                            </span>

                                            {success}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Primary action */}
                                <motion.button
                                    whileHover={
                                        prefersReducedMotion
                                            ? undefined
                                            : { y: -2 }
                                    }
                                    whileTap={{ scale: 0.985 }}
                                    disabled={loading || transitioning}
                                    type="submit"
                                    className="
                                        group
                                        flex
                                        min-h-[54px]
                                        w-full
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        gap-3
                                        rounded-full
                                        bg-[#FFD91A]
                                        px-5
                                        text-sm
                                        font-black
                                        transition-colors

                                        hover:bg-[#FFE34C]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-60

                                        sm:min-h-[58px]
                                    "
                                >
                                    {loading ? (
                                        <>
                                            <motion.span
                                                animate={{
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="
                                                    h-4
                                                    w-4
                                                    rounded-full
                                                    border-2
                                                    border-[#351A16]/25
                                                    border-t-[#351A16]
                                                "
                                            />

                                            Just a moment...
                                        </>
                                    ) : (
                                        <>
                                            {valiForToken? "Submit Request" : forgotPassword
                                                ? "Send Reset Link"
                                                : isSignup
                                                  ? "Create My Account"
                                                  : "Sign In"}

                                            <ArrowRight
                                                size={18}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </>
                                    )}
                                </motion.button>

                                {/* Back */}
                                {forgotPassword && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotPassword(false);
                                            setValiForToken(false)
                                            setError("");
                                        }}
                                        className="
                                            w-full
                                            py-2
                                            text-xs
                                            font-bold
                                            text-[#351A16]/65
                                            transition-colors
                                            hover:text-[#351A16]
                                        "
                                    >
                                        Back to sign in
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ============================================================
                FOLDING DOOR TRANSITION
            ============================================================= */}
            <AnimatePresence>
                {transitioning && (
                    <motion.div
                        key="bakery-door"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: 0.22,
                            },
                        }}
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-50
                            overflow-hidden
                        "
                        aria-hidden="true"
                    >
                        {/* Chocolate interior */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: 0.82,
                                times: [0, 0.35, 0.65, 1],
                                ease,
                            }}
                            style={{
                                transformOrigin:
                                    doorSide === "left"
                                        ? "left center"
                                        : "right center",
                            }}
                            className="absolute inset-0 bg-[#351A16]"
                        />

                        {/* Cream folding panel */}
                        <motion.div
                            initial={{
                                scaleX: 0,
                                rotateY:
                                    doorSide === "left" ? -75 : 75,
                            }}
                            animate={{
                                scaleX: [0, 1, 1, 0],
                                rotateY:
                                    doorSide === "left"
                                        ? [-75, 0, 0, 75]
                                        : [75, 0, 0, -75],
                            }}
                            transition={{
                                duration: 0.82,
                                times: [0, 0.3, 0.7, 1],
                                ease,
                            }}
                            style={{
                                transformOrigin:
                                    doorSide === "left"
                                        ? "left center"
                                        : "right center",
                                transformStyle: "preserve-3d",
                                backfaceVisibility: "hidden",
                            }}
                            className="
                                absolute
                                inset-y-0
                                w-full
                                border-x
                                border-[#E5D5C4]
                                bg-[#F5EEE5]
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-3
                                    flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-[22px]
                                    border
                                    border-[#351A16]/10

                                    sm:inset-6
                                    sm:rounded-[30px]

                                    lg:inset-8
                                    lg:rounded-[35px]
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        h-48
                                        w-48
                                        rounded-full
                                        bg-[#FFD91A]

                                        sm:h-64
                                        sm:w-64

                                        lg:h-80
                                        lg:w-80
                                    "
                                />

                                <div className="relative z-10 px-6 text-center">
                                    <motion.div
                                        animate={{
                                            rotate: [0, -8, 8, 0],
                                        }}
                                        transition={{
                                            duration: 0.7,
                                        }}
                                        className="
                                            mb-4
                                            text-6xl

                                            sm:mb-5
                                            sm:text-8xl
                                        "
                                    >
                                        🍪
                                    </motion.div>

                                    <p className="font-text font-semibold text-base uppercase tracking-[0.25em] sm:text-sm">
                                        {isSignup
                                            ? "Something sweet awaits"
                                            : "Welcome back, friend"}
                                    </p>

                                    <p className="mt-3 text-[11px] font-text font-normal text-[#351A16]/55 sm:text-sm">
                                        A little sweetness goes a long way.
                                    </p>

                                    <div className="mx-auto mt-5 flex items-center justify-center gap-1">
                                        {[0, 1, 2].map((item) => (
                                            <motion.span
                                                key={item}
                                                animate={{
                                                    y: [0, -5, 0],
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: item * 0.12,
                                                    repeat: 1,
                                                }}
                                                className="h-1.5 w-1.5 rounded-full bg-[#351A16]"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>

        {/* ================================================================
            TERMS MODAL
        ================================================================= */}
        <AnimatePresence>
            {showTerms && (
                <>
                    <motion.button
                        aria-label="Close terms"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowTerms(false)}
                        className="fixed inset-0 z-[80] cursor-default bg-[#351A16]/40 backdrop-blur-sm"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="terms-heading"
                        initial={{
                            opacity: 0,
                            y: 16,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 12,
                            scale: 0.98,
                        }}
                        className="
                            fixed
                            left-1/2
                            top-1/2
                            z-[90]
                            max-h-[calc(100dvh-24px)]
                            w-[calc(100%-24px)]
                            max-w-lg
                            -translate-x-1/2
                            -translate-y-1/2
                            overflow-y-auto
                            rounded-[24px]
                            border
                            border-white
                            bg-[#FCF9F4]
                            p-5
                            shadow-2xl

                            sm:max-h-[calc(100dvh-40px)]
                            sm:w-[calc(100%-32px)]
                            sm:rounded-[28px]
                            sm:p-9
                        "
                    >
                        <button
                            onClick={() => setShowTerms(false)}
                            className="
                                absolute
                                right-3
                                top-3
                                rounded-full
                                p-2
                                transition-colors
                                hover:bg-[#351A16]/5

                                sm:right-5
                                sm:top-5
                            "
                            aria-label="Close dialog"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0A7]">
                            <Heart size={20} />
                        </div>

                        <h2
                            id="terms-heading"
                            className="pr-8 text-xl font-black tracking-tight sm:text-2xl"
                        >
                            A little housekeeping
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#351A16]/65">
                            Add your actual Terms & Conditions and Privacy
                            Policy content here before making account
                            registration available to users.
                        </p>

                        <button
                            onClick={() => setShowTerms(false)}
                            className="
                                mt-6
                                flex
                                min-h-[48px]
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                bg-[#FFD91A]
                                px-5
                                py-3.5
                                text-xs
                                font-black
                            "
                        >
                            GOT IT
                            <Check size={15} />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </main>
</div>
        // <div className="fixed z-[5000] top-0 left-0">
        //     <main className="relative  px-3 py-3 backdrop-blur-lg w-screen h-screen sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        //         <div  onClick={onClose} className="absolute inset-0" />

        //         {/* ---------------------------------------------------------------- */}
        //         {/* MAIN AUTH CARD                                                   */}
        //         {/* ---------------------------------------------------------------- */}

        //         <section className="relative mx-auto grid w-full max-w-[1330px] h-[90vh] overflow-scroll scrollbar-none rounded-[28px] border border-white/80 bg-[#FCF9F4] shadow-[0_30px_100px_rgba(53,26,22,0.09)] sm:rounded-[38px]  lg:grid-cols-[1.05fr_0.95fr]">

        //             {/* -------------------------------------------------------------- */}
        //             {/* LEFT STORY PANEL                                               */}
        //             {/* -------------------------------------------------------------- */}

        //             <motion.aside
        //                 layout
        //                 className="relative flex min-h-[360px] flex-col overflow-hidden bg-[#F7F0E7] p-6 sm:min-h-[410px] sm:p-9 lg:min-h-full lg:p-12"
        //             >
        //                 {/* Logo */}
        //                 <div className="font-title font-medium uppercase text-3xl text-center flex items-center">sweetreats<span className="text-[#FF6E31]">.</span></div>

        //                 {/* Rotating story content */}
        //                 <AnimatePresence mode="wait">
        //                     <motion.div
        //                         key={mode}
        //                         initial={{
        //                             opacity: 0,
        //                             x: prefersReducedMotion ? 0 : -14,
        //                         }}
        //                         animate={{
        //                             opacity: 1,
        //                             x: 0,
        //                         }}
        //                         exit={{
        //                             opacity: 0,
        //                             x: prefersReducedMotion ? 0 : 12,
        //                         }}
        //                         transition={{
        //                             duration: 0.35,
        //                             ease,
        //                         }}
        //                         className="relative z-20 mt-10 max-w-[440px] sm:mt-12 lg:mt-16"
        //                     >

        //                         <div className="font-title  text-[48px] font-black tracking-[2.8px] sm:text-[66px] lg:text-6xl">
        //                             {isSignup ? (
        //                                 <>
        //                                     LET&apos;S
        //                                     <br />
        //                                     MAKE LIFE
        //                                     <br />
        //                                     <span className="relative inline-block">
        //                                         SWEETER.
        //                                         <motion.span
        //                                             initial={{ scaleX: 0 }}
        //                                             animate={{ scaleX: 1 }}
        //                                             transition={{
        //                                                 duration: 0.5,
        //                                                 delay: 0.2,
        //                                             }}
        //                                             className="absolute -bottom-2 left-0 h-2 w-full origin-left rounded-full bg-[#F4CC16]"
        //                                         />
        //                                     </span>
        //                                 </>
        //                             ) : (
        //                                 <div className="flex flex-col leading-[60px]">
        //                                     <p className="-rotate-10">GOOD</p>
        //                                     {/* <br /> */}
        //                                     <p className="-rotate-10">FOOD</p>
        //                                     {/* <br /> */}
        //                                     <p className="-rotate-10">BRINGS</p>
        //                                     {/* <br /> */}
        //                                     <p className="-rotate-10">PEOPLE</p>
        //                                     {/* <br /> */}
        //                                     <p className="-rotate-10">TOGETHER.</p>
        //                                 </div>
        //                             )}
        //                         </div>

        //                     </motion.div>
        //                 </AnimatePresence>

        //                 {/* Main illustration */}
        //                 {/* Cookie illustration */}
        //                 <div
        //                     className="absolute z-10 w-full bottom-0 right-0"
        //                 >
        //                     <img
        //                         src="/sign-in.jpg"
        //                         alt="Freshly baked chocolate chip cookies"
        //                         className="ml-auto w-[70%] object-cover object-center drop-shadow-[0_22px_20px_rgba(53,26,22,0.13)] "
        //                     />

                          
        //                 </div>
        //             </motion.aside>

        //             {/* -------------------------------------------------------------- */}
        //             {/* RIGHT FORM PANEL                                               */}
        //             {/* -------------------------------------------------------------- */}

        //             <div className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-[#FCF9F4] px-5 py-9 sm:px-10 sm:py-12 lg:px-14 xl:px-20">


        //                 {/* Form heading */}
        //                 <AnimatePresence mode="wait">
        //                     <motion.div
        //                         key={`heading-${mode}-${forgotPassword}`}
        //                         initial={{
        //                             opacity: 0,
        //                             y: prefersReducedMotion ? 0 : 12,
        //                         }}
        //                         animate={{
        //                             opacity: 1,
        //                             y: 0,
        //                         }}
        //                         exit={{
        //                             opacity: 0,
        //                             y: prefersReducedMotion ? 0 : -8,
        //                         }}
        //                         transition={{
        //                             duration: 0.25,
        //                             ease,
        //                         }}
        //                         className="mb-7 mt-7 sm:mb-9 sm:mt-8"
        //                     >
                               
        //                         <h2 className="text-[32px] font-title tracking-[1.5px] sm:text-[40px]">
        //                             {forgotPassword
        //                                 ? "Forgot your password?"
        //                                 : isSignup
        //                                     ? "Create Account"
        //                                     : "Welcome Back!"}

                                 
        //                         </h2>

                              
        //                     </motion.div>
        //                 </AnimatePresence>

        //                 {/* Sign-in / Sign-up segmented switch */}
        //                 {!forgotPassword && (
        //                     <div className="mb-7 grid grid-cols-2 rounded-2xl bg-[#F0E8DC] sm:mb-8">
        //                         {(
        //                             [
        //                                 ["signin", "Sign In"],
        //                                 ["signup", "Sign Up"],
        //                             ] as const
        //                         ).map(([value, label]) => (
        //                             <button
        //                                 key={value}
        //                                 onClick={() => switchMode(value)}
        //                                 disabled={transitioning || loading}
        //                                 className="relative rounded-xl py-3 text-xs font-title tracking-wider transition-colors disabled:cursor-wait"
        //                             >
        //                                 {mode === value && (
        //                                     <motion.span
        //                                         layoutId="auth-tab"
        //                                         transition={{
        //                                             type: "spring",
        //                                             stiffness: 360,
        //                                             damping: 30,
        //                                         }}
        //                                         className="absolute inset-0 rounded-xl bg-[#FFD91A] shadow-sm"
        //                                     />
        //                                 )}

        //                                 <span className="relative z-10">
        //                                     {label}
        //                                 </span>
        //                             </button>
        //                         ))}
        //                     </div>
        //                 )}

        //                 {/* ---------------------------------------------------------------- */}
        //                 {/* FORM                                                             */}
        //                 {/* ---------------------------------------------------------------- */}

        //                 <AnimatePresence mode="wait">
        //                     <motion.div
        //                         key={`${mode}-${forgotPassword}`}
        //                         initial={{
        //                             opacity: 0,
        //                             y: prefersReducedMotion ? 0 : 10,
        //                         }}
        //                         animate={{
        //                             opacity: 1,
        //                             y: 0,
        //                         }}
        //                         exit={{
        //                             opacity: 0,
        //                             y: prefersReducedMotion ? 0 : -8,
        //                         }}
        //                         transition={{
        //                             duration: 0.28,
        //                             ease,
        //                         }}
        //                     >
        //                         <form
        //                             onSubmit={
        //                                 forgotPassword
        //                                     ? handleForgotPassword
        //                                     : handleSubmit
        //                             }
        //                             className="space-y-4"
        //                         >
        //                             {/* Full name */}
        //                             {isSignup && !forgotPassword && (
        //                                 <InputField
        //                                     label="Full name"
        //                                     icon={<UserRound size={18} />}
        //                                     placeholder="What should we call you?"
        //                                     autoComplete="name"
        //                                     value={values.name}
        //                                     onChange={(value) =>
        //                                         updateField("name", value)
        //                                     }
        //                                 />
        //                             )}

        //                             {/* Email */}
        //                             <InputField
        //                                 label="Email address"
        //                                 icon={<Mail size={18} />}
        //                                 type="email"
        //                                 placeholder="you@example.com"
        //                                 autoComplete="email"
        //                                 value={values.email}
        //                                 onChange={(value) =>
        //                                     updateField("email", value)
        //                                 }
        //                             />

        //                             {/* Password */}
        //                             {!forgotPassword && (
        //                                 <div>
        //                                     <label
        //                                         htmlFor="password"
        //                                         className="mb-2 block text-[11px] font-text font-semibold tracking-[1px] "
        //                                     >
        //                                         Password
        //                                     </label>

        //                                     <div className="group flex h-[54px] items-center gap-3 rounded-2xl border border-[#351A16]/10 bg-white/50 px-4 transition-all focus-within:border-[#D8B820] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F4CC16]/10">
        //                                         <LockKeyhole
        //                                             size={18}
        //                                             className="shrink-0 text-[#351A16]/45 transition-colors group-focus-within:text-[#351A16]"
        //                                         />

        //                                         <input
        //                                             id="password"
        //                                             type={
        //                                                 showPassword ? "text" : "password"
        //                                             }
        //                                             autoComplete={
        //                                                 isSignup
        //                                                     ? "new-password"
        //                                                     : "current-password"
        //                                             }
        //                                             placeholder={
        //                                                 isSignup
        //                                                     ? "Create a strong password"
        //                                                     : "Enter your password"
        //                                             }
        //                                             value={values.password}
        //                                             onChange={(event) =>
        //                                                 updateField(
        //                                                     "password",
        //                                                     event.target.value
        //                                                 )
        //                                             }
        //                                             className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#351A16]/35"
        //                                         />

        //                                         <button
        //                                             type="button"
        //                                             aria-label={
        //                                                 showPassword
        //                                                     ? "Hide password"
        //                                                     : "Show password"
        //                                             }
        //                                             onClick={() =>
        //                                                 setShowPassword((value) => !value)
        //                                             }
        //                                             className="shrink-0 text-[#351A16]/45 transition-colors hover:text-[#351A16]"
        //                                         >
        //                                             {showPassword ? (
        //                                                 <EyeOff size={17} />
        //                                             ) : (
        //                                                 <Eye size={17} />
        //                                             )}
        //                                         </button>
        //                                     </div>

                                           
        //                                 </div>
        //                             )}

        //                             {/* Remember me / forgot password */}
        //                             {!isSignup && !forgotPassword && (
        //                                 <div className="flex items-center justify-between gap-3 py-1">
        //                                     <label className="flex cursor-pointer font-text font-semibold items-center gap-2 text-[11px] ">
        //                                         <input
        //                                             type="checkbox"
        //                                             checked={rememberMe}
        //                                             onChange={(event) =>
        //                                                 setRememberMe(
        //                                                     event.target.checked
        //                                                 )
        //                                             }
        //                                             className="h-4 w-4 accent-[#E9C500]"
        //                                         />

        //                                         Remember me
        //                                     </label>

        //                                     <button
        //                                         type="button"
        //                                         onClick={() => {
        //                                             setForgotPassword(true);
        //                                             setError("");
        //                                             setSuccess("");
        //                                         }}
        //                                         className="text-[11px] font-bold underline decoration-[#D8B820] underline-offset-4 hover:text-[#A94A2F]"
        //                                     >
        //                                         Forgot password?
        //                                     </button>
        //                                 </div>
        //                             )}

        //                             {/* Terms */}
        //                             {isSignup && !forgotPassword && (
        //                                 <label className="flex cursor-pointer items-start gap-2.5 py-1 text-[11px] leading-5 text-[#351A16]/65">
        //                                     <input
        //                                         type="checkbox"
        //                                         checked={acceptedTerms}
        //                                         onChange={(event) =>
        //                                             setAcceptedTerms(
        //                                                 event.target.checked
        //                                             )
        //                                         }
        //                                         className="mt-1 h-4 w-4 shrink-0 accent-[#E9C500]"
        //                                     />

        //                                     <span>
        //                                         I agree to the{" "}
        //                                         <button
        //                                             type="button"
        //                                             onClick={(event) => {
        //                                                 event.preventDefault();
        //                                                 setShowTerms(true);
        //                                             }}
        //                                             className="font-bold text-[#351A16] underline underline-offset-2"
        //                                         >
        //                                             Terms & Conditions
        //                                         </button>{" "}
        //                                         and{" "}
        //                                         <button
        //                                             type="button"
        //                                             onClick={() => setShowTerms(true)}
        //                                             className="font-bold text-[#351A16] underline underline-offset-2"
        //                                         >
        //                                             Privacy Policy
        //                                         </button>
        //                                         .
        //                                     </span>
        //                                 </label>
        //                             )}

        //                             {/* Error */}
        //                             <AnimatePresence>
        //                                 {error && (
        //                                     <motion.div
        //                                         initial={{
        //                                             opacity: 0,
        //                                             height: 0,
        //                                         }}
        //                                         animate={{
        //                                             opacity: 1,
        //                                             height: "auto",
        //                                         }}
        //                                         exit={{
        //                                             opacity: 0,
        //                                             height: 0,
        //                                         }}
        //                                         role="alert"
        //                                         className="overflow-hidden"
        //                                     >
        //                                         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
        //                                             {error}
        //                                         </div>
        //                                     </motion.div>
        //                                 )}
        //                             </AnimatePresence>

        //                             {/* Success */}
        //                             <AnimatePresence>
        //                                 {success && (
        //                                     <motion.div
        //                                         initial={{ opacity: 0, y: 5 }}
        //                                         animate={{ opacity: 1, y: 0 }}
        //                                         role="status"
        //                                         className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs leading-5 text-green-800"
        //                                     >
        //                                         <span className="mr-2 inline-flex align-middle">
        //                                             <Check size={15} />
        //                                         </span>
        //                                         {success}
        //                                     </motion.div>
        //                                 )}
        //                             </AnimatePresence>

        //                             {/* Primary action */}
        //                             <motion.button
        //                                 whileHover={
        //                                     prefersReducedMotion
        //                                         ? undefined
        //                                         : {
        //                                             y: -2,
        //                                         }
        //                                 }
        //                                 whileTap={{
        //                                     scale: 0.985,
        //                                 }}
        //                                 disabled={loading || transitioning}
        //                                 type="submit"
        //                                 className="group flex h-[58px] cursor-pointer w-full items-center justify-center gap-3 rounded-full  bg-[#FFD91A] px-6 text-sm font-black transition-colors hover:bg-[#FFE34C] disabled:cursor-not-allowed disabled:opacity-60"
        //                             >
        //                                 {loading ? (
        //                                     <>
        //                                         <motion.span
        //                                             animate={{ rotate: 360 }}
        //                                             transition={{
        //                                                 duration: 0.8,
        //                                                 repeat: Infinity,
        //                                                 ease: "linear",
        //                                             }}
        //                                             className="h-4 w-4 rounded-full border-2 border-[#351A16]/25 border-t-[#351A16]"
        //                                         />

        //                                         Just a moment...
        //                                     </>
        //                                 ) : (
        //                                     <>
        //                                         {forgotPassword
        //                                             ? "Send Reset Link"
        //                                             : isSignup
        //                                                 ? "Create My Account"
        //                                                 : "Sign In"}

        //                                         <ArrowRight
        //                                             size={18}
        //                                             className="transition-transform group-hover:translate-x-1"
        //                                         />
        //                                     </>
        //                                 )}
        //                             </motion.button>

        //                             {/* Return from password reset */}
        //                             {forgotPassword && (
        //                                 <button
        //                                     type="button"
        //                                     onClick={() => {
        //                                         setForgotPassword(false);
        //                                         setError("");
        //                                     }}
        //                                     className="w-full py-2 text-xs font-bold text-[#351A16]/65 transition-colors hover:text-[#351A16]"
        //                                 >
        //                                     Back to sign in
        //                                 </button>
        //                             )}
        //                         </form>
        //                     </motion.div>
        //                 </AnimatePresence>

        //                 {/* ---------------------------------------------------------------- */}
        //                 {/* SOCIAL LOGIN                                                     */}
        //                 {/* ---------------------------------------------------------------- */}

        //             </div>

        //             {/* -------------------------------------------------------------- */}
        //             {/* FOLDING DOOR TRANSITION                                        */}
        //             {/* -------------------------------------------------------------- */}

        //             <AnimatePresence>
        //                 {transitioning && (
        //                     <motion.div
        //                         key="bakery-door"
        //                         initial={{
        //                             opacity: 0,
        //                         }}
        //                         animate={{
        //                             opacity: 1,
        //                         }}
        //                         exit={{
        //                             opacity: 0,
        //                             transition: {
        //                                 duration: 0.22,
        //                             },
        //                         }}
        //                         className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
        //                         aria-hidden="true"
        //                     >
        //                         {/* Chocolate interior */}
        //                         <motion.div
        //                             initial={{
        //                                 scaleX: 0,
        //                             }}
        //                             animate={{
        //                                 scaleX: [0, 1, 1, 0],
        //                             }}
        //                             transition={{
        //                                 duration: 0.82,
        //                                 times: [0, 0.35, 0.65, 1],
        //                                 ease,
        //                             }}
        //                             style={{
        //                                 transformOrigin:
        //                                     doorSide === "left"
        //                                         ? "left center"
        //                                         : "right center",
        //                             }}
        //                             className="absolute inset-0 bg-[#351A16]"
        //                         />

        //                         {/* Cream folding panel */}
        //                         <motion.div
        //                             initial={{
        //                                 scaleX: 0,
        //                                 rotateY: doorSide === "left" ? -75 : 75,
        //                             }}
        //                             animate={{
        //                                 scaleX: [0, 1, 1, 0],
        //                                 rotateY:
        //                                     doorSide === "left"
        //                                         ? [-75, 0, 0, 75]
        //                                         : [75, 0, 0, -75],
        //                             }}
        //                             transition={{
        //                                 duration: 0.82,
        //                                 times: [0, 0.3, 0.7, 1],
        //                                 ease,
        //                             }}
        //                             style={{
        //                                 transformOrigin:
        //                                     doorSide === "left"
        //                                         ? "left center"
        //                                         : "right center",
        //                                 transformStyle: "preserve-3d",
        //                                 backfaceVisibility: "hidden",
        //                             }}
        //                             className="absolute inset-y-0 w-full border-x border-[#E5D5C4] bg-[#F5EEE5]"
        //                         >
        //                             {/* Door illustration */}
        //                             <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-[28px] border border-[#351A16]/10 sm:inset-8 sm:rounded-[35px]">
        //                                 <div className="absolute h-64 w-64 rounded-full bg-[#FFD91A] sm:h-80 sm:w-80" />

        //                                 <div className="relative z-10 text-center">
        //                                     <motion.div
        //                                         animate={{
        //                                             rotate: [0, -8, 8, 0],
        //                                         }}
        //                                         transition={{
        //                                             duration: 0.7,
        //                                         }}
        //                                         className="mb-5 text-6xl sm:text-8xl"
        //                                     >
        //                                         🍪
        //                                     </motion.div>

        //                                     <p className="text-xs font-title uppercase tracking-[0.25em] sm:text-sm">
        //                                         {isSignup
        //                                             ? "Something sweet awaits"
        //                                             : "Welcome back, friend"}
        //                                     </p>

        //                                     <p className="mt-3 text-[11px] font-text font-semibold text-[#351A16]/55 sm:text-sm">
        //                                         A little sweetness goes a long way.
        //                                     </p>

        //                                     <div className="mx-auto mt-5 flex items-center justify-center gap-1">
        //                                         {[0, 1, 2].map((item) => (
        //                                             <motion.span
        //                                                 key={item}
        //                                                 animate={{
        //                                                     y: [0, -5, 0],
        //                                                 }}
        //                                                 transition={{
        //                                                     duration: 0.5,
        //                                                     delay: item * 0.12,
        //                                                     repeat: 1,
        //                                                 }}
        //                                                 className="h-1.5 w-1.5 rounded-full bg-[#351A16]"
        //                                             />
        //                                         ))}
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </motion.div>
        //                     </motion.div>
        //                 )}
        //             </AnimatePresence>
        //         </section>

        //         {/* ---------------------------------------------------------------- */}
        //         {/* TERMS MODAL                                                      */}
        //         {/* ---------------------------------------------------------------- */}

        //         <AnimatePresence>
        //             {showTerms && (
        //                 <>
        //                     <motion.button
        //                         aria-label="Close terms"
        //                         initial={{ opacity: 0 }}
        //                         animate={{ opacity: 1 }}
        //                         exit={{ opacity: 0 }}
        //                         onClick={() => setShowTerms(false)}
        //                         className="fixed inset-0 z-[80] cursor-default bg-[#351A16]/40 backdrop-blur-sm"
        //                     />

        //                     <motion.div
        //                         role="dialog"
        //                         aria-modal="true"
        //                         aria-labelledby="terms-heading"
        //                         initial={{
        //                             opacity: 0,
        //                             y: 16,
        //                             scale: 0.97,
        //                         }}
        //                         animate={{
        //                             opacity: 1,
        //                             y: 0,
        //                             scale: 1,
        //                         }}
        //                         exit={{
        //                             opacity: 0,
        //                             y: 12,
        //                             scale: 0.98,
        //                         }}
        //                         className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white bg-[#FCF9F4] p-7 shadow-2xl sm:p-9"
        //                     >
        //                         <button
        //                             onClick={() => setShowTerms(false)}
        //                             className="absolute right-5 top-5 rounded-full p-2 transition-colors hover:bg-[#351A16]/5"
        //                             aria-label="Close dialog"
        //                         >
        //                             <X size={18} />
        //                         </button>

        //                         <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0A7]">
        //                             <Heart size={20} />
        //                         </div>

        //                         <h2
        //                             id="terms-heading"
        //                             className="text-2xl font-black tracking-tight"
        //                         >
        //                             A little housekeeping
        //                         </h2>

        //                         <p className="mt-4 text-sm leading-7 text-[#351A16]/65">
        //                             Add your actual Terms & Conditions and
        //                             Privacy Policy content here before making
        //                             account registration available to users.
        //                         </p>

        //                         <button
        //                             onClick={() => setShowTerms(false)}
        //                             className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD91A] px-5 py-3.5 text-xs font-black"
        //                         >
        //                             GOT IT
        //                             <Check size={15} />
        //                         </button>
        //                     </motion.div>
        //                 </>
        //             )}
        //         </AnimatePresence>
        //     </main>
        // </div>
    );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE INPUT                                                             */
/* -------------------------------------------------------------------------- */

function InputField({
    label,
    icon,
    type = "text",
    placeholder,
    autoComplete,
    value,
    onChange,
}: {
    label: string;
    icon: React.ReactNode;
    type?: string;
    placeholder: string;
    autoComplete?: string;
    value: string;
    onChange: (value: string) => void;
}) {
    const id = label
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-[11px] font-text font-semibold tracking-[1px] "
            >
                {label}
            </label>

            <div className="group flex h-[54px] items-center gap-3 rounded-2xl border border-[#351A16]/10 bg-white/50 px-4 transition-all focus-within:border-[#D8B820] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F4CC16]/10">
                <span className="shrink-0 text-[#351A16]/45 transition-colors group-focus-within:text-[#351A16]">
                    {icon}
                </span>

                <input
                    id={id}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#351A16]/35"
                />
            </div>
        </div>
    );
}

