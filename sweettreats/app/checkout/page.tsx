"use client";

import { ReactNode, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gift,
  Home,
  MapPin,
  Minus,
  Pencil,
  Phone,
  Plus,
  ReceiptText,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Truck,
  WalletCards,
  X,
} from "lucide-react";

import { SavedAddress, SavedPaymentMethod, useAuthStore } from "../store/authStore";
import {  useRouter } from "next/navigation";
import {User} from "../store/authStore"

type Coupon = {
  code: string;
  label: string;
  discount: number;
  type: "percentage" | "fixed";
};

const COUPONS: Coupon[] = [
  { code: "FIRSTBAKE", label: "10% OFF", discount: 10, type: "percentage" },
  { code: "SWEET20", label: "₹20 OFF", discount: 20, type: "fixed" },
];

const SUGGESTED_STORE = {
  name: "SweetTreats · Central Store",
  address: "Central Market, near the main entrance",
  distance: "2.4 km away",
  travelTime: "8–12 min drive",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const easing = [0.22, 1, 0.36, 1] as const;

const money = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

type CheckoutStep = 1 | 2 | 3 | 4;

const STEP_DATA: Array<{
  number: CheckoutStep;
  label: string;
  short: string;
}> = [
  { number: 1, label: "Your order", short: "ORDER" },
  { number: 2, label: "Coupon & contact", short: "SWEET DEALS" },
  { number: 3, label: "Delivery", short: "DELIVERY" },
  { number: 4, label: "Payment", short: "PAYMENT" },
];

const stepCopy: Record<CheckoutStep, { eyebrow: string; title: string; description: string }> = {
  1: {
    eyebrow: "01 · Your order",
    title: "WHAT'S IN THE BAG?",
    description: "Give everything one last look before the sweet journey begins.",
  },
  2: {
    eyebrow: "02 · Sweet deals",
    title: "A LITTLE SOMETHING EXTRA?",
    description: "Apply an offer and leave us a number for order updates.",
  },
  3: {
    eyebrow: "03 · Delivery",
    title: "HOW SHOULD WE MEET?",
    description: "Fresh to your door or ready for you at our Central Store.",
  },
  4: {
    eyebrow: "04 · Payment",
    title: "LET'S MAKE IT OFFICIAL",
    description: "Choose your payment method, check the receipt, and place your order.",
  },
};

export default function CheckoutPage() {
  const { cart, products, setCartItem, user, setUser } = useAuthStore();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("card");
  const [phone, setPhone] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);


  const cartProducts = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => String(p._id) === String(item.productId));
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [cart, products]
  );

  const subtotal = useMemo(
    () => cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartProducts]
  );

  const deliveryFee = deliveryMethod === "pickup" ? 0 : subtotal >= 500 ? 0 : 30;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "fixed") return Math.min(appliedCoupon.discount, subtotal);
    return Math.round(subtotal * (appliedCoupon.discount / 100));
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal + deliveryFee - discount);

  function updateQuantity(productId: string, quantity: number) {
    const nextCart = cart
      .map((item) =>
        String(item.productId) === String(productId) ? { ...item, quantity } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItem(nextCart);
  }

  function removeItem(productId: string) {
    setCartItem(cart.filter((item) => String(item.productId) !== String(productId)));
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }

    const coupon = COUPONS.find((item) => item.code === code);
    if (!coupon) {
      setCouponError("That coupon isn't valid.");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setCouponError("");
  }

  function applySuggestedCoupon(coupon: Coupon) {
    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setCouponError("");
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  }

  function continueCheckout() {
    if (step === 1) {
      if (cartProducts.length === 0) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!phone.trim()) {
        alert("Please enter your phone number.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (deliveryMethod === "delivery" && !selectedAddress) {
        alert("Please select your delivery address.");
        return;
      }
      setStep(4);
      return;
    }

    void onPlaceOrder();
  }
   const router = useRouter();

  async function onPlaceOrder() {
    if (placingOrder) return;

    try {
      setPlacingOrder(true);

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            name: user?.name,
            phone: phone.trim(),
            address:
              deliveryMethod === "delivery"
                ? selectedAddress
                : "SweetTreats, Central Market, near the main entrance",
            city: selectedAddress?.city || "delhi",
            state: "",
            pincode: selectedAddress?.postalCode || "delhi",
          },
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to create order");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 700));
      router.replace("/order")
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong while placing your order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  function goBack() {
    if (step > 1) {
      setStep((current) => Math.max(1, current - 1) as CheckoutStep);
      return;
    }
    window.history.back();
  }

 

  const [addressForm, setAddressForm] = useState({
    label: "Home",
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [addressModal, setAddressModal] = useState<{
      open: boolean;
      address?: SavedAddress;
    }>({
      open: false,
    });

  const saveAddress = async () => {
    if (!addressForm.address || !addressForm.city) return;

    try{
      const response  = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/users/me/addresses",{
        method:"POST",
        credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  label: addressForm.label,
                  name:  addressForm.name,
    phone:  addressForm.phone,
    addressLine1:  addressForm.address,
    city:  addressForm.city,
    state: addressForm.city,
    postalCode: addressForm.pincode,
    country: "India",
                })
      })
      const data = await (await response).json()

      if(data.success){
        setUser({
                    id: data.data["_id"],
                    email: data.data["email"],
                    name: data.data["name"],
                    savedAddresses: data.data["savedAddresses"],
                    payment: data.data["savedPaymentMethods"]
                })
      }else{
        alert("error")
        console.log("error occured",data.message)
      }
    }catch(error){
      console.log(error)
    }
    setAddressModal({
      open: false,
    });
  };

  const openAddAddress = () => {
    setAddressForm({
      label: "Home",
      name: user?.name || "",
      address: "",
      city: "",
      pincode: "",
      phone: "",
    });

    setAddressModal({
      open: true,
    });
  };

  

  const [selectedPayment,setSelectedPayment] = useState<SavedPaymentMethod|null>(null)
   const [paymentModal, setPaymentModal] = useState(false);
    const savePayment = async () => {
    if (!paymentForm.details) return;

     try{
      const paymentMethod = {
  provider: paymentForm.type,
  type: "card",
  brand: paymentForm.type,
  last4: paymentForm.details,
  expiryMonth: Number(paymentForm.expiry.split("/")[0]),
  expiryYear: Number(`20${paymentForm.expiry.split("/")[1]}`),
  isDefault: true,
};
      const response  = fetch(process.env.NEXT_PUBLIC_API_URL+"/api/users/me/payments",{
        method:"POST",
        credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                 body: JSON.stringify(paymentMethod),
      })
      const data = await (await response).json()

      if(data.success){
        setUser({
                    id: data.data["_id"],
                    email: data.data["email"],
                    name: data.data["name"],
                    savedAddresses: data.data["savedAddresses"],
                    payment: data.data["savedPaymentMethods"]
                })
      }else{
        alert("error")
        console.log("error occured",data.message)
      }
    }catch(error){
      console.log(error)
    }

    setPaymentForm({
      type: "visa",
      details: "",
      expiry: "",
    });

    setPaymentModal(false);
  };
   const [paymentForm, setPaymentForm] = useState({
       type: "visa" as "visa" | "mastercard" | "upi",
       details: "",
       expiry: "",
     });

   if (cartProducts.length === 0) {
    return <EmptyCheckout />;
  }

  function clickStep(num:CheckoutStep){
    setStep(num)
  }

  return (
    <>
    <main className="min-h-screen overflow-hidden bg-[#F8EFE7] text-[#321D18]">
      <div className="mx-auto max-w-[1360px] px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-7">
        <CheckoutHeader step={step} onBack={goBack} />
        <CheckoutProgress step={step} clickStep={clickStep} />

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-9">
          <section className="min-w-0">
            <StepIntro step={step} />

            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div key="step-1" {...stepMotion}>
                  <OrderStep
                    cartProducts={cartProducts}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    onContinue={continueCheckout}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step-2" {...stepMotion}>
                  <CouponStep
                    phone={phone}
                    setPhone={setPhone}
                    couponInput={couponInput}
                    setCouponInput={setCouponInput}
                    appliedCoupon={appliedCoupon}
                    couponError={couponError}
                    applyCoupon={applyCoupon}
                    applySuggestedCoupon={applySuggestedCoupon}
                    removeCoupon={removeCoupon}
                    onContinue={continueCheckout}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step-3" {...stepMotion}>
                  <DeliveryStep
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    openAddAddress={openAddAddress}
                    phone={phone}
                    deliveryFee={deliveryFee}
                    onContinue={continueCheckout}
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step-4" {...stepMotion}>
                  <PaymentStep
                  user={user}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    cartProducts={cartProducts}
                    phone={phone}
                    deliveryMethod={deliveryMethod}
                    selectedAddress={selectedAddress}
                    appliedCoupon={appliedCoupon}
                    selectedPayment={selectedPayment}
                    setSelectedPayment={setSelectedPayment}
                    subtotal={subtotal}
                    setPaymentModal={setPaymentModal}
                    deliveryFee={deliveryFee}
                    discount={discount}
                    total={total}
                    placingOrder={placingOrder}
                    onPlaceOrder={onPlaceOrder}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <CheckoutReceipt
            step={step}
            cartProducts={cartProducts}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={total}
            appliedCoupon={appliedCoupon}
            placingOrder={placingOrder}
            onAction={continueCheckout}
          />
        </div>
      </div>
    </main>
    
     <AnimatePresence>
            {addressModal.open && (
              <Modal
                title={
                  addressModal.address
                    ? "Edit address"
                    : "Add an address"
                }
                eyebrow="Delivery"
                accent="yellow"
                onClose={() =>
                  setAddressModal({
                    open: false,
                  })
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectInput
                    label="Address type"
                    value={addressForm.label}
                    onChange={(value) =>
                      setAddressForm((current) => ({
                        ...current,
                        label: value,
                      }))
                    }
                    options={[
                      "Home",
                      "Work",
                      "Other",
                    ]}
                  />
    
                  <Input
                    label="Name"
                    value={addressForm.name}
                    onChange={(value) =>
                      setAddressForm((current) => ({
                        ...current,
                        name: value,
                      }))
                    }
                  />
    
                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      value={addressForm.address}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          address: value,
                        }))
                      }
                    />
                  </div>
    
                  <Input
                    label="City"
                    value={addressForm.city}
                    onChange={(value) =>
                      setAddressForm((current) => ({
                        ...current,
                        city: value,
                      }))
                    }
                  />
    
                  <Input
                    label="Pincode"
                    value={addressForm.pincode}
                    onChange={(value) =>
                      setAddressForm((current) => ({
                        ...current,
                        pincode: value,
                      }))
                    }
                  />
    
                  <div className="sm:col-span-2">
                    <Input
                      label="Phone"
                      value={addressForm.phone}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          phone: value,
                        }))
                      }
                    />
                  </div>
                </div>
    
                <ModalActions
                  onCancel={() =>
                    setAddressModal({
                      open: false,
                    })
                  }
                  onSave={saveAddress}
                />
              </Modal>
            )}
          </AnimatePresence>


          <AnimatePresence>
                  {paymentModal && (
                    <Modal
                      title="Add payment"
                      eyebrow="Checkout"
                      accent="orange"
                      onClose={() =>
                        setPaymentModal(false)
                      }
                    >
                      <SelectInput
                        label="Payment type"
                        value={paymentForm.type}
                        onChange={(value) =>
                          setPaymentForm((current) => ({
                            ...current,
                            type:
                              value as typeof paymentForm.type,
                          }))
                        }
                        options={[
                          "visa",
                          "mastercard",
                          "upi",
                        ]}
                      />
          
                      <div className="mt-4">
                        <Input
                          label={
                            paymentForm.type === "upi"
                              ? "UPI ID"
                              : "Card number"
                          }
                          value={paymentForm.details}
                          onChange={(value) =>
                            setPaymentForm((current) => ({
                              ...current,
                              details: value,
                            }))
                          }
                          placeholder={
                            paymentForm.type === "upi"
                              ? "name@upi"
                              : "•••• •••• •••• ••••"
                          }
                        />
                      </div>
          
                      {paymentForm.type !== "upi" && (
                        <div className="mt-4">
                          <Input
                            label="Expiry"
                            value={paymentForm.expiry}
                            onChange={(value) =>
                              setPaymentForm((current) => ({
                                ...current,
                                expiry: value,
                              }))
                            }
                            placeholder="MM/YY"
                          />
                        </div>
                      )}
          
                      <ModalActions
                        onCancel={() =>
                          setPaymentModal(false)
                        }
                        onSave={savePayment}
                      />
                    </Modal>
                  )}
                </AnimatePresence>
    </>
  );
}

const stepMotion = {
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(3px)" },
  transition: { duration: 0.42, ease: easing },
};

function CheckoutHeader({ step, onBack }: { step: CheckoutStep; onBack: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: easing }}
      className="mb-6"
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-full border border-[#4A1E1C]/10 bg-white/70 px-3.5 py-2 text-[11px] font-bold text-[#6E5750] backdrop-blur transition hover:bg-white"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        <div className="text-right">
          <p className="font-header text-[22px] font-black leading-none tracking-[-0.05em] text-[#3D1715] sm:text-[28px]">
            SWEETREATS<span className="text-[#E55731]">.</span>
          </p>
          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-[#927B72]">
            Freshly baked checkout
          </p>
        </div>
      </div>
    </motion.header>
  );
}

function CheckoutProgress({ step, clickStep }: { step: CheckoutStep; clickStep: (num:CheckoutStep)=>void; }) {
  
  return (
    <div className="mb-7 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex min-w-[620px] items-center rounded-full border border-[#4A1E1C]/10 bg-white/75 p-1.5 shadow-sm backdrop-blur">
        {STEP_DATA.map((item, index) => {
          const complete = step > item.number;
          const current = step === item.number;

          return (
            <div key={item.number} onClick={()=>clickStep(index+1 as CheckoutStep)} className="flex min-w-0 flex-1 items-center cursor-pointer  "  >
              <div className="relative flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3 py-2">
                {current && (
                  <motion.div
                    layoutId="checkout-current-step"
                    className="absolute inset-0 rounded-full bg-[#FFD21C]"
                    transition={{ duration: 0.4, ease: easing }}
                  />
                )}

                <motion.div
                  animate={{ scale: current ? [1, 1.08, 1] : 1 }}
                  transition={{ duration: 0.8 }}
                  className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    complete || current ? "bg-[#3D1715] text-white" : "bg-[#F1E6DC] text-[#9A8378]"
                  }`}
                >
                  {complete ? <Check size={13} strokeWidth={3} /> : item.number}
                </motion.div>

                <span
                  className={`relative z-[1] hidden truncate text-sm font-header uppercase tracking-[0.08em] sm:block ${
                    current ? "text-[#3D1715]" : complete ? "text-[#66504A]" : "text-[#A38E84]"
                  }`}
                >
                  {item.label}
                </span>
                <span className="relative z-[1] text-[9px] font-black tracking-[0.08em] sm:hidden">
                  {item.short}
                </span>
              </div>

              {index < STEP_DATA.length - 1 && (
                <div className="mx-1 h-px w-5 shrink-0 bg-[#DED1C6] sm:w-10">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: step > item.number ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: easing }}
                    className="h-full origin-left bg-[#3D1715]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepIntro({ step }: { step: CheckoutStep }) {
  const copy = stepCopy[step];
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6"
    >
      <p className="text-[9px] font-text font-semibold uppercase tracking-[0.22em] text-[#9B8177]">
        {copy.eyebrow}
      </p>
      <h2 className="mt-2 font-header text-[34px] uppercase leading-[0.9] tracking-[-0.045em] text-[#3D1715] sm:text-[44px]">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-[650px] font-text text-sm leading-6 text-[#7A645B]">
        {copy.description}
      </p>
    </motion.div>
  );
}

function CheckoutReceipt({
  step,
  cartProducts,
  subtotal,
  deliveryFee,
  discount,
  total,
  appliedCoupon,
  placingOrder,
  onAction,
}: {
  step: CheckoutStep;
  cartProducts: { product: any; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  placingOrder: boolean;
  onAction: () => void;
}) {
  const itemCount = cartProducts.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: easing, delay: 0.08 }}
      className="lg:sticky lg:top-5"
    >
      <div className="relative overflow-hidden rounded-[30px] border border-[#4A1E1C]/10 bg-[#FFFDF9] shadow-[0_14px_50px_rgba(61,24,20,0.07)]">
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-[#FFD21C]" />
        <div className="absolute -right-10 top-16 h-32 w-32 rounded-full bg-[#FFD21C]/15 blur-2xl" />

        <div className="relative border-b border-dashed border-[#DCCDC2] px-5 pb-5 pt-7 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              {/* <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#9A8177]">
                Sweet receipt
              </p> */}
              <h3 className="mt-1 font-header text-[25px] font-black uppercase tracking-[-0.04em] text-[#3D1715]">
                Your order
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0B0] text-[#3D1715]">
              <ReceiptText size={18} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {cartProducts.slice(0, 4).map(({ product, quantity }) => (
              <div key={String(product._id)} className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[12px] bg-[#F3E4D7]">
                  <img
                    src={`${API_BASE}/images/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-header tracking-wider text-[#3D1715]">{product.name}</p>
                  <p className="mt-0.5 text-[9px] font-text font-semibold text-[#9A8379]">Qty {quantity}</p>
                </div>
                <span className="text-[11px] font-bold text-[#4E3932] font-text">
                  {money(product.price * quantity)}
                </span>
              </div>
            ))}
            {cartProducts.length > 4 && (
              <p className="pt-1 text-[10px] font-bold text-[#9A8177]">
                + {cartProducts.length - 4} more product{cartProducts.length - 4 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="space-y-2.5">
            <SummaryRow label={`Subtotal · ${itemCount} item${itemCount !== 1 ? "s" : ""}`} value={money(subtotal)} />
            <SummaryRow label="Delivery" value={deliveryFee === 0 ? "FREE" : money(deliveryFee)} />
            {discount > 0 && <SummaryRow label={appliedCoupon?.code || "Discount"} value={`−${money(discount)}`} positive />}
          </div>

          <div className="my-5 border-t border-dashed border-[#DCCDC2]" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-header uppercase tracking-[0.18em] text-[#947B72]">You pay</p>
              <p className="mt-1 text-[10px] text-[#A08C82] font-header tracking-wider">Freshness included ♡</p>
            </div>
            <motion.p
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-header text-[30px] font-black tracking-[-0.05em] text-[#3D1715]"
            >
              {money(total)}
            </motion.p>
          </div>
        </div>

        <div className="border-t border-[#E7D9CE] p-4">
          <motion.button
            type="button"
            disabled={placingOrder}
            onClick={onAction}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            className="relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#3D1715] px-5 py-3.5 text-xs font-header uppercase tracking-[0.1em] text-white transition hover:bg-[#52211D] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {placingOrder ? "Packing your order..." : step === 4 ? "Place my order" : step === 1 ? "Continue to sweet deals" : step === 2 ? "Continue to delivery" : "Continue to payment"}
            {placingOrder ? <Sparkles size={15} className="animate-pulse" /> : step === 4 ? <Check size={16} /> : <ArrowRight size={16} />}
          </motion.button>
        </div>
      </div>

      <motion.div
        whileHover={{ y: -3 }}
        className="mt-4 overflow-hidden rounded-[26px] bg-[#FFD21C] p-5  relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 z-[10] relative">
          <div>
            <p className="font-header text-[25px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#3D1715]">
              GOOD THINGS
              <br />
              TAKE TIME
            </p>
            <p className="mt-3 max-w-[220px] text-[11px] font-medium leading-5 text-[#654C45] font-text">
              But we&apos;re making sure every bite is worth the wait.
            </p>
          </div>
        </div>
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-9xl absolute -right-10 -top-5"
          >
            🍪
          </motion.div>
      </motion.div>
    </motion.aside>
  );
}

function OrderStep({
  cartProducts,
  updateQuantity,
  removeItem,
  onContinue,
}: {
  cartProducts: { product: any; quantity: number }[];
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[28px] border border-[#4A1E1C]/10 bg-white shadow-[0_8px_30px_rgba(61,24,20,0.04)]">
        <div className="flex items-center justify-between border-b border-[#EDE1D7] px-5 py-4 sm:px-6">
          <div>
            <h3 className="mt-1 text-sm font-text text-[#3D1715]">
              {cartProducts.length} product{cartProducts.length !== 1 ? "s" : ""} in your bag
            </h3>
          </div>
          <ShoppingBag size={18} className="text-[#8E7168]" />
        </div>

        <div className="divide-y divide-[#EDE1D7]">
          <AnimatePresence initial={false}>
            {cartProducts.map(({ product, quantity }) => (
              <motion.article
                layout
                key={String(product._id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.35, ease: easing }}
                className="group p-4 sm:p-5"
              >
                <div className="flex gap-4 sm:gap-5">
                  <motion.div
                    whileHover={{ scale: 1.035, rotate: -1 }}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-[#F3E3D7] sm:h-28 sm:w-28"
                  >
                    <img
                      src={`${API_BASE}/images/${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-header text-[18px] font-black tracking-[0.03em] text-[#3D1715] sm:text-[20px]">
                          {product.name}
                        </p>
                        <p className="mt-1 text-[10px] font-bold font-text uppercase tracking-[0.12em] text-[#9A8278]">
                          {product.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(String(product._id))}
                        aria-label={`Remove ${product.name}`}
                        className="rounded-full p-2 text-[#A59085] transition hover:bg-[#F9EDEA] hover:text-[#9D443C] sm:hidden"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <QuantityControl
                        quantity={quantity}
                        onDecrease={() => updateQuantity(String(product._id), quantity - 1)}
                        onIncrease={() => updateQuantity(String(product._id), quantity + 1)}
                      />

                      <motion.p
                        key={product.price * quantity}
                        initial={{ scale: 0.94, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-header text-[20px] font-black tracking-[-0.03em] text-[#3D1715]"
                      >
                        {money(product.price * quantity)}
                      </motion.p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(String(product._id))}
                      className="mt-3 hidden items-center gap-1.5 text-[10px] font-text font-semibold text-[#9A8177] transition hover:text-[#9D443C] sm:flex"
                    >
                      <Trash2 size={12} />
                      Remove from bag
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <SmallAssurance text="Everything above is still editable. No order has been placed yet." icon={<ShoppingBag size={15} />} />

      <div className="flex justify-end pt-2 lg:hidden">
        <PrimaryButton onClick={onContinue}>
          Continue to sweet deals <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}

function CouponStep({
  phone,
  setPhone,
  couponInput,
  setCouponInput,
  appliedCoupon,
  couponError,
  applyCoupon,
  applySuggestedCoupon,
  removeCoupon,
  onContinue,
}: {
  phone: string;
  setPhone: (value: string) => void;
  couponInput: string;
  setCouponInput: (value: string) => void;
  appliedCoupon: Coupon | null;
  couponError: string;
  applyCoupon: () => void;
  applySuggestedCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-4">
      <motion.section
        whileHover={{ y: -2 }}
        className="relative overflow-hidden rounded-[28px] bg-[#FFD21C] p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 rotate-12 text-7xl opacity-20">🎟️</div>
        <div className="relative z-[1]">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#74561D]">
            <Tag size={14} />
            Sweet deal
          </div>
          <h3 className="mt-2 font-header text-[28px] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#3D1715] sm:text-[34px]">
            GOT A SWEET DEAL?
          </h3>
          <p className="mt-2 max-w-md text-xs leading-5 text-[#685047] font-text">
            Enter your code or tap one of our available offers.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && applyCoupon()}
              placeholder="ENTER COUPON CODE"
              className="h-12 min-w-0 flex-1 rounded-full border-2 border-[#3D1715]/10 bg-white/90 px-5 text-xs font-text tracking-[0.08em] text-[#3D1715] outline-none placeholder:text-[#A58B75] focus:border-[#3D1715]/30"
            />
            <motion.button
              type="button"
              onClick={applyCoupon}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="h-12 rounded-full font-text bg-[#3D1715] px-6 text-xs  uppercase tracking-[0.08em] text-white"
            >
              Apply
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {couponError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-[11px] font-bold text-[#9B3C34]"
              >
                {couponError}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {COUPONS.map((coupon) => {
              const selected = appliedCoupon?.code === coupon.code;
              return (
                <motion.button
                  key={coupon.code}
                  type="button"
                  onClick={() => applySuggestedCoupon(coupon)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between rounded-[18px] border p-4 text-left transition ${
                    selected ? "border-[#3D1715] bg-white" : "border-[#3D1715]/10 bg-white/55 hover:bg-white/80"
                  }`}
                >
                  <div>
                    <p className="text-xs font-text font-bold text-[#3D1715]">{coupon.code}</p>
                    <p className="mt-1 text-[10px] font-text text-[#7D6257]">{coupon.label}</p>
                  </div>
                  {selected ? <CheckCircle2 size={17} /> : <ArrowRight size={15} />}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {appliedCoupon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-[#E9F3E7] px-4 py-3 text-[#41613B]"
              >
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <div>
                    <p className="text-xs font-black">{appliedCoupon.code}</p>
                    <p className="text-[10px] font-medium">{appliedCoupon.label} applied</p>
                  </div>
                </div>
                <button type="button" onClick={removeCoupon} className="rounded-full p-1.5 hover:bg-black/5">
                  <X size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.section
        whileHover={{ y: -2 }}
        className="rounded-[28px] border border-[#4A1E1C]/10 bg-white p-5 shadow-[0_8px_30px_rgba(61,24,20,0.035)] sm:p-7"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#FFF0B0] text-[#3D1715]">
            <Phone size={18} />
          </div>
          <div>
            {/* <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9A8177]">Stay reachable</p> */}
            <h3 className="mt-1 text-base font-black text-[#3D1715] font-header tracking-wider">WHERE CAN WE REACH YOU?</h3>
            <p className="mt-1 text-xs leading-5 text-[#816D64] font-text">We&apos;ll only use this number for order updates.</p>
          </div>
        </div>

        <label className="mt-6 block text-[10px] font-black uppercase tracking-[0.14em] text-[#765F56] font-text">Mobile number</label>
        <div className="mt-2 flex overflow-hidden rounded-full border border-[#DED0C5] bg-[#FBF7F2] focus-within:border-[#3D1715] focus-within:ring-4 focus-within:ring-[#FFD21C]/20">
          <span className=" font-text flex items-center bg-[#F1E5DB] px-4 text-xs font-black text-[#725C53]">+91</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            maxLength={10}
            placeholder="98765 43210"
            className="h-12 min-w-0 flex-1 font-text bg-transparent px-4 text-sm font-bold text-[#3D1715] outline-none placeholder:text-[#AD9A90]"
          />
        </div>
        <p className="mt-2 text-[10px] text-[#9B877D] font-text">Enter your 10-digit mobile number.</p>
      </motion.section>

      <div className="flex justify-end pt-2 lg:hidden">
        <PrimaryButton onClick={onContinue}>Continue to delivery <ArrowRight size={16} /></PrimaryButton>
      </div>
    </div>
  );
}

function DeliveryStep({
  deliveryMethod,
  setDeliveryMethod,
  selectedAddress,
  setSelectedAddress,
  openAddAddress,
  phone,
  deliveryFee,
  onContinue,
}: {
  deliveryMethod: "delivery" | "pickup";
  setDeliveryMethod: (value: "delivery" | "pickup") => void;
  selectedAddress: SavedAddress | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<SavedAddress | null>>;
  openAddAddress: ()=>void;
  phone: string;
  deliveryFee: number;
  onContinue: () => void;
}) {
  const {user} = useAuthStore()
  return (
    <div className="space-y-4" >
      <div className="grid gap-3 sm:grid-cols-2">
        <DeliveryMethodCard
          selected={deliveryMethod === "delivery"}
          icon={<Truck size={21} />}
          title="DELIVER TO ME"
          description={deliveryFee === 0 ? "Free delivery on this order" : `Delivery ${money(deliveryFee)}`}
          onClick={() => setDeliveryMethod("delivery")}
        />
        <DeliveryMethodCard
          selected={deliveryMethod === "pickup"}
          icon={<Store size={21} />}
          title="I'LL PICK IT UP"
          description="Ready for collection at our store"
          onClick={() => setDeliveryMethod("pickup")}
        />
      </div>

      <AnimatePresence mode="wait">
        {deliveryMethod === "delivery" ? (
          <motion.section
            key="delivery"
            {...cardSwapMotion}
            className="overflow-hidden rounded-[28px] border border-[#4A1E1C]/10 bg-white shadow-[0_8px_30px_rgba(61,24,20,0.035)]"
          >
            <div className="flex justify-between items-center">

            <div className="border-b border-[#EDE1D7] px-5 py-5 sm:px-7">
              <h3 className="mt-1 text-base font-header font-bold text-[#3D1715]">WHERE SHOULD WE BRING IT?</h3>
              <p className="mt-1 text-xs text-[#816D64] font-text">Choose one of your saved delivery addresses.</p>
            </div>
            <button onClick={openAddAddress} className="flex items-center mr-5 font-header tracking-wider rounded-sm text-white py-2 cursor-pointer px-3 justify-center text-xs gap-2 bg-[var(--foreground)] h-max w-max">
              <Plus size={14} /> Add Address
            </button>
            </div>
            <div className="p-4 sm:p-6">
              {/* <AddressPicker value={selectedAddress} onChange={setSelectedAddress} /> */}
              {user?.savedAddresses.map((address,index)=>(
                <div key={address._id}>
                    <AddressCard 
                      key={address.id}
                  address={address}
                  index={index}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  onEdit={() =>{}
                  }
                  onRemove={() =>{}
                  }
                  onDefault={() =>{}
                  }
                    />
                </div>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="pickup"
            {...cardSwapMotion}
            className="relative overflow-hidden rounded-[28px] bg-[#3D1715] p-6 text-white sm:p-8"
          >
            <div className="absolute -right-4 -top-8 text-8xl opacity-10">🏪</div>
            <div className="relative z-[1]">
              <div className="flex items-center gap-2 text-[9px] font-text uppercase tracking-[0.2em] text-[#FFD21C]">
                <Store size={14} />
                Suggested pickup spot
              </div>
              <h3 className="mt-3 max-w-[400px] font-header text-[31px] font-black uppercase leading-[0.92] tracking-[-0.04em]">
                {SUGGESTED_STORE.name}
              </h3>
              <p className="mt-3 max-w-[450px] text-sm leading-6 text-[#E8D8D0] font-text">{SUGGESTED_STORE.address}</p>

              <div className="mt-5 flex flex-wrap gap-2 font-text">
                <span className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold">{SUGGESTED_STORE.distance}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold">
                  <Clock3 size={12} /> {SUGGESTED_STORE.travelTime}
                </span>
                <span className="rounded-full bg-[#FFD21C] px-3 py-2 text-[10px] font-black text-[#3D1715]">FREE PICKUP</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <SmallAssurance text={`Order updates will be sent to +91 ${phone}.`} icon={<Phone size={15} />} />

      <div className="flex justify-end pt-2 lg:hidden">
        <PrimaryButton onClick={onContinue}>Continue to payment <ArrowRight size={16} /></PrimaryButton>
      </div>
    </div>
  );
}

function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  cartProducts,
  phone,
  user,
  deliveryMethod,
  selectedAddress,
  appliedCoupon,
  subtotal,
  deliveryFee,
  discount,
  total,
  setPaymentModal,
  placingOrder,
  setSelectedPayment,
  selectedPayment,
  onPlaceOrder,
}: {
  paymentMethod: "upi" | "card" | "cod";
  setPaymentMethod: (value: "upi" | "card" | "cod") => void;
  cartProducts: { product: any; quantity: number }[];
  phone: string;
  deliveryMethod: "delivery" | "pickup";
  selectedAddress: SavedAddress | null;
  appliedCoupon: Coupon | null;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  user: User | null;
  placingOrder: boolean;
  setPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  onPlaceOrder: () => void;
  selectedPayment: SavedPaymentMethod | null;
  setSelectedPayment: React.Dispatch<React.SetStateAction<SavedPaymentMethod|null>>;
}) {
  const {setUser} = useAuthStore()
  const removePayment = async (id: string) => {
       
    try{
      const response  = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/payments/${id}`,{
        method:"DELETE",
        credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
      })
      const data = await (await response).json()

      if(data.success){
        setUser({
                    id: data.data["_id"],
                    email: data.data["email"],
                    name: data.data["name"],
                    savedAddresses: data.data["savedAddresses"],
                    payment: data.data["savedPaymentMethods"]
                })
      }else{
        alert("error")
        console.log("error occured",data.message)
      }
    }catch(error){
      console.log(error)
    }
  };
   const setDefaultPayment = async (id: string) => {
     try{
      const response  = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/payments/${id}/default`,{
        method:"PATCH",
        credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
      })
      const data = await (await response).json()

      if(data.success){
        setUser({
                    id: data.data["_id"],
                    email: data.data["email"],
                    name: data.data["name"],
                    savedAddresses: data.data["savedAddresses"],
                    payment: data.data["savedPaymentMethods"]
                })
      }else{
        alert("error")
        console.log("error occured",data.message)
      }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <PaymentOption selected={paymentMethod === "upi"} icon={<Smartphone size={20} />} title="UPI" description="Google Pay, PhonePe" onClick={() => setPaymentMethod("upi")} />
        <PaymentOption selected={paymentMethod === "card"} icon={<CreditCard size={20} />} title="CARD" description="Credit or debit card" onClick={() => setPaymentMethod("card")} />
        <PaymentOption selected={paymentMethod === "cod"} icon={<WalletCards size={20} />} title="CASH ON DELIVERY" description="Pay when it arrives" onClick={() => setPaymentMethod("cod")} />
      </div>

      {paymentMethod=="card" &&
      <div className="px-10 py-5 rounded-3xl shadow-xs bg-white">
        <div className="flex items-center gap-2">
            <CreditCard size={17} className="text-[#3B8658]" />
              <h3 className="mt-1 text-base font-header text-[#3D1715]">Select Card to pay</h3>
              <button onClick={() =>
                  setPaymentModal(true)
                } className="ml-auto text-sm font-text font-semibold flex items-center gap-2 cursor-pointer"><Plus size={14}/>Add card</button>
          </div>
      <div className="grid grid-cols-2 gap-10">
        {user?.payment.map((payment, index) => (
                <PaymentCard
                   selectedPayment={selectedPayment} 
                   setSelectedPayment={setSelectedPayment}
                  key={payment.paymentMethodId}
                  payment={payment}
                  index={index}
                  onRemove={() =>removePayment(payment.paymentMethodId)}
                  onDefault={() =>setDefaultPayment(payment.paymentMethodId)}
                />
              ))}
        
      </div>
      </div>}

      <section className="overflow-hidden rounded-[28px] border border-[#4A1E1C]/10 bg-white shadow-[0_8px_30px_rgba(61,24,20,0.035)]">
        <div className="border-b border-[#EDE1D7] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[#3B8658]" />
            <div>
              <h3 className="mt-1 text-base font-header text-[#3D1715]">EVERYTHING LOOKS GOOD?</h3>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#EDE1D7]">
          <div className="space-y-3 p-5 sm:p-7">
            {cartProducts.map(({ product, quantity }, index) => (
              <motion.div
                key={String(product._id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-[#F3E3D7]">
                  <img src={`${API_BASE}/images/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-text font-semibold text-[#3D1715]">{product.name}</p>
                  <p className="mt-0.5 text-[10px] font-text text-[#927C72]">Qty {quantity}</p>
                </div>
                <p className="text-xs font-text font-semibold text-[#3D1715]">{money(product.price * quantity)}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
            <ReviewInfo label="Contact" value={`+91 ${phone}`} />
            <ReviewInfo label="Method" value={deliveryMethod === "delivery" ? "Home delivery" : "Store pickup · 2.4 km away"} />
            <ReviewInfo label="Payment" value={paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "Card" : "Cash on delivery"} />
            <ReviewInfo label="Offer" value={appliedCoupon ? appliedCoupon.code : "No coupon"} />
            {deliveryMethod === "delivery" && selectedAddress && (
              <div className="sm:col-span-2">
                <ReviewInfo label="Deliver to" value={formatAddress(selectedAddress)} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="rounded-[22px] bg-[#F0E6DD] px-4 py-3.5 text-xs leading-5 text-[#705B52]">
        <div className="flex items-start gap-2.5 font-text">
          <CreditCard size={15} className="mt-0.5 shrink-0" />
          <p>Your order will be created after you confirm payment. You can review everything above before placing it.</p>
        </div>
      </div>

      <div className="flex justify-end pt-2 lg:hidden">
        <PrimaryButton onClick={onPlaceOrder} disabled={placingOrder}>
          {placingOrder ? "Packing your order..." : "Place my order"}
          {placingOrder ? <Sparkles size={16} className="animate-pulse" /> : <Check size={16} />}
        </PrimaryButton>
      </div>
    </div>
  );
}

function DeliveryMethodCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className={`relative overflow-hidden rounded-[25px] border p-5 text-left transition sm:p-6 ${
        selected ? "border-[#3D1715] bg-[#FFF0B0]" : "border-[#4A1E1C]/10 bg-white hover:bg-[#FFFBF6]"
      }`}
    >
      {selected && <motion.div layoutId="delivery-selected" className="absolute inset-x-0 bottom-0 h-1 bg-[#3D1715]" />}
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[15px] ${selected ? "bg-[#3D1715] text-white" : "bg-[#F1E5DB] text-[#705B52]"}`}>
          {icon}
        </div>
        <motion.span
          animate={{ scale: selected ? [1, 1.15, 1] : 1 }}
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#3D1715] bg-[#3D1715] text-white" : "border-[#CBBBAF]"}`}
        >
          {selected && <Check size={11} strokeWidth={3} />}
        </motion.span>
      </div>
      <p className="mt-5 font-header text-[19px] font-black uppercase tracking-[-0.03em] text-[#3D1715]">{title}</p>
      <p className="mt-1 text-[11px] leading-5 text-[#7E685F] font-text">{description}</p>
    </motion.button>
  );
}

function PaymentOption({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className={`relative rounded-[24px] border p-5 text-left transition ${selected ? "border-[#3D1715] bg-[#FFF0B0]" : "border-[#4A1E1C]/10 bg-white hover:bg-[#FFFBF6]"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${selected ? "bg-[#3D1715] text-white" : "bg-[#F1E5DB] text-[#705B52]"}`}>
          {icon}
        </div>
        <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#3D1715] bg-[#3D1715] text-white" : "border-[#CBBBAF]"}`}>
          {selected && <Check size={11} strokeWidth={3} />}
        </span>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.05em] text-[#3D1715] font-text">{title}</p>
      <p className="mt-1 text-[10px] leading-4 text-[#8A746B] font-text">{description}</p>
    </motion.button>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-[#DCCEC3] bg-[#FBF7F2] p-1">
      <motion.button
        type="button"
        onClick={onDecrease}
        whileTap={{ scale: 0.85 }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#705B52] hover:bg-white"
        aria-label="Decrease quantity"
      >
        <Minus size={13} />
      </motion.button>
      <motion.span
        key={quantity}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="min-w-8 text-center text-xs font-black text-[#3D1715]"
      >
        {quantity}
      </motion.span>
      <motion.button
        type="button"
        onClick={onIncrease}
        whileTap={{ scale: 0.85 }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-[#705B52] hover:bg-white"
        aria-label="Increase quantity"
      >
        <Plus size={13} />
      </motion.button>
    </div>
  );
}

function SmallAssurance({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex font-text items-start gap-3 rounded-[20px] border border-[#4A1E1C]/8 bg-[#F1E7DE] px-4 py-3.5 text-xs leading-5 text-[#776259]">
      <span className="mt-0.5 shrink-0 text-[#6E574E]">{icon}</span>
      <p>{text}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3D1715] px-6 py-3.5 text-xs font-black uppercase tracking-[0.08em] text-white disabled:opacity-60"
    >
      {children}
    </motion.button>
  );
}

function SummaryRow({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[11px]">
      <span className="text-[#806D61] font-text">{label}</span>
      <span className={positive ? "font-text text-[#4F7950] font-semibold" : "font-text font-semibold text-[#4D3930]"}>{value}</span>
    </div>
  );
}

function ReviewInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-text font-bold uppercase tracking-[0.15em] text-[#A08C7D]">{label}</p>
      <p className="mt-1 text-xs leading-5 font-text text-[#5C483E]">{value}</p>
    </div>
  );
}

function formatAddress(address: SavedAddress) {
  if (typeof address === "string") return address;
  const value = address as any;
  return (
    value.formattedAddress ||
    value.address ||
    value.displayName ||
    value.label ||
    [value.houseNumber, value.street, value.city, value.state].filter(Boolean).join(", ")
  );
}

const cardSwapMotion = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
  transition: { duration: 0.35, ease: easing },
};

function EmptyCheckout() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F8EFE7] px-5 py-12 text-[#321D18]">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: easing }}
        className="relative w-full max-w-[650px] overflow-hidden rounded-[34px] bg-[#FFFDF9] px-6 py-14 text-center shadow-[0_20px_70px_rgba(61,24,20,0.08)] sm:px-10"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FFD21C]/20 blur-2xl" />
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#FFF0B0] text-4xl"
        >
          🍪
        </motion.div>
        <p className="mt-7 text-[9px] font-black uppercase tracking-[0.22em] text-[#9A8177]">Your sweet checkout</p>
        <h1 className="mt-2 font-header text-[42px] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#3D1715] sm:text-[56px]">
          BASKET IS EMPTY
        </h1>
        <div className="mx-auto mt-4 h-2 w-36 rounded-full bg-[#FFD21C]" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806D61]">
          Add something freshly baked to your basket before continuing to checkout.
        </p>
        <motion.button
          type="button"
          onClick={() => window.history.back()}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#3D1715] px-6 py-3.5 text-xs font-black uppercase tracking-[0.08em] text-white"
        >
          Browse products <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </main>
  );
}
function AddressCard({
  address,
  index,
  onEdit,
  onRemove,
  onDefault,
  selectedAddress,
  setSelectedAddress
}: {
  address: SavedAddress;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
  onDefault: () => void;
  selectedAddress: SavedAddress | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<SavedAddress | null>>;
}) {
  const Icon =
    address.label === "Home"
      ? Home
      : address.label === "Work"
        ? BriefcaseBusiness
        : MapPin;

  const isActive = selectedAddress == address;

  return (
    <motion.div
    onClick={()=>setSelectedAddress(address)}
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className={`group relative overflow-hidden cursor-pointer rounded-[30px] ${isActive?"bg-green-100":"bg-white"} p-5 shadow-[0_8px_30px_rgba(54,25,20,0.055)] sm:p-6`}
    >
      {/* Corner decoration */}
      <div
        className={`absolute right-0 top-0 h-16 w-16 rounded-bl-[45px] ${
          address.isDefault
            ? "bg-[#FFD522]"
            : "bg-[#F0E6DF]"
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] ${
              address.isDefault
                ? "bg-[#321513] text-white"
                : "bg-[#F6EEE7] text-[#321513]"
            }`}
          >
            <Icon
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0 flex-1 pr-7">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-title text-lg uppercase leading-none text-[#321513]">
                {address.label}
              </h3>

              {address.isDefault && (
                <span className="rounded-full bg-[#2E8B57] px-2.5 py-1 font-title text-[9px] uppercase text-white">
                  Default
                </span>
              )}
            </div>

            <p className="mt-3 font-text text-sm font-semibold text-[#51413C]">
              {address.name}
            </p>

            <p className="mt-1 font-text text-sm leading-5 text-[#806E66]">
              {address.addressLine1}
              <br />
              {address.city}, {address.postalCode}
            </p>

            <p className="mt-3 font-text text-xs text-[#A08D84]">
              {address.phone}
            </p>
          </div>

          {/* <button
            onClick={onEdit}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#624D47] transition hover:bg-white hover:shadow-sm"
            aria-label="Edit address"
          >
            <Pencil size={14} />
          </button> */}
          <div className="p-1 border-2 border-[var(--foreground)] rounded-full">
              <div className={`p-2 rounded-full transition duration-300 ${isActive ? "bg-[var(--foreground)]":"bg-[transparent]"}`} />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 border-t border-[#EEE5DF] pt-4">
          {!address.isDefault && (
            <button
              onClick={onDefault}
              className="font-title text-[10px] uppercase text-[#80635B] transition hover:text-[#321513]"
            >
              Make default
            </button>
          )}

          <button
            onClick={onEdit}
            className="font-title text-[10px] uppercase text-[#80635B] transition hover:text-[#321513]"
          >
            Edit
          </button>

          <button
            onClick={onRemove}
            className="ml-auto inline-flex items-center gap-1 font-title text-[10px] uppercase text-[#C15B43] transition hover:text-[#963A27]"
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentCard({
  payment,
  index,
  onRemove,
  onDefault,
  selectedPayment,
  setSelectedPayment
  
}: {
  payment: SavedPaymentMethod;
  index: number;
  onRemove: () => void;
  onDefault: () => void;
  selectedPayment: SavedPaymentMethod | null;
  setSelectedPayment: React.Dispatch<React.SetStateAction<SavedPaymentMethod|null>>;
}) {
  const isUPI = payment.type === "upi";
  const isActive = payment == selectedPayment;
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      onClick={()=>setSelectedPayment(payment)}
      className={`group relative overflow-hidden cursor-pointer rounded-[30px] border-2 ${isActive ? "bg-green-100 border-green-500 " : "border-[transparent] bg-white"} p-5 shadow-[0_8px_30px_rgba(54,25,20,0.055)] sm:p-6`}
    >
      <div
        className={`absolute right-0 top-0 h-14 w-14 rounded-bl-[40px] ${
          payment.isDefault
            ? "bg-[#FF7043]"
            : "bg-[#F0E6DF]"
        }`}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] ${
            payment.isDefault
              ? "bg-[#321513] text-white"
              : "bg-[#F6EEE7] text-[#321513]"
          }`}
        >
          {isUPI ? (
            <WalletCards
              size={21}
              strokeWidth={1.6}
            />
          ) : (
            <CreditCard
              size={21}
              strokeWidth={1.6}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-title text-base uppercase text-[#321513]">
              {payment.provider}
            </h3>

            {payment.isDefault && (
              <span className="rounded-full bg-[#E5F1E9] px-2.5 py-1 font-title text-[9px] uppercase text-[#2E8B57]">
                Default
              </span>
            )}
          </div>

          <p className="mt-1 truncate font-text text-sm text-[#806E66]">
            {payment.last4}
          </p>

          {payment.expiryYear && (
            <p className="mt-1 font-text text-[11px] text-[#A08D84]">
              Expires {payment.expiryYear}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5 flex items-center gap-4 border-t border-[#EEE5DF] pt-4">
        {!payment.isDefault && (
          <button
            onClick={onDefault}
            className="font-title text-[10px] uppercase text-[#80635B] transition hover:text-[#321513]"
          >
            Make default
          </button>
        )}

        <button className="font-title text-[10px] uppercase text-[#80635B] transition hover:text-[#321513]">
          Edit
        </button>

        <button
          onClick={onRemove}
          className="ml-auto inline-flex items-center gap-1 font-title text-[10px] uppercase text-[#C15B43] transition hover:text-[#963A27]"
        >
          <Trash2 size={12} />
          Remove
        </button>
      </div>
    </motion.div>
  );
}


/* ================================================================= */
/* INPUT                                                              */
/* ================================================================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-title text-[10px] uppercase tracking-wide text-[#765F57]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-12 w-full rounded-[16px] border-2 border-[#E8DCD4] bg-[#FFFDFC] px-4 font-text text-sm text-[#321513] outline-none transition placeholder:text-[#B7A69F] focus:border-[#321513]"
      />
    </label>
  );
}

/* ================================================================= */
/* SELECT                                                             */
/* ================================================================= */

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-title text-[10px] uppercase tracking-wide text-[#765F57]">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-12 w-full rounded-[16px] border-2 border-[#E8DCD4] bg-[#FFFDFC] px-4 font-text text-sm capitalize text-[#321513] outline-none transition focus:border-[#321513]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ================================================================= */
/* MODAL                                                              */
/* ================================================================= */

function Modal({
  title,
  eyebrow,
  accent,
  children,
  onClose,
}: {
  title: string;
  eyebrow: string;
  accent: "yellow" | "orange";
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-[#321513]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 25,
          scale: 0.98,
        }}
        transition={{
          duration: 0.22,
        }}
        onMouseDown={(e) =>
          e.stopPropagation()
        }
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-[#FFFDFC] p-6 shadow-2xl sm:max-w-xl sm:rounded-[32px] sm:p-8"
      >
        <div
          className={`absolute left-0 top-0 h-2 w-full ${
            accent === "yellow"
              ? "bg-[#FFD522]"
              : "bg-[#FF7043]"
          }`}
        />

        <div className="mb-7 flex items-start justify-between gap-5">
          <div>
            <p className="font-title text-[10px] uppercase tracking-[0.15em] text-[#8B7168]">
              {eyebrow}
            </p>

            <h2 className="mt-2 font-title text-3xl uppercase leading-none text-[#321513]">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6EEE7] text-[#321513] transition hover:rotate-6"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}

/* ================================================================= */
/* MODAL ACTIONS                                                      */
/* ================================================================= */

function ModalActions({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-7 flex flex-col-reverse gap-3 border-t-2 border-[#EEE4DD] pt-5 sm:flex-row sm:justify-end">
      <button
        onClick={onCancel}
        className="h-11 rounded-full border-2 border-[#E5D9D1] px-6 font-title text-[10px] uppercase text-[#67524B] transition hover:bg-[#F6EEE7]"
      >
        Cancel
      </button>

      <button
        onClick={onSave}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#FFD522] px-7 font-title text-[10px] uppercase text-[#321513] transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <Check size={15} />
        Save
      </button>
    </div>
  );
}