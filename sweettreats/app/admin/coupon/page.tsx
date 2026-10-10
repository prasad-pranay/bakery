
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from "react";

import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Copy,
    Loader2,
    Plus,
    RefreshCw,
    Search,
    Tag,
    TicketPercent,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import AdminSidebar from "../sidebar";

/* =========================================================
   TYPES
========================================================= */

type DiscountType = "PERCENTAGE" | "FIXED";

type Coupon = {
    _id: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minimumOrderValue: number;
    maximumDiscount?: number;
    expiresAt: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

type CouponForm = {
    code: string;
    discountType: DiscountType;
    discountValue: string;
    minimumOrderValue: string;
    maximumDiscount: string;
    expiresAt: string;
    usageLimit: string;
};

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
).replace(/\/$/, "");

const EMPTY_FORM: CouponForm = {
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    minimumOrderValue: "0",
    maximumDiscount: "",
    expiresAt: "",
    usageLimit: "100",
};

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatDate(value?: string) {
    if (!value) return "No date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getCouponStatus(coupon: Coupon) {
    if (!coupon.isActive) return "Inactive";

    if (new Date(coupon.expiresAt).getTime() <= Date.now()) {
        return "Expired";
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        return "Limit reached";
    }

    return "Active";
}

function getDiscountLabel(coupon: Coupon) {
    return coupon.discountType === "PERCENTAGE"
        ? `${coupon.discountValue}% OFF`
        : `${formatCurrency(coupon.discountValue)} OFF`;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<CouponForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [copiedCode, setCopiedCode] = useState("");

    /* =========================================================
       FETCH COUPONS
    ========================================================= */

    const fetchCoupons = useCallback(async (manual = false) => {
        if (manual) setRefreshing(true);
        else setLoading(true);

        setError("");

        try {
            const response = await fetch(`${API_URL}/api/coupons`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message || "Unable to load coupons."
                );
            }

            const data = Array.isArray(result)
                ? result
                : result?.data ?? result?.coupons;

            if (!Array.isArray(data)) {
                throw new Error(
                    "Unexpected response from the coupons API."
                );
            }

            setCoupons(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void fetchCoupons();
    }, [fetchCoupons]);

    /* =========================================================
       STATISTICS
    ========================================================= */

    const stats = useMemo(() => {
        const now = Date.now();

        const active = coupons.filter(
            (coupon) =>
                coupon.isActive &&
                new Date(coupon.expiresAt).getTime() > now &&
                coupon.usedCount < coupon.usageLimit
        ).length;

        const expired = coupons.filter(
            (coupon) =>
                new Date(coupon.expiresAt).getTime() <= now
        ).length;

        const redemptions = coupons.reduce(
            (total, coupon) => total + (coupon.usedCount || 0),
            0
        );

        const totalLimits = coupons.reduce(
            (total, coupon) => total + (coupon.usageLimit || 0),
            0
        );

        return {
            total: coupons.length,
            active,
            expired,
            redemptions,
            totalLimits,
        };
    }, [coupons]);

    /* =========================================================
       FILTER
    ========================================================= */

    const filteredCoupons = useMemo(() => {
        const query = search.trim().toLowerCase();

        return coupons.filter((coupon) => {
            const matchesSearch =
                !query ||
                coupon.code.toLowerCase().includes(query) ||
                coupon.discountType.toLowerCase().includes(query);

            const status = getCouponStatus(coupon);

            const matchesStatus =
                statusFilter === "All" ||
                (statusFilter === "Active" && status === "Active") ||
                (statusFilter === "Expired" && status === "Expired") ||
                (statusFilter === "Inactive" && status === "Inactive") ||
                (statusFilter === "Limit reached" &&
                    status === "Limit reached");

            return matchesSearch && matchesStatus;
        });
    }, [coupons, search, statusFilter]);

    /* =========================================================
       FORM
    ========================================================= */

    function updateField<K extends keyof CouponForm>(
        key: K,
        value: CouponForm[K]
    ) {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));
    }

    function openModal() {
        setForm(EMPTY_FORM);
        setError("");
        setSuccess("");
        setShowModal(true);
    }

    function closeModal() {
        if (saving) return;

        setShowModal(false);
        setError("");
    }

    async function handleCreateCoupon(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const code = form.code.trim().toUpperCase();
        const discountValue = Number(form.discountValue);
        const minimumOrderValue = Number(form.minimumOrderValue || 0);
        const maximumDiscount =
            form.maximumDiscount.trim() === ""
                ? undefined
                : Number(form.maximumDiscount);
        const usageLimit = Number(form.usageLimit);
        const expiry = new Date(form.expiresAt);

        if (!/^[A-Z0-9_-]+$/.test(code)) {
            setError(
                "Use only letters, numbers, hyphens, and underscores in the code."
            );
            return;
        }

        if (!Number.isFinite(discountValue) || discountValue <= 0) {
            setError("Discount value must be greater than zero.");
            return;
        }

        if (
            form.discountType === "PERCENTAGE" &&
            discountValue > 100
        ) {
            setError("Percentage discount cannot exceed 100%.");
            return;
        }

        if (
            !Number.isFinite(minimumOrderValue) ||
            minimumOrderValue < 0
        ) {
            setError("Minimum order value cannot be negative.");
            return;
        }

        if (
            maximumDiscount !== undefined &&
            (!Number.isFinite(maximumDiscount) || maximumDiscount <= 0)
        ) {
            setError("Maximum discount must be greater than zero.");
            return;
        }

        if (
            form.discountType === "FIXED" &&
            maximumDiscount !== undefined
        ) {
            setError(
                "Maximum discount is only applicable to percentage coupons."
            );
            return;
        }

        if (
            !form.expiresAt ||
            Number.isNaN(expiry.getTime()) ||
            expiry.getTime() <= Date.now()
        ) {
            setError("Choose an expiry date and time in the future.");
            return;
        }

        if (!Number.isInteger(usageLimit) || usageLimit < 1) {
            setError("Usage limit must be a whole number of at least 1.");
            return;
        }

        const payload = {
            code,
            discountType: form.discountType,
            discountValue,
            minimumOrderValue,
            ...(maximumDiscount !== undefined
                ? { maximumDiscount }
                : {}),
            expiresAt: expiry.toISOString(),
            usageLimit,
        };

        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/api/coupons`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    result?.error ||
                    "Unable to create coupon."
                );
            }

            const createdCoupon =
                result?.data ?? result?.coupon ?? result;

            setShowModal(false);
            setForm(EMPTY_FORM);
            setSuccess(`Coupon ${code} created successfully.`);

            if (createdCoupon?._id && createdCoupon?.code) {
                setCoupons((previous) => [
                    createdCoupon,
                    ...previous.filter(
                        (coupon) => coupon._id !== createdCoupon._id
                    ),
                ]);
            } else {
                await fetchCoupons();
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    /* =========================================================
       COPY COUPON
    ========================================================= */

    async function copyCoupon(code: string) {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            window.setTimeout(() => setCopiedCode(""), 1500);
        } catch {
            setError("Unable to copy coupon code.");
        }
    }

    /* =========================================================
       STATUS BADGE
    ========================================================= */

    function StatusBadge({ coupon }: { coupon: Coupon }) {
        const status = getCouponStatus(coupon);

        const styles: Record<string, string> = {
            Active: "bg-[#E8F5E9] text-[#277547]",
            Expired: "bg-[#FCE8E3] text-[#B94C35]",
            Inactive: "bg-[#EEE9E3] text-[#81736A]",
            "Limit reached": "bg-[#FFF0B3] text-[#785A00]",
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
            >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status}
            </span>
        );
    }

    /* =========================================================
       COUPON CARD
    ========================================================= */

    function CouponCard({ coupon }: { coupon: Coupon }) {
        const used = coupon.usedCount || 0;
        const limit = coupon.usageLimit || 0;
        const progress = limit > 0
            ? Math.min((used / limit) * 100, 100)
            : 0;

        return (
            <motion.article
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="
          relative overflow-hidden rounded-[20px]
          border border-[#E8DED2] bg-[#FFFDF9]
          p-4 shadow-[0_4px_16px_rgba(50,19,18,0.035)]
        "
            >
                <div className="absolute bottom-0 right-0 h-20 w-20 translate-x-7 translate-y-7 rounded-full bg-[#FFF0B3]/60" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FFF0B3] text-[#321312]">
                                <TicketPercent size={21} />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="truncate text-sm font-black tracking-wide text-[#321312]">
                                        {coupon.code}
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() => void copyCoupon(coupon.code)}
                                        aria-label={`Copy ${coupon.code}`}
                                        className="rounded-md p-1 text-[#8D817A] transition hover:bg-[#F7F3EC] hover:text-[#321312]"
                                    >
                                        {copiedCode === coupon.code ? (
                                            <Check size={14} />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-1 text-[11px] text-[#8D817A]">
                                    {coupon.discountType === "PERCENTAGE"
                                        ? "Percentage discount"
                                        : "Fixed amount discount"}
                                </p>
                            </div>
                        </div>

                        <StatusBadge coupon={coupon} />
                    </div>

                    <div className="my-4 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9B8E86]">
                                Discount
                            </p>
                            <p className="mt-1 text-[26px] font-black tracking-[-0.05em] text-[#321312]">
                                {getDiscountLabel(coupon)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9B8E86]">
                                Min. order
                            </p>
                            <p className="mt-1 text-sm font-bold text-[#321312]">
                                {formatCurrency(coupon.minimumOrderValue)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[13px] bg-[#F7F3EC] p-3">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-semibold text-[#786B63]">
                                Redemptions
                            </span>

                            <span className="text-xs font-black text-[#321312]">
                                {used} / {limit}
                            </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6DCD0]">
                            <div
                                className="h-full rounded-full bg-[#FFD21A] transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8D817A]">
                            <CalendarDays size={13} />
                            Expires {formatDate(coupon.expiresAt)}
                        </div>

                        {coupon.maximumDiscount != null &&
                            coupon.discountType === "PERCENTAGE" && (
                                <span className="text-[10px] font-medium text-[#8D817A]">
                                    Max. {formatCurrency(coupon.maximumDiscount)}
                                </span>
                            )}
                    </div>
                </div>
            </motion.article>
        );
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#F7F3EC] text-[#321312]">
            {/* Existing admin navigation */}
            <div className="h-[72px] shrink-0 md:h-20">
                <AdminSidebar activeTab="coupons" />
            </div>

            <main
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto px-3 pb-5 sm:px-5 sm:pb-6 md:px-7 lg:px-10"
            >
                <div className="mx-auto w-full max-w-[1500px]">
                    {/* PAGE HEADING */}

                    <div className="flex flex-col justify-between gap-4 pt-5 sm:pt-7 md:flex-row md:items-end md:pt-9">
                        <div>

                            <h1 className="text-[30px] font-text font-bold uppercase tracking-[0.055em] text-[#321312] sm:text-[36px] md:text-[42px]">
                                Coupon studio<span className="text-[#FF6330]">.</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => void fetchCoupons(true)}
                                disabled={refreshing || loading}
                                className="inline-flex font-text h-11 items-center justify-center gap-2 rounded-[14px] border border-[#E8DED2] bg-[#FFFDF9] px-4 text-xs font-bold text-[#321312] transition hover:bg-white disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={15}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={openModal}
                                className="inline-flex h-11 font-text items-center justify-center gap-2 rounded-[14px] bg-[#FFD21A] px-4 text-xs font-black text-[#321312] shadow-[3px_3px_0_#321312] transition hover:-translate-y-0.5 hover:bg-[#FFCD00] active:translate-y-0"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                                Create coupon
                            </button>
                        </div>
                    </div>

                    {/* NOTIFICATIONS */}

                    <AnimatePresence>
                        {(error || success) && !showModal && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`mt-5 flex items-start gap-2 rounded-[14px] border px-4 py-3 ${error
                                    ? "border-[#F4CFC6] bg-[#FFF8F5] text-[#B94C35]"
                                    : "border-[#D8EBDD] bg-[#EFF8F1] text-[#277547]"
                                    }`}
                            >
                                {error ? (
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                ) : (
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                                )}

                                <p className="flex-1 text-xs font-semibold leading-5">
                                    {error || success}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setSuccess("");
                                    }}
                                    aria-label="Dismiss notification"
                                >
                                    <X size={15} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* STATISTICS */}

                    <section className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 xl:grid-cols-4">
                        <div className="relative overflow-hidden rounded-[20px] border border-[#E8DED2] bg-[#FFFDF9] p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold font-text uppercase tracking-[0.1em] text-[#8D817A] sm:text-[11px]">
                                    Total coupons
                                </span>
                                <div className="rounded-[11px] bg-[#FFF0B3] p-2 text-[#321312]">
                                    <Tag size={17} />
                                </div>
                            </div>
                            <p className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#321312] sm:text-[34px]">
                                {loading ? "—" : stats.total}
                            </p>
                            <p className="mt-1 font-text  text-[10px] text-[#9B8E86]">
                                All created promotions
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-[20px] border border-[#E8DED2] bg-[#FFFDF9] p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-text  font-bold uppercase tracking-[0.1em] text-[#8D817A] sm:text-[11px]">
                                    Available
                                </span>
                                <div className="rounded-[11px] bg-[#E8F5E9] p-2 text-[#277547]">
                                    <Zap size={17} />
                                </div>
                            </div>
                            <p className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#321312] sm:text-[34px]">
                                {loading ? "—" : stats.active}
                            </p>
                            <p className="mt-1 font-text  text-[10px] text-[#9B8E86]">
                                Active and within limits
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-[20px] border border-[#E8DED2] bg-[#FFFDF9] p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-text  font-bold uppercase tracking-[0.1em] text-[#8D817A] sm:text-[11px]">
                                    Expired
                                </span>
                                <div className="rounded-[11px] bg-[#FCE8E3] p-2 text-[#B94C35]">
                                    <Clock3 size={17} />
                                </div>
                            </div>
                            <p className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#321312] sm:text-[34px]">
                                {loading ? "—" : stats.expired}
                            </p>
                            <p className="mt-1 font-text  text-[10px] text-[#9B8E86]">
                                Past their expiry date
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-[20px] border border-[#E8DED2] bg-[#FFFDF9] p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-text  font-bold uppercase tracking-[0.1em] text-[#8D817A] sm:text-[11px]">
                                    Redemptions
                                </span>
                                <div className="rounded-[11px] bg-[#F0E6DB] p-2 text-[#321312]">
                                    <Activity size={17} />
                                </div>
                            </div>
                            <p className="mt-3 text-[28px] font-black tracking-[-0.05em] text-[#321312] sm:text-[34px]">
                                {loading ? "—" : stats.redemptions.toLocaleString("en-IN")}
                            </p>
                            <p className="mt-1 font-text  text-[10px] text-[#9B8E86]">
                                Total recorded uses
                            </p>
                        </div>
                    </section>

                    {/* COUPON MANAGEMENT */}

                    <section className="mt-8 overflow-hidden rounded-[22px] border border-[#E8DED2] bg-[#FFFDF9] sm:mt-9 sm:rounded-[26px]">
                        <div className="flex flex-col gap-4 border-b border-[#E8DED2] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-text font-semibold tracking-[-0.035em] text-[#321312]">
                                        All coupons
                                    </h2>
                                    <span className="rounded-full bg-[#F7F3EC] px-2.5 py-1 text-[10px] font-bold text-[#786B63]">
                                        {filteredCoupons.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                                <div className="flex h-10 min-w-0 items-center gap-2 rounded-[12px] border border-[#E8DED2] bg-[#F7F3EC] px-3 focus-within:border-[#321312] sm:w-[240px]">
                                    <Search size={15} className="shrink-0 text-[#9B8E86]" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search coupon code..."
                                        className="min-w-0 flex-1 font-text  bg-transparent text-xs text-[#321312] outline-none placeholder:text-[#A79B94]"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch("")}
                                            aria-label="Clear search"
                                        >
                                            <X size={14} className="text-[#9B8E86]" />
                                        </button>
                                    )}
                                </div>

                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value)}
                                        className="h-10 w-full appearance-none rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] pl-3 pr-9 text-xs font-semibold text-[#321312] outline-none focus:border-[#321312] sm:w-[160px]"
                                    >
                                        <option>All</option>
                                        <option>Active</option>
                                        <option>Expired</option>
                                        <option>Inactive</option>
                                        <option>Limit reached</option>
                                    </select>
                                    <ChevronDown
                                        size={14}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8D817A]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LOADING */}

                        {loading ? (
                            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                                <Loader2 size={25} className="animate-spin text-[#321312]" />
                                <p className="text-xs font-medium text-[#8D817A]">
                                    Loading your coupons...
                                </p>
                            </div>
                        ) : coupons.length === 0 ? (
                            /* EMPTY STATE */

                            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-12 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#FFF0B3] text-[#321312] shadow-[4px_4px_0_#FFD21A]">
                                    <TicketPercent size={28} />
                                </div>

                                <h3 className="mt-6 text-base font-text font-semibold text-[#321312]">
                                    Your coupon shelf is empty
                                </h3>

                                <p className="mt-2 font-text max-w-[300px] text-xs leading-5 text-[#8D817A]">
                                    Create your first offer and give your customers another
                                    reason to love SweetTreats.
                                </p>

                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="mt-5 font-text inline-flex h-10 items-center gap-2 rounded-[12px] bg-[#FFD21A] px-4 text-xs font-black text-[#321312] transition hover:bg-[#FFCD00]"
                                >
                                    <Plus size={15} />
                                    Create your first coupon
                                </button>
                            </div>
                        ) : filteredCoupons.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
                                <Search size={24} className="text-[#B6A79C]" />
                                <p className="mt-3 text-sm font-bold text-[#321312]">
                                    No matching coupons
                                </p>
                                <p className="mt-1 text-xs text-[#8D817A]">
                                    Try a different search or status filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("All");
                                    }}
                                    className="mt-3 text-xs font-bold text-[#321312] underline underline-offset-4"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* DESKTOP TABLE */}

                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full font-text min-w-[800px] border-collapse text-left">
                                        <thead>
                                            <tr className="bg-[#FAF7F1]">
                                                <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B8E86]">
                                                    Coupon
                                                </th>
                                                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B8E86]">
                                                    Discount
                                                </th>
                                                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B8E86]">
                                                    Usage
                                                </th>
                                                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B8E86]">
                                                    Expiry
                                                </th>
                                                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B8E86]">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredCoupons.map((coupon) => {
                                                const limit = coupon.usageLimit || 0;
                                                const used = coupon.usedCount || 0;
                                                const progress = limit > 0
                                                    ? Math.min((used / limit) * 100, 100)
                                                    : 0;

                                                return (
                                                    <tr
                                                        key={coupon._id}
                                                        className="border-t border-[#F0E8DE] transition hover:bg-[#FFFCF6]"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF0B3] text-[#321312]">
                                                                    <Tag size={17} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-xs font-black tracking-wide text-[#321312]">
                                                                            {coupon.code}
                                                                        </p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => void copyCoupon(coupon.code)}
                                                                            aria-label={`Copy ${coupon.code}`}
                                                                            className="rounded p-1 text-[#A79B94] transition hover:bg-[#F7F3EC] hover:text-[#321312]"
                                                                        >
                                                                            {copiedCode === coupon.code ? (
                                                                                <Check size={12} />
                                                                            ) : (
                                                                                <Copy size={12} />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <p className="mt-1 text-[10px] text-[#9B8E86]">
                                                                        Min. {formatCurrency(coupon.minimumOrderValue)}
                                                                        {coupon.maximumDiscount != null &&
                                                                            coupon.discountType === "PERCENTAGE"
                                                                            ? ` · Max. ${formatCurrency(coupon.maximumDiscount)}`
                                                                            : ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <p className="text-xs font-black text-[#321312]">
                                                                {getDiscountLabel(coupon)}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-[#9B8E86]">
                                                                {coupon.discountType === "PERCENTAGE"
                                                                    ? "Percentage"
                                                                    : "Fixed amount"}
                                                            </p>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <div className="w-[110px]">
                                                                <div className="flex justify-between gap-2 text-[10px]">
                                                                    <span className="font-bold text-[#321312]">
                                                                        {used} used
                                                                    </span>
                                                                    <span className="text-[#9B8E86]">
                                                                        {limit}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EDE4D9]">
                                                                    <div
                                                                        className="h-full rounded-full bg-[#FFD21A]"
                                                                        style={{ width: `${progress}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2 text-[11px] text-[#786B63]">
                                                                <CalendarDays
                                                                    size={14}
                                                                    className="shrink-0 text-[#A79B94]"
                                                                />
                                                                {formatDate(coupon.expiresAt)}
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <StatusBadge coupon={coupon} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* MOBILE CARDS */}

                                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 md:hidden">
                                    {filteredCoupons.map((coupon) => (
                                        <CouponCard
                                            key={coupon._id}
                                            coupon={coupon}
                                        />
                                    ))}
                                </div>

                                {/* FOOTER */}

                                <div className="flex flex-col gap-1 border-t border-[#E8DED2] bg-[#FAF7F1] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                    <p className="text-[10px] text-[#8D817A]">
                                        Showing{" "}
                                        <span className="font-bold text-[#321312]">
                                            {filteredCoupons.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-[#321312]">
                                            {coupons.length}
                                        </span>{" "}
                                        coupons
                                    </p>

                                    <p className="text-[10px] text-[#9B8E86]">
                                        Redemptions: {stats.redemptions.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </>
                        )}
                    </section>

                </div>
            </main>

            {/* =====================================================
          CREATE COUPON MODAL
      ===================================================== */}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeModal();
                            }
                        }}
                        className="fixed inset-0 z-[100] flex items-end justify-center bg-[#24120F]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.99 }}
                            transition={{ duration: 0.2 }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="create-coupon-title"
                            className="flex max-h-[94dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-[24px] border border-[#E8DED2] bg-[#FFFDF9] shadow-[0_24px_80px_rgba(35,15,12,0.2)] sm:max-h-[90dvh] sm:rounded-[26px]"
                        >
                            {/* Modal header */}

                            <div className="flex shrink-0 items-center justify-between border-b border-[#E8DED2] px-5 py-4 sm:px-6 sm:py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#FFD21A] text-[#321312] shadow-[3px_3px_0_#321312]">
                                        <TicketPercent size={21} />
                                    </div>
                                    <div>
                                        <h2
                                            id="create-coupon-title"
                                            className="text-base font-black tracking-[-0.03em] text-[#321312] sm:text-lg"
                                        >
                                            Create a coupon
                                        </h2>
                                        <p className="mt-1 text-[10px] text-[#8D817A]">
                                            Set up a new SweetTreats offer
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    aria-label="Close modal"
                                    className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[#786B63] transition hover:bg-[#F7F3EC] disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal form */}

                            <form
                                onSubmit={handleCreateCoupon}
                                className="min-h-0 flex-1 overflow-y-auto"
                            >
                                <div className="space-y-5 p-5 sm:p-6">
                                    {error && (
                                        <div className="flex items-start gap-2 rounded-[12px] border border-[#F4CFC6] bg-[#FFF8F5] p-3 text-[#B94C35]">
                                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                            <p className="text-[11px] leading-5">{error}</p>
                                        </div>
                                    )}

                                    {/* Coupon code */}

                                    <div>
                                        <label
                                            htmlFor="coupon-code"
                                            className="mb-2 block text-[11px] font-bold text-[#321312]"
                                        >
                                            Coupon code <span className="text-[#FF6330]">*</span>
                                        </label>

                                        <input
                                            id="coupon-code"
                                            value={form.code}
                                            onChange={(event) =>
                                                updateField(
                                                    "code",
                                                    event.target.value.toUpperCase()
                                                )
                                            }
                                            placeholder="e.g. SWEET20"
                                            maxLength={40}
                                            required
                                            autoComplete="off"
                                            className="h-12 w-full rounded-[13px] border border-[#E8DED2] bg-[#F7F3EC] px-4 text-sm font-black tracking-[0.08em] text-[#321312] outline-none transition placeholder:font-medium placeholder:tracking-normal placeholder:text-[#B2A69C] focus:border-[#321312] focus:bg-white"
                                        />

                                        <p className="mt-1.5 text-[10px] text-[#9B8E86]">
                                            Letters, numbers, hyphens, and underscores.
                                        </p>
                                    </div>

                                    {/* Discount settings */}

                                    <div className="rounded-[17px] border border-[#E8DED2] bg-[#FAF7F1] p-4">
                                        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8D817A]">
                                            Discount settings
                                        </p>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="discount-type"
                                                    className="mb-2 block text-[11px] font-bold text-[#321312]"
                                                >
                                                    Discount type
                                                </label>

                                                <select
                                                    id="discount-type"
                                                    value={form.discountType}
                                                    onChange={(event) => {
                                                        const type = event.target.value as DiscountType;

                                                        setForm((previous) => ({
                                                            ...previous,
                                                            discountType: type,
                                                            discountValue:
                                                                type === "PERCENTAGE" ? "10" : "20",
                                                            maximumDiscount:
                                                                type === "PERCENTAGE"
                                                                    ? previous.maximumDiscount
                                                                    : "",
                                                        }));
                                                    }}
                                                    className="h-11 w-full rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] px-3 text-xs font-semibold text-[#321312] outline-none focus:border-[#321312]"
                                                >
                                                    <option value="PERCENTAGE">
                                                        Percentage (%)
                                                    </option>
                                                    <option value="FIXED">
                                                        Fixed amount (₹)
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="discount-value"
                                                    className="mb-2 block text-[11px] font-bold text-[#321312]"
                                                >
                                                    Discount value
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        id="discount-value"
                                                        type="number"
                                                        min="0.01"
                                                        max={
                                                            form.discountType === "PERCENTAGE"
                                                                ? 100
                                                                : undefined
                                                        }
                                                        step="0.01"
                                                        required
                                                        value={form.discountValue}
                                                        onChange={(event) =>
                                                            updateField(
                                                                "discountValue",
                                                                event.target.value
                                                            )
                                                        }
                                                        className="h-11 w-full rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] px-3 pr-10 text-sm font-bold text-[#321312] outline-none focus:border-[#321312]"
                                                    />

                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9B8E86]">
                                                        {form.discountType === "PERCENTAGE"
                                                            ? "%"
                                                            : "₹"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="minimum-order"
                                                    className="mb-2 block text-[11px] font-bold text-[#321312]"
                                                >
                                                    Minimum order (₹)
                                                </label>

                                                <input
                                                    id="minimum-order"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    value={form.minimumOrderValue}
                                                    onChange={(event) =>
                                                        updateField(
                                                            "minimumOrderValue",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] px-3 text-sm font-semibold text-[#321312] outline-none focus:border-[#321312]"
                                                />
                                            </div>

                                            {form.discountType === "PERCENTAGE" && (
                                                <div>
                                                    <label
                                                        htmlFor="maximum-discount"
                                                        className="mb-2 block text-[11px] font-bold text-[#321312]"
                                                    >
                                                        Maximum discount (₹)
                                                    </label>

                                                    <input
                                                        id="maximum-discount"
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={form.maximumDiscount}
                                                        onChange={(event) =>
                                                            updateField(
                                                                "maximumDiscount",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Optional"
                                                        className="h-11 w-full rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] px-3 text-sm font-semibold text-[#321312] outline-none placeholder:font-normal placeholder:text-[#B2A69C] focus:border-[#321312]"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expiry and usage */}

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="coupon-expiry"
                                                className="mb-2 block text-[11px] font-bold text-[#321312]"
                                            >
                                                Expiry date & time
                                            </label>

                                            <input
                                                id="coupon-expiry"
                                                type="datetime-local"
                                                required
                                                min={new Date(
                                                    Date.now() - new Date().getTimezoneOffset() * 60000
                                                )
                                                    .toISOString()
                                                    .slice(0, 16)}
                                                value={form.expiresAt}
                                                onChange={(event) =>
                                                    updateField(
                                                        "expiresAt",
                                                        event.target.value
                                                    )
                                                }
                                                className="h-11 w-full min-w-0 rounded-[12px] border border-[#E8DED2] bg-[#F7F3EC] px-3 text-xs text-[#321312] outline-none focus:border-[#321312] focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="usage-limit"
                                                className="mb-2 block text-[11px] font-bold text-[#321312]"
                                            >
                                                Total usage limit
                                            </label>

                                            <input
                                                id="usage-limit"
                                                type="number"
                                                min="1"
                                                step="1"
                                                required
                                                value={form.usageLimit}
                                                onChange={(event) =>
                                                    updateField(
                                                        "usageLimit",
                                                        event.target.value
                                                    )
                                                }
                                                className="h-11 w-full rounded-[12px] border border-[#E8DED2] bg-[#F7F3EC] px-3 text-sm font-semibold text-[#321312] outline-none focus:border-[#321312] focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview */}

                                    <div className="relative overflow-hidden rounded-[17px] border border-[#E8DED2] bg-[#321312] p-4 text-[#FFFDF9]">
                                        <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full border-[18px] border-white/5" />

                                        <div className="relative flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">
                                                    Live preview
                                                </p>

                                                <p className="mt-2 truncate text-lg font-black tracking-[0.06em] text-[#FFD21A]">
                                                    {form.code || "YOURCOUPON"}
                                                </p>

                                                <p className="mt-1 text-[10px] text-white/60">
                                                    Min. order{" "}
                                                    {formatCurrency(
                                                        Number(form.minimumOrderValue) || 0
                                                    )}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-[26px] font-black tracking-[-0.05em] text-[#FFD21A]">
                                                    {form.discountType === "PERCENTAGE"
                                                        ? `${Number(form.discountValue) || 0}%`
                                                        : formatCurrency(
                                                            Number(form.discountValue) || 0
                                                        )}
                                                </p>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/55">
                                                    Discount
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal actions */}

                                <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E8DED2] bg-[#FAF7F1] p-4 sm:flex-row sm:justify-end sm:px-6">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={saving}
                                        className="h-11 rounded-[12px] border border-[#E8DED2] bg-[#FFFDF9] px-5 text-xs font-bold text-[#786B63] transition hover:bg-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#FFD21A] px-5 text-xs font-black text-[#321312] shadow-[2px_2px_0_#321312] transition hover:bg-[#FFCD00] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 size={15} className="animate-spin" />
                                                Creating coupon...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={15} strokeWidth={2.5} />
                                                Create coupon
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
