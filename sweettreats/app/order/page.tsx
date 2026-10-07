"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  Gift,
  Heart,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Product } from "../type/product";
import { useRouter } from "next/navigation";
import Restricted from "../admin/Restricted";

type Category = "All" | "Cookies" | "Cake" | "Bread" | "Pastry";

// type ProductReview = {
//   userId?: string;
//   rating?: number;
//   comment?: string;
// };

// type Product = {
//   _id: number;
//   name: string;
//   category: Exclude<Category, "All">;
//   price: number;
//   description: string;
//   tags: string[];
//   image: string;
//   accent: string;
//   note: string;
//   count: number;
//   __v?: number;
//   ingredients?: string[];
//   rating?: number;
//   reviews?: ProductReview[];
// };

type OrderItem = {
  _id: string;
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: {
      address: string;
      city: string;
      postalCode: string;
      latitude?: number;
      longitude?: number;
    };
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
};

type OrdersPageProps = {
  products: Product[];
};

type Filter = "All" | "PROCESSING" | "SHIPPED" | "DELIVERED";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const easing = [0.22, 1, 0.36, 1] as const;

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

const getStatusConfig = (status: string) => {
  // "PENDING" | "CONFIRMED" | "PROCESSING"  | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        tone: "success",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        icon: XCircle,
        tone: "danger",
      }; 
    case "OUT_FOR_DELIVERY":
      return {
        label: "Shipped",
        icon: Truck,
        tone: "info",
      };
    case "PROCESSING":
      return {
        label: "Processing",
        icon: Package,
        tone: "processing",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        icon: Clock,
        tone: "processing",
      };
    default:
      return {
        label: "Pending",
        icon: Clock3,
        tone: "pending",
      };
  }
};

const statusClasses: Record<string, string> = {
  success: "bg-[#e4f4e8] text-[#247c4d]",
  info: "bg-[#e5efff] text-[#3265a9]",
  processing: "bg-[#eee9f8] text-[#654b96]",
  pending: "bg-[#fff1cf] text-[#9a6815]",
  danger: "bg-[#fde7e5] text-[#a53b35]",
};

const statusSteps = [
  { key: "PLACED", label: "Order Placed", icon: ShoppingBag },
  { key: "PROCESSING", label: "Preparing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
];

const getStepIndex = (status: string) => {
  // "PENDING" | "CONFIRMED" | "PROCESSING"  | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return 3;
    case "OUT_FOR_DELIVERY":
      return 2;
    case "PROCESSING":
      return 1;
    case "CONFIRMED":
      return 1;
    case "PENDING":
      return 0;
    default:
      return 0;
  }
};

function ProductImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#f6dfc7] ${className}`}
    >
      {src ? (
        <img
          src={src.startsWith("http") ? src : `${API_BASE}/images/${src}`}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#4a1e1c]/40">
          <Package size={28} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClasses[config.tone]}`}
    >
      <Icon size={13} strokeWidth={2.4} />
      {config.label}
    </span>
  );
}

function OrderDetailsModal({
  order,
  productMap,
  onClose,
  cancelOrder
}: {
  order: Order;
  productMap: Map<string, Product>;
  onClose: () => void;
  cancelOrder: (orderId: string)=> Promise<void>
}) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const stepIndex = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus.toUpperCase() === "CANCELLED";

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);



  return (
    <motion.div
    data-lenis-prevent
      className="fixed inset-0 z-[20000] overflow-scroll sidebar-none overscroll-contain flex items-end justify-center bg-[#2f1715]/35 p-0 backdrop-blur-[7px] sm:items-center sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-t-[30px] border border-[#4a1e1c]/10 bg-[#fdf8f3] shadow-[0_30px_100px_rgba(61,24,20,0.25)] sm:rounded-[30px]"
        initial={{ y: 50, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 35, scale: 0.98 }}
        transition={{ duration: 0.38, ease: easing }}
      >
        <div className="flex max-h-[94vh] flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#4a1e1c]/10 bg-[#fdf8f3]/95 px-5 py-4 backdrop-blur-md sm:px-7">
            <div>
              <p className="text-[10px] font-text font-bold uppercase tracking-[0.22em] text-[#8d7770]">
                Order details
              </p>
              <h2
                id="order-details-title"
                className="mt-1 text-xl font-header tracking-tight text-[#3d1715] sm:text-2xl"
              >
                {order.orderId}
              </h2>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ rotate: 90, scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4a1e1c]/10 bg-white text-[#4a1e1c] shadow-sm"
              aria-label="Close order details"
            >
              <X size={19} />
            </motion.button>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            {!isCancelled && (
              <section  className={`${statusClasses[getStatusConfig(order.orderStatus).tone]} rounded-[24px] p-5 sm:p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {/* <p className="text-[10px] font-text font-bold uppercase tracking-[0.2em] text-[#795c21]">
                      Your sweet order
                    </p> */}
                    <h3 className="mt-1 text-lg font-black text-[#3d1715] font-text tracking-wider ">
                      {getStatusConfig(order.orderStatus).label}
                    </h3>
                  </div>
                  <Sparkles className="text-[#d69e16]" size={22} />
                </div>

                <div className="mt-7 flex items-start">
                  {statusSteps.map((step, index) => {
                    const complete = index <= stepIndex;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="relative font-text tracking-wider flex flex-1 flex-col items-center"
                      >
                        {index !== 0 && (
                          <div
                            className={`absolute right-1/2 top-4 h-[2px] w-full ${
                              index <= stepIndex
                                ? "bg-[#ffd21c]"
                                : "bg-[#d8cdbf]"
                            }`}
                          />
                        )}

                        <motion.div
                          initial={{ scale: 0.7 }}
                          animate={{ scale: complete ? 1 : 0.9 }}
                          transition={{
                            delay: index * 0.08,
                            duration: 0.3,
                          }}
                          className={`relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            complete
                              ? "border-[#ffd21c] bg-[#ffd21c] text-[#3d1715]"
                              : "border-[#d8cdbf] bg-[#fdf8f3] text-[#a99a90]"
                          }`}
                        >
                          {complete && index < stepIndex ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <Icon size={14} />
                          )}
                        </motion.div>

                        <span
                          className={`mt-2 text-center text-[9px] font-bold sm:text-[10px] ${
                            complete
                              ? "text-[#3d1715]"
                              : "text-[#9a8a82]"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="mt-1 text-lg font-black text-[#3d1715] font-text ">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </h3>
                </div>
                {order.orderStatus!=="CANCELLED" && <button onClick={()=>cancelOrder(order._id)} className="bg-[var(--foreground)] text-xs rounded-md px-5 py-2 font-text text-white cursor-pointer">
                  Cancel Order
                </button>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 font-text ">
                {order.items.map((item, index) => {
                  const product = productMap.get(String(item.productId));
                  const image = product?.image || item.image;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.35,
                        ease: easing,
                      }}
                      className="group flex items-center gap-3 rounded-[20px] border border-[#4a1e1c]/10 bg-white p-3 shadow-[0_5px_18px_rgba(61,24,20,0.035)]"
                    >
                      <ProductImage
                        src={image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-[15px]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#3d1715]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-[#8e7770]">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-black text-[#3d1715]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2 font-text ">
              <section className="rounded-[22px] border border-[#4a1e1c]/10 bg-white p-5">
                <div className="flex items-center gap-2 text-[#3d1715]">
                  <MapPin size={17} />
                  <h3 className="text-sm font-black">Delivery address</h3>
                </div>
                <div className="mt-4 text-sm">
                  <p className="font-bold text-[#3d1715]">
                    {order.shippingAddress.name}
                  </p>
                  <p className="mt-1.5 leading-6 text-[#806e68]">
                    {order.shippingAddress.address.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.pincode}
                  </p>
                  <div className="mt-4 flex items-center gap-2 border-t border-[#4a1e1c]/10 pt-3 text-xs text-[#8b7770]">
                    <Phone size={14} />
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] border border-[#4a1e1c]/10 bg-white p-5">
                <h3 className="text-sm font-black text-[#3d1715]">Payment</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#8b7770]">Method</span>
                    <span className="font-bold text-[#3d1715]">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#8b7770]">Status</span>
                    <span className="rounded-full bg-[#e4f4e8] px-2.5 py-1 text-[10px] font-bold text-[#247c4d]">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#4a1e1c]/10 pt-3">
                    <span className="text-[#8b7770]">Placed</span>
                    <span className="font-medium text-[#3d1715]">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-[22px] bg-[#3d1715] p-5 text-[#fffaf4] sm:p-6 font-text ">
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-[#d9c4bd]">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-[#d9c4bd]">Delivery</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between gap-8">
                      <span className="text-[#a9dfbd]">Discount</span>
                      <span className="text-[#a9dfbd]">
                        -{formatCurrency(order.discount)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-white/15 pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9c4bd]">
                    Total paid
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </section>

            <p className="text-center text-[11px] text-[#9a8580] font-text ">
              Last updated {formatDateTime(order.updatedAt)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeliveryTracker({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: () => void;
}) {
  const stepIndex = getStepIndex(order.orderStatus);
  const firstImage = order.items[0]?.image;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: easing, delay: 0.15 }}
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <div className="overflow-hidden rounded-[28px] border border-[#4a1e1c]/10 bg-white shadow-[0_12px_40px_rgba(61,24,20,0.05)]">
        <div className="relative min-h-[260px] overflow-hidden bg-[#fff0b0] p-6">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-5 top-5 text-5xl"
          >
            🍪
          </motion.div>

          <div className="absolute left-7 top-16 text-2xl text-[#3d1715]/40">〰</div>
          <div className="absolute right-10 top-28 text-2xl text-[#3d1715]/40">♡</div>

          <div className="relative z-[1] flex h-full min-h-[210px] flex-col justify-end">
            <p className="max-w-[180px] text-[34px] font-header uppercase leading-[0.92] tracking-[-0.04em] text-[#3d1715]">
              ON ITS WAY
              <br />
              TO YOU!
            </p>
            <div className="mt-5 inline-flex w-fit font-text  rounded-full bg-[#3d1715] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
              {order.orderId}
            </div>
          </div>

          {firstImage && (
            <div className="absolute bottom-[-12px] right-[-10px] h-28 w-36 rotate-[-7deg] overflow-hidden rounded-[20px] border-4 border-white shadow-lg">
              <ProductImage
                src={firstImage}
                alt={order.items[0]?.name || "Order"}
                className="h-full w-full"
              />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-text font-bold uppercase tracking-[0.18em] text-[#9a8580]">
                Delivery status
              </p>
              <p className="mt-1 text-base font-header text-[#3d1715]">
                {getStatusConfig(order.orderStatus).label}
              </p>
            </div>
            <StatusPill status={order.orderStatus} />
          </div>

          <div className="mt-7 flex items-start">
            {statusSteps.map((step, index) => {
              const complete = index <= stepIndex;

              return (
                <div key={step.key} className="relative font-text  flex flex-1 flex-col items-center">
                  {index !== 0 && (
                    <div
                      className={`absolute right-1/2 top-3 h-[2px] w-full ${
                        index <= stepIndex ? "bg-[#ffd21c]" : "bg-[#ded4cb]"
                      }`}
                    />
                  )}
                  <motion.div
                    animate={{
                      scale: index === stepIndex ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: index === stepIndex ? Infinity : 0,
                    }}
                    className={`relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border ${
                      complete
                        ? "border-[#ffd21c] bg-[#ffd21c] text-[#3d1715]"
                        : "border-[#d8cfc8] bg-white text-[#a79a94]"
                    }`}
                  >
                    {complete ? (
                      <Check size={11} strokeWidth={3} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </motion.div>
                  <span className="mt-2 max-w-[55px] text-center text-[8px] font-semibold leading-tight text-[#7e6c66]">
                    {step.label.replace("Order ", "")}
                  </span>
                </div>
              );
            })}
          </div>

          <motion.button
            type="button"
            onClick={onViewDetails}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex w-full font-text  cursor-pointer items-center justify-center gap-2 rounded-full border border-[#4a1e1c]/15 px-4 py-3 text-xs font-black text-[#3d1715] transition-colors hover:bg-[#fff4dc]"
          >
            View order details
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </div>

      {/* <motion.div
        whileHover={{ y: -3 }}
        className="mt-4 rounded-[24px] bg-[#ffd72a] p-5"
      >
        <p className="max-w-[190px] text-[27px] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#3d1715]">
          GOOD THINGS
          <br />
          TAKE TIME
        </p>
        <p className="mt-3 max-w-[230px] text-xs font-medium leading-5 text-[#654d48]">
          But they&apos;re always worth the wait!
        </p>
        <motion.button
          type="button"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#3d1715] px-4 py-2.5 text-xs font-bold text-white"
        >
          Shop again
          <ArrowRight size={14} />
        </motion.button>
      </motion.div> */}

      {/* <motion.div
        whileHover={{ y: -2 }}
        className="mt-4 flex items-center gap-3 rounded-[20px] border border-[#4a1e1c]/10 bg-white p-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd72a] text-[#3d1715]">
          <Gift size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-[#3d1715]">Earn sweet rewards</p>
          <p className="mt-0.5 text-[10px] text-[#8d7770]">
            Every order brings you closer to something special!
          </p>
        </div>
        <ChevronRight size={17} className="text-[#705e58]" />
      </motion.div> */}
    </motion.aside>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[30px] border border-dashed border-[#4a1e1c]/15 bg-white px-6 py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#fff0b0] text-4xl"
      >
        🍪
      </motion.div>
      <h2 className="mt-6 font-header text-2xl font-black uppercase tracking-tight text-[#3d1715]">
        No orders yet
      </h2>
      <p className="mx-auto mt-2 font-text  max-w-sm text-sm leading-6 text-[#8b7770]">
        Your sweet orders will appear here once you place your first order.
      </p>
    </motion.div>
  );
}

function OrderRow({
  order,
  index,
  productMap,
  onViewDetails,
}: {
  order: Order;
  index: number;
  productMap: Map<string, Product>;
  onViewDetails: (order: Order) => void;
}) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstItem = order.items[0];
  const product = firstItem
    ? productMap.get(String(firstItem.productId))
    : undefined;

  const image = product?.image || firstItem?.image;

  const itemSummary =
    order.items.length > 1
      ? `${firstItem?.name} + ${order.items.length - 1} more`
      : firstItem?.name || "Order";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ duration: 0.45, ease: easing, delay: index * 0.055 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-[22px] border border-[#4a1e1c]/10 bg-white shadow-[0_5px_24px_rgba(61,24,20,0.035)] transition-shadow duration-300 hover:shadow-[0_14px_36px_rgba(61,24,20,0.08)]"
    >
      <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="relative shrink-0">
          <ProductImage
            src={image}
            alt={firstItem?.name || "Order"}
            className="h-24 w-full rounded-[17px] sm:h-[96px] sm:w-[155px]"
          />
          {totalItems > 1 && (
            <span className="absolute bottom-2 font-text left-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-black text-[#3d1715] backdrop-blur">
              +{totalItems - 1} item{totalItems - 1 > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 px-1 sm:px-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f7eadb] font-text  px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#74564d]">
              #{order.orderId.replace(/^#/, "")}
            </span>
            <span className="text-[10px] text-[#a18f88] font-text ">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <h3 className="mt-2 truncate text-[17px] font-header text-[#3d1715]">
            {itemSummary}
          </h3>

          <p className="mt-1 text-[11px] text-[#907d76] font-text ">
            {totalItems} {totalItems === 1 ? "item" : "items"}{" "}
            <span className="mx-1 text-[#c8b7ae]">•</span>{" "}
            {formatCurrency(order.total)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#4a1e1c]/8 pt-3 sm:min-w-[250px] sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div>
            <StatusPill status={order.orderStatus} />
            <p className="mt-1.5 text-[10px] font-text text-[#9b8881]">
              {order.orderStatus.toUpperCase() === "DELIVERED"
                ? `Delivered on ${formatDate(order.updatedAt)}`
                : order.orderStatus.toUpperCase() === "SHIPPED"
                ? "Expected soon"
                : "We're preparing your order"}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => onViewDetails(order)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#4a1e1c]/20 px-3.5 py-2.5 text-[10px] font-black text-[#3d1715] transition-colors hover:bg-[#fff4dc]"
          >
            <span className="hidden sm:inline font-text ">View details</span>
            <span className="sm:hidden font-text ">Details</span>
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function OrdersPage({ products: productsProp = [] }: OrdersPageProps) {
  const { products: storeProducts,setOrder } = useAuthStore();
  const products = productsProp?.length ? productsProp : storeProducts || [];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  const productMap = useMemo(() => {
    return new Map(
      products.map((product) => [String(product._id), product])
    );
  }, [products]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/api/orders`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => filter === "All" || order.orderStatus.toUpperCase() === filter)
      .filter((order) => {
        if (!query) return true;

        return (
          order.orderId.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders, filter, search]);

  const activeOrder = useMemo(() => {
    const nonDelivered = [...orders]
      .filter(
        (order) =>
          !["DELIVERED", "CANCELLED"].includes(order.orderStatus.toUpperCase())
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return nonDelivered[0] || orders[0] || null;
  }, [orders]);

  const counts = useMemo(
    () => ({
      All: orders.length,
      PROCESSING: orders.filter(
        (order) => order.orderStatus.toUpperCase() === "PROCESSING"
      ).length,
      SHIPPED: orders.filter(
        (order) => order.orderStatus.toUpperCase() === "SHIPPED"
      ).length,
      DELIVERED: orders.filter(
        (order) => order.orderStatus.toUpperCase() === "DELIVERED"
      ).length,
    }),
    [orders]
  );

  const {user,admin} = useAuthStore()
   const router = useRouter();
      if(!user){
        if(admin){
          router.replace("/admin/order")
          return;
        }else{
          return <Restricted/>
        }
        
      }

  async function cancelOrder(orderId: string) {
    try {
                const response = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/cancel`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await (await response).json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (error) {
                console.log(error)
            }
  }
      
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#f8f0e9] px-4 pb-12 pt-8 text-[#3d1715] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easing }}
            className="mb-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>

                <div className="relative mt-2 inline-block">
                  <h1 className="text-[52px] font-title uppercase leading-[0.9] tracking-[0.055em] text-[#3d1715] sm:text-[68px]">
                    My orders
                  </h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.45, duration: 0.6, ease: easing }}
                    className="absolute -bottom-3 left-1 h-2 w-[78%] origin-left rounded-full bg-[#ffd21c] sm:h-2.5"
                  />
                </div>
              </div>
            </div>
          </motion.header>

          {loading ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
              <div className="space-y-3">
                <div className="h-14 animate-pulse rounded-full bg-white/70" />
                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: item * 0.06 }}
                    className="h-[128px] animate-pulse rounded-[22px] border border-[#4a1e1c]/5 bg-white/70"
                  />
                ))}
              </div>
              <div className="hidden h-[600px] animate-pulse rounded-[28px] bg-white/70 lg:block" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
              <section className="min-w-0">
                <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
                  <div className="flex min-w-0 overflow-x-auto rounded-full border border-[#4a1e1c]/10 bg-white p-1.5 shadow-sm scrollbar-none">
                    {(
                      [
                        ["All", "All Orders"],
                        ["PROCESSING", "Processing"],
                        ["SHIPPED", "Shipped"],
                        ["DELIVERED", "Delivered"],
                      ] as [Filter, string][]
                    ).map(([key, label]) => (
                      <motion.button
                        key={key}
                        type="button"
                        onClick={() => setFilter(key)}
                        whileTap={{ scale: 0.97 }}
                        className="relative shrink-0 font-text tracking-wider rounded-full px-4 py-2.5 text-[11px] font-medium text-[#806e68]"
                      >
                        {filter === key && (
                          <motion.span
                            layoutId="order-filter-pill"
                            className="absolute inset-0 rounded-full bg-[#ffd21c]"
                            transition={{ duration: 0.35, ease: easing }}
                          />
                        )}
                        <span className="relative z-[1]">
                          {label}
                          <span className="ml-1.5 opacity-60">({counts[key]})</span>
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="relative min-w-0 flex-1 xl:max-w-[290px]">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a38f87]"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search your orders..."
                      className="h-11 w-full rounded-full font-text  border border-[#4a1e1c]/10 bg-white pl-11 pr-4 text-xs font-medium text-[#3d1715] outline-none placeholder:text-[#ad9b94] focus:border-[#ffd21c] focus:ring-4 focus:ring-[#ffd21c]/15"
                    />
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div layout className="space-y-3">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <OrderRow
                          key={order._id}
                          order={order}
                          index={index}
                          productMap={productMap}
                          onViewDetails={setSelectedOrder}
                        />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[24px] bg-white p-10 text-center"
                      >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0b0]">
                          <Search size={21} />
                        </div>
                        <h3 className="mt-4 font-header text-[#3d1715]">
                          No orders found
                        </h3>
                        <p className="mt-1 text-xs font-text text-[#8e7a73]">
                          Try another status or search term.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </section>

              {activeOrder && (
                <DeliveryTracker
                  order={activeOrder}
                  onViewDetails={() => setSelectedOrder(activeOrder)}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
          cancelOrder={cancelOrder}
            order={selectedOrder}
            productMap={productMap}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
