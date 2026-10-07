"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  MoreHorizontal,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
  CreditCard,
} from "lucide-react";
import AdminHeader from "../sidebar";
import { useAuthStore } from "@/app/store/authStore";
import { Order } from "@/app/component/OrdersModal";

type OrderStatus =
  "PENDING" | "CONFIRMED" | "PROCESSING"  | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" ;



const statusOptions: OrderStatus[] = [
  "PENDING" ,
  "CONFIRMED" ,
  "PROCESSING" ,
  "OUT_FOR_DELIVERY" ,
  "DELIVERED" ,
  "CANCELLED" ,
];

type Tab = "ALL" | "PENDING" | "DELIVERED" | "CANCELLED";

const tabs: {
  key: Tab;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "ALL",
    label: "TOTAL ORDERS",
    icon: <ShoppingBag size={21} strokeWidth={2.2} />,
  },
  {
    key: "PENDING",
    label: "PENDING",
    icon: <Clock3 size={21} strokeWidth={2.2} />,
  },
  {
    key: "DELIVERED",
    label: "DELIVERED",
    icon: <Truck size={21} strokeWidth={2.2} />,
  },
  {
    key: "CANCELLED",
    label: "CANCELLED",
    icon: <X size={21} strokeWidth={2.5} />,
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: "bg-[#f7d5c6] text-[#743a2c]",
    CONFIRMED: "bg-[#dbe8ff] text-[#31598b]",
    PROCESSING: "bg-[#ffd638] text-[#3a1715]",
    OUT_FOR_DELIVERY: "bg-[#d8e8ff] text-[#31598b]",
    DELIVERED: "bg-[#b9ebc8] text-[#1c4b2b]",
    CANCELLED: "bg-[#f2d0d0] text-[#923939]",
  };

  const dots: Record<OrderStatus, string> = {
    PENDING: "bg-[#f29b24]",
    CONFIRMED: "bg-[#4b83c6]",
    PROCESSING: "bg-[#e74435]",
    OUT_FOR_DELIVERY: "bg-[#4b83c6]",
    DELIVERED: "bg-[#2b9a50]",
    CANCELLED: "bg-[#d64242]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 font-text tracking-wider text-[9px] font-black sm:text-[10px] ${styles[status]}`}
    >
      {status}

      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
    </span>
  );
}

function CustomerAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-[#ead4c5] text-[11px] font-black text-[#4a2722] shadow-sm">
      {initials}
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-2 font-text tracking-wider text-[9px] font-black uppercase tracking-[0.06em] text-[#907970]">
      {children}
    </p>
  );
}

export default function AdminOrdersPage() {
  const {orders,setOrder,allUsers} = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      ALL: orders.length,
      PENDING: orders.filter(
        (order) =>
          order.orderStatus === "PENDING" ||
          order.orderStatus === "CONFIRMED" ||
          order.orderStatus === "PROCESSING" ||
          order.orderStatus === "OUT_FOR_DELIVERY",
      ).length,
      DELIVERED: orders.filter((order) => order.orderStatus === "DELIVERED")
        .length,
      CANCELLED: orders.filter((order) => order.orderStatus === "CANCELLED")
        .length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesTab =
        activeTab === "ALL"
          ? true
          : activeTab === "PENDING"
            ? order.orderStatus !== "DELIVERED" &&
              order.orderStatus !== "CANCELLED"
            : order.orderStatus === activeTab;

      const matchesSearch =
        !query ||
        order.orderId.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query) ||
        order.userId.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  function toggleOrder(orderId: string) {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId,
    );
  }

  async function changeStatus(orderId: string, status: OrderStatus) {
    try {
                const response = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify({
                      status: status
                    })
                });
                const data = await (await response).json();
                if (data.success) {
                    setOrder(data.data);
                }
            } catch (error) {
                console.log(error)
            }
  }

  async function cancelOrder(orderId: string) {
    try {
                const response = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/admin/${orderId}/cancel`, {
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
    <main className="bg-[#f8f0e8] font-text min-h-screen">
      <AdminHeader activeTab="orders" />
      <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-6 text-[#351615] sm:px-6 lg:px-8 ">
        {/* =====================================================
            PAGE TITLE
        ===================================================== */}
        <section className="relative mb-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="relative inline-block">
                <h1 className="font-text tracking-wider text-[48px] font-black leading-[0.88] tracking-[-0.065em] text-[#351615] sm:text-[60px] lg:text-[70px]">
                  ORDERS
                </h1>

                <span className="absolute -bottom-3 left-0 h-[6px] w-[120px] rotate-[-2deg] rounded-full bg-[#ffd21c]" />
              </div>

              <p className="mt-5 text-[13px] font-text font-semibold text-[#775f58]">
                Track, manage and update all customer orders.
              </p>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="rotate-[-5deg] text-right font-text tracking-wider text-[13px] font-black leading-tight">
                Fresh orders,
                <br />
                happy customers!
              </div>

              <div className="flex h-[74px] w-[110px] rotate-[3deg] items-center justify-center rounded-[50%] bg-[#ffd36c] text-4xl">
                🍪
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATUS TABS
        ===================================================== */}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpandedOrder(null);
                }}
                className={[
                  "group relative overflow-hidden rounded-[20px] border px-5 py-4 text-left",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5",
                  active
                    ? "border-[#3b201c] bg-[#ffd21c] shadow-[0_3px_0_rgba(53,22,21,0.18)]"
                    : "border-[#876d64] bg-[#fffaf5]",
                ].join(" ")}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      active ? "bg-[#fff5c9]" : "bg-[#ffedb0]",
                    ].join(" ")}
                  >
                    {tab.icon}
                  </span>

                  <div>
                    <p className="font-text tracking-wider text-[10px] font-black tracking-[0.02em] text-[#684b44]">
                      {tab.label}
                    </p>

                    <p className="mt-0.5 font-text tracking-wider text-[29px] font-black tracking-[-0.05em]">
                      {counts[tab.key]}
                    </p>
                  </div>
                </div>

                {active && (
                  <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-[#351615]" />
                )}

                <div className="absolute right-5 bottom-4 opacity-60">
                  <span className="block h-[2px] w-5 rotate-[-55deg] bg-[#351615]" />
                  <span className="ml-3 mt-1 block h-[2px] w-3 rotate-[35deg] bg-[#351615]" />
                </div>
              </button>
            );
          })}
        </section>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}
        <section className="mb-4 rounded-[20px] border border-[#dfd3ca] bg-[#fffaf5] p-3 shadow-[0_2px_0_rgba(53,22,21,0.06)]">
          <div className="flex flex-col gap-2 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#907970]"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order id, customer name or email..."
                className="h-12 w-full rounded-[14px] font-text border border-[#e2d7cf] bg-white pl-11 pr-4 text-[12px] font-medium outline-none transition-colors placeholder:text-[#ae9d95] focus:border-[#aa8d80]"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={activeTab}
                onChange={(event) => {
                  setActiveTab(event.target.value as Tab);
                  setExpandedOrder(null);
                }}
                className="h-12 w-full appearance-none rounded-[14px] border border-[#e2d7cf] bg-white px-4 pr-10 text-[11px] font-bold outline-none sm:min-w-[160px]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>

            {/* Date */}
            <button className="flex h-12 items-center justify-between gap-8 rounded-[14px] border border-[#e2d7cf] bg-white px-4 text-[11px] font-bold sm:min-w-[165px]">
              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                Date Range
              </span>

              <ChevronDown size={15} />
            </button>

            {/* Export */}
            <button className="flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[#3b201c] bg-[#ffd21c] px-5 font-text tracking-wider text-[10px] font-black transition-colors hover:bg-[#ffdb43]">
              <ArrowDownToLine size={15} strokeWidth={2.5} />
              EXPORT
            </button>
          </div>
        </section>

        {/* =====================================================
            ORDER LIST
        ===================================================== */}
        <section className="overflow-hidden rounded-[22px] border border-[#876d64] bg-[#fffaf5] shadow-[0_2px_0_rgba(53,22,21,0.1)]">
          {/* Desktop table header */}
          <div className="hidden border-b border-[#e5d9d1] px-5 py-4 md:grid md:grid-cols-[120px_1.35fr_1fr_100px_145px_155px_100px] md:items-center md:gap-3 lg:px-6">
            <HeaderCell>ORDER ID</HeaderCell>
            <HeaderCell>CUSTOMER</HeaderCell>
            <HeaderCell>ITEMS</HeaderCell>
            <HeaderCell>AMOUNT</HeaderCell>
            <HeaderCell>STATUS</HeaderCell>
            <HeaderCell>ACTIONS</HeaderCell>
            <HeaderCell> </HeaderCell>
          </div>

          <div>
            {filteredOrders.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffedb0] text-3xl">
                  🍪
                </div>

                <h3 className="font-text tracking-wider text-xl font-black">
                  NO ORDERS FOUND
                </h3>

                <p className="mt-2 text-sm text-[#806a62]">
                  Try changing your search or selected status.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrder === order.orderId;
                const currentUser = allUsers?.find(user=>user._id==order.userId)

                return (
                  <div
                    key={order.orderId}
                    className="border-b border-[#e9dfd8] last:border-0"
                  >
                    {/* =================================================
                        ORDER ROW
                    ================================================= */}
                    <div
                      // type="button"
                      onClick={() => toggleOrder(order.orderId)}
                      className={[
                        "group w-full text-left transition-colors",
                        isExpanded
                          ? "bg-white"
                          : "hover:bg-[#fff8f0]",
                      ].join(" ")}
                    >
                      {/* Desktop */}
                      <div className="hidden px-5 py-4 md:grid md:grid-cols-[120px_1.35fr_1fr_100px_145px_155px_100px] md:items-center md:gap-3 lg:px-6">
                        <div>
                          <span className="font-text tracking-wider text-[11px] font-black">
                            {order.orderId}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <CustomerAvatar initials={currentUser?.name[0] || ""} />

                          <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold">
                              {currentUser?.name || ""}
                            </p>

                            <p className="mt-0.5 truncate text-[9px] font-medium text-[#907970]">
                              {currentUser?.email || ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {order.items.slice(0, 2).map((item, index) => (
                            <p
                              key={`${order.orderId}-${index}`}
                              className="flex h-8 w-8 overflow-hidden items-center justify-center rounded-full border border-[#e4d6cb] bg-[#fff3df] text-[16px]"
                            >
                              <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.image}`} className="object-fill h-full w-full" />
                            </p>
                          ))}

                          {order.items.length > 2 && (
                            <span className="ml-1 text-[10px] font-bold text-[#806a62]">
                              +{order.items.length - 2}
                            </span>
                          )}
                        </div>

                        <span className="font-text tracking-wider text-[12px] font-black">
                          {formatCurrency(order.total)}
                        </span>

                        <StatusBadge status={order.orderStatus as OrderStatus} />

                        <div
                          className="flex items-center gap-2"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <StatusSelect
                            order={order}
                            onChange={changeStatus}
                          />

                          {order.orderStatus !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order._id)}
                              className="rounded-full border hover:bg-red-400 hover:text-white transition duration-200 cursor-pointer border-[#ef8b82] px-3 py-2 font-text tracking-wider text-[9px] font-black text-[#d94438] transition-colors hover:bg-[#fff0ee]"
                            >
                              CANCEL
                            </button>
                          )}
                        </div>

                        <div className="flex ml-auto w-max">
                          {isExpanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="flex items-center gap-3 px-4 py-4 md:hidden">
                        <CustomerAvatar initials={order.userId[0]} />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-text tracking-wider text-[11px] font-black">
                              {order.orderId}
                            </span>

                            <span className="font-text tracking-wider text-[13px] font-black">
                              {formatCurrency(order.total)}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[11px] font-bold">
                            {currentUser?.name || ""}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <StatusBadge status={order.orderStatus as OrderStatus} />

                            <span className="text-[9px] font-medium text-[#907970]">
                              {/* {order.date} */}date
                            </span>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        EXPANDED ORDER
                    ================================================= */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
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
                            duration: 0.22,
                            ease: "easeOut",
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#eadfd7] bg-[#fff] px-4 pb-5 pt-4 sm:px-6">
                            {/* Mobile actions */}
                            <div
                              className="mb-5 flex flex-wrap gap-2 md:hidden"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                            >
                              <StatusSelect
                                order={order}
                                onChange={changeStatus}
                                fullWidth
                              />

                              {order.orderStatus !== "CANCELLED" && (
                                <button
                                  type="button"
                                  onClick={() => cancelOrder(order.orderId)}
                                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#ef8b82] bg-white px-4 font-text tracking-wider text-[9px] font-black text-[#d94438]"
                                >
                                  <X size={14} />
                                  CANCEL ORDER
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
                              {/* Customer */}
                              <div className="rounded-2xl border border-[#e4d8d0] bg-white p-4">
                                <SectionLabel>CUSTOMER</SectionLabel>

                                <div className="flex items-center gap-3">
                                  <CustomerAvatar
                                    initials={order.userId[0]}
                                    // initials={order.initials}
                                  />

                                  <div>
                                    <p className="text-[12px] font-bold">
                                      {currentUser?.name || ""}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#806a62]">
                                      <User size={11} />
                                      {currentUser?.email || ""}
                                    </p>

                                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#806a62]">
                                      <Phone size={11} />
                                      {currentUser?.savedAddresses[0].phone || ""}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Delivery */}
                              <div className="rounded-2xl border border-[#e4d8d0] bg-white p-4">
                                <SectionLabel>DELIVERY ADDRESS</SectionLabel>

                                <div className="flex gap-3">
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffedb0]">
                                    <MapPin size={16} />
                                  </span>

                                  <p className="pt-1 text-[11px] font-medium leading-relaxed text-[#60453e] flex flex-col">
                                    <span className="font-bold">{order.shippingAddress.address.label}</span>
                                    <span>
                                      {order.shippingAddress.address.addressLine1}, &nbsp;
                                      {order.shippingAddress.address.city}, PIN: &nbsp;
                                      {order.shippingAddress.address.postalCode}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Payment */}
                              <div className="rounded-2xl border border-[#e4d8d0] bg-white p-4">
                                <SectionLabel>PAYMENT</SectionLabel>

                                <div className="flex gap-3">
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff0e2]">
                                    <CreditCard size={16} />
                                  </span>

                                  <div>
                                    <p className="text-[11px] font-bold capitalize">
                                      {order.paymentMethod}
                                    </p>

                                    <span
                                      className={[
                                        "mt-1 inline-flex rounded-full px-2.5 py-1 text-[8px] font-black",
                                        order.paymentStatus === "PAID"
                                          ? "bg-[#b9ebc8] text-[#1c4b2b]"
                                          : order.paymentStatus ===
                                              "REFUNDED"
                                            ? "bg-[#f2d0d0] text-[#923939]"
                                            : "bg-[#ffdca9] text-[#784d1f]",
                                      ].join(" ")}
                                    >
                                      {order.paymentStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom details */}
                            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                              {/* Items */}
                              <div className="rounded-2xl border border-[#e4d8d0] bg-white p-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <SectionLabel>ORDER ITEMS</SectionLabel>

                                  <span className="text-[9px] font-semibold text-[#907970]">
                                    {order.items.reduce(
                                      (sum, item) =>
                                        sum + item.quantity,
                                      0,
                                    )}{" "}
                                    items
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.name}
                                      className="flex items-center gap-3 rounded-xl bg-[#fff8f0] p-2.5"
                                    >
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/images/${item.image}`} alt="" className="w-15 rounded-lg" />

                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-text font-bold">
                                          {item.name}
                                        </p>

                                        <p className="mt-1 text-xs font-text text-[#907970]">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>

                                      <span className="font-text tracking-wider text-xs font-text font-semibold">
                                        {item.price} x {item.quantity} = &nbsp;
                                        {formatCurrency(
                                          item.price *
                                            item.quantity,
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Summary */}
                              <div className="rounded-2xl border border-[#e4d8d0] bg-white p-4">
                                <SectionLabel>ORDER SUMMARY</SectionLabel>

                                <div className="space-y-2 text-[10px]">
                                  <div className="flex justify-between">
                                    <span className="text-[#806a62]">
                                      Subtotal
                                    </span>

                                    <span className="font-semibold">
                                      {formatCurrency(order.subtotal)}
                                    </span>
                                  </div>

                                  <div className="flex justify-between">
                                    <span className="text-[#806a62]">
                                      Delivery
                                    </span>

                                    <span className="font-semibold">
                                      {formatCurrency(order.deliveryFee)}
                                    </span>
                                  </div>

                                  <div className="my-3 border-t border-dashed border-[#d9cbc2]" />

                                  <div className="flex items-center justify-between">
                                    <span className="font-text tracking-wider text-[11px] font-black">
                                      TOTAL
                                    </span>

                                    <span className="font-text tracking-wider text-[20px] font-black">
                                      {formatCurrency(order.total)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order metadata */}
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] font-semibold text-[#907970]">
                              <span className="flex items-center gap-1.5">
                                <CalendarDays size={12} />
                                Placed
                                 {/* {order.date} */}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Package size={12} />
                                Order {order.orderId}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Check size={12} />
                                Payment {order.paymentStatus.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* =====================================================
              PAGINATION
          ===================================================== */}
          {/* <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5d9d1] px-5 py-4 sm:flex-row">
            <p className="text-[10px] font-medium text-[#806a62]">
              Showing{" "}
              <span className="font-bold">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-bold">{orders.length}</span>{" "}
              orders
            </p>

            <div className="flex items-center gap-1">
              <PaginationButton>
                <ChevronDown className="rotate-90" size={14} />
              </PaginationButton>

              <PaginationButton active>1</PaginationButton>
              <PaginationButton>2</PaginationButton>
              <PaginationButton>3</PaginationButton>
              <PaginationButton>4</PaginationButton>

              <PaginationButton>
                <ChevronDown className="-rotate-90" size={14} />
              </PaginationButton>
            </div>
          </div> */}
        </section>
      </div>
    </main>
  );
}

/* ===============================================================
   SMALL COMPONENTS
=============================================================== */

function HeaderCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="font-text tracking-wider text-[9px] font-black tracking-[0.05em] text-[#806a62]">
      {children}
    </span>
  );
}

function PaginationButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-text tracking-wider text-[10px] font-black",
        active
          ? "bg-[#ffd21c] text-[#351615]"
          : "text-[#806a62] hover:bg-[#f5e9df]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusSelect({
  order,
  onChange,
  fullWidth = false,
}: {
  order: Order;
  onChange: (id: string, status: OrderStatus) => void;
  fullWidth?: boolean;
}) {
  if (order.orderStatus === "CANCELLED") {
    return (
      <div
        className={[
          "flex h-10 items-center gap-2 rounded-xl border border-[#e4d8d0] bg-white px-3",
          fullWidth ? "flex-1" : "",
        ].join(" ")}
      >
        <X size={13} className="text-[#d64242]" />
        <span className="font-text tracking-wider text-[9px] font-black text-[#923939]">
          CANCELLED
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        "relative",
        fullWidth ? "flex-1" : "",
      ].join(" ")}
    >
      <select
        value={order.orderStatus}
        onChange={(event) =>
          onChange(
            order._id,
            event.target.value as OrderStatus,
          )
        }
        onClick={(event) => event.stopPropagation()}
        className={[
          "h-10 appearance-none  rounded-xl border border-[#dfd2c9] bg-white px-3 pr-8 font-text tracking-wider text-[9px] font-black outline-none",
          fullWidth ? "w-full" : "w-[135px]",
        ].join(" ")}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}