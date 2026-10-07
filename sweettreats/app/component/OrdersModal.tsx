"use client";

import { X, MapPin, Phone, Package, CreditCard } from "lucide-react";

type OrderItem = {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
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
      label: String ,
      name: String ,
      phone: String ,
      addressLine1: String ,
      city: String ,
      state: String ,
      postalCode: String ,
      country: String ,
    };
    city: string;
    state: string;
    pincode: string;
  };

  paymentMethod: string;
  paymentStatus: string;
  orderStatus:  "PENDING" | "CONFIRMED" | "PROCESSING"  | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

type OrderModalProps = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function OrderModal({
  order,
  open,
  onClose,
}: OrderModalProps) {
  if (!order) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/20
          backdrop-blur-[2px]
          transition-opacity duration-300
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed right-0 top-0 z-50
          flex h-dvh w-full flex-col
          bg-[var(--surface)]
          shadow-[-12px_0_40px_rgba(0,0,0,0.08)]
          transition-transform duration-300 ease-out
          sm:max-w-[520px]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ================= HEADER ================= */}
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Order details
              </h2>

              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                {getStatusLabel(order.orderStatus)}
              </span>
            </div>

            <p className="mt-1 text-xs text-[var(--muted)]">
              {order.orderId} · {formatDate(order.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-[var(--muted)]
              transition-colors
              hover:bg-[var(--hover)]
              hover:text-[var(--foreground)]
            "
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-7 px-5 py-6 sm:px-6">

            {/* ================= ITEMS ================= */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Items
                </h3>

                <span className="text-xs text-[var(--muted)]">
                  {order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items
                </span>
              </div>

              <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    {/* Product Image */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--background)]">
                      <img
                        src={`/images/products/${item.image}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {item.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
                        <span>Qty {item.quantity}</span>
                        <span>·</span>
                        <span>{formatCurrency(item.price)} each</span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <p className="shrink-0 text-sm font-semibold text-[var(--foreground)]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ================= DELIVERY ================= */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                Delivery details
              </h3>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)]">
                    <MapPin size={16} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {order.shippingAddress.name}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                      {order.shippingAddress.address.addressLine1}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)] pt-3">
                  <Phone
                    size={15}
                    strokeWidth={1.8}
                    className="text-[var(--muted)]"
                  />

                  <span className="text-sm text-[var(--foreground)]">
                    {order.shippingAddress.phone}
                  </span>
                </div>
              </div>
            </section>

            {/* ================= PAYMENT ================= */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                Payment
              </h3>

              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--background)]">
                    <CreditCard
                      size={16}
                      strokeWidth={1.8}
                      className="text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {order.paymentMethod}
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                      Payment status
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    rounded-full px-2.5 py-1
                    text-[11px] font-medium
                    ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-500/10 text-green-700"
                        : "bg-amber-500/10 text-amber-700"
                    }
                  `}
                >
                  {getStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </section>

            {/* ================= SUMMARY ================= */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                Order summary
              </h3>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">
                      Subtotal
                    </span>

                    <span className="text-[var(--foreground)]">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">
                      Delivery
                    </span>

                    <span className="text-[var(--foreground)]">
                      {formatCurrency(order.deliveryFee)}
                    </span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">
                        Discount
                      </span>

                      <span className="text-green-600">
                        -{formatCurrency(order.discount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[var(--border)] pt-3">
                    <div className="flex items-end justify-between">
                      <span className="font-medium text-[var(--foreground)]">
                        Total
                      </span>

                      <span className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <Package size={15} strokeWidth={1.8} />
              <span>Order #{order.orderId}</span>
            </div>

            <button
              type="button"
              className="
                rounded-lg
                bg-[var(--accent)]
                px-4 py-2.5
                text-sm font-medium
                text-white
                transition
                hover:opacity-90
                active:scale-[0.98]
              "
            >
              Manage order
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}

