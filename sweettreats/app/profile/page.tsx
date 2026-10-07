"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UserRound,
  Mail,
  Camera,
  Pencil,
  Plus,
  Trash2,
  MapPin,
  Home,
  BriefcaseBusiness,
  CreditCard,
  WalletCards,
  X,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SavedAddress, useAuthStore, SavedPaymentMethod } from "../store/authStore";
import Restricted from "../admin/Restricted";



export default function ProfilePage() {
  const {user,admin,setUser} = useAuthStore();

   const router = useRouter();


  const [editingProfile, setEditingProfile] = useState(false);


  // const [addresses, setAddresses] =
  //   useState<SavedAddress[]>(user?.savedAddresses || []);

    console.log("address",user?.savedAddresses)

  // const [payments, setPayments] =
  //   useState<PaymentMethod[]>(initialPayments);

  const [addressModal, setAddressModal] = useState<{
    open: boolean;
    address?: SavedAddress;
  }>({
    open: false,
  });

  const [paymentModal, setPaymentModal] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: "Home",
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    type: "visa" as "visa" | "mastercard" | "upi",
    details: "",
    expiry: "",
  });

  /* --------------------------------------------------------------- */
  /* PROFILE                                                         */
  /* --------------------------------------------------------------- */

  const saveProfile = () => {
    setEditingProfile(false);
  };

  /* --------------------------------------------------------------- */
  /* ADDRESS                                                         */
  /* --------------------------------------------------------------- */

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

  const openEditAddress = (address: SavedAddress) => {
    setAddressForm({
      label: address.label,
      name: address.name,
      address: address.addressLine1,
      city: address.city,
      pincode: address.postalCode,
      phone: address.phone,
    });

    setAddressModal({
      open: true,
      address,
    });
  };

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

  const updateprofile = (value:string)=>{

  }

  const removeAddress = async (id: string) => {
    
    try{
      const response  = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/addresses/${id}`,{
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

  const setDefaultAddress = async (id: string) => {
    
    try{
      const response  = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/addresses/${id}/default`,{
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

  /* --------------------------------------------------------------- */
  /* PAYMENT                                                         */
  /* --------------------------------------------------------------- */

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
  
      if(!user){
        if(admin){
          router.replace("/admin/contact")
          return;
        }else{
          return <Restricted/>
        }
        
      }
  return (
    <main className="min-h-screen bg-[#F6EEE7] text-[#321513]">
      <div className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-8 sm:px-6 md:px-8 lg:px-12">
        {/* ========================================================= */}
        {/* HERO                                                      */}
        {/* ========================================================= */}

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          {/* Decorative shape */}
          {/* <div className="pointer-events-none absolute right-2 top-5 hidden h-24 w-28 rotate-6 rounded-[45%] bg-[#FFD522] lg:block" /> */}

          <div className="absolute right-7 top-8 hidden rotate-6 text-right lg:block">
            {/* <img src="/cookie1.png" alt="" className="w-30 absolute inset-0" /> */}
            <p className="font-header text-sm uppercase leading-none">
              made for
            </p>

            <p className="font-header text-sm uppercase leading-none">
              sweet people ♡
            </p>
          </div>

          <div className="relative z-10 max-w-5xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2E8B57] px-4 py-2 font-title text-xs uppercase tracking-wide text-white">
                <Sparkles size={13} />
                My sweet space
              </span>

              <span className="hidden rounded-full bg-[#FF7043] px-4 py-2 font-title text-xs uppercase text-white sm:inline-flex">
                Fresh
              </span>
            </div>

            <h1 className="font-title text-[clamp(3.7rem,9vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[0.06em] text-[#321513]">
              YOUR
              <br />
              PROFILE
            </h1>

            <div className="mt-7 flex max-w-2xl items-start gap-3">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#FFD522]" />

              <p className="max-w-xl font-text text-sm leading-6 text-[#675550] sm:text-base">
                Everything you need for your next sweet order —
                your details, favourite delivery spots and payment
                methods, all tucked into one place.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ========================================================= */}
        {/* PROFILE CARD                                               */}
        {/* ========================================================= */}

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="relative mt-12 overflow-hidden rounded-[34px] bg-white p-5 shadow-[0_12px_40px_rgba(54,25,20,0.07)] sm:p-7 lg:p-9"
        >
          <div className="absolute left-0 top-0 h-2 w-full bg-[#FFD522]" />

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-5 sm:gap-7">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[30px] bg-[#FFD522] sm:h-32 sm:w-32 sm:rounded-[38px]">
                  <UserRound
                    size={54}
                    strokeWidth={1.7}
                    className="text-[#321513] sm:h-16 sm:w-16"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#321513] text-white transition-transform hover:rotate-6 hover:scale-105"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#F6EEE7] px-3 py-1 font-title text-[10px] uppercase tracking-wide text-[#70554D]">
                    Sweet member
                  </span>

                  <span className="rounded-full bg-[#E5F1E9] px-3 py-1 font-title text-[10px] uppercase tracking-wide text-[#2E8B57]">
                    Active
                  </span>
                </div>

                <h2 className="truncate font-title text-3xl uppercase leading-none text-[#321513] sm:text-4xl">
                  {user.name}
                </h2>

                <div className="mt-3 flex min-w-0 items-center gap-2 font-text text-sm text-[#796762]">
                  <Mail size={15} className="shrink-0" />

                  <span className="truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setEditingProfile((value) => !value)
              }
              className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#FFD522] px-6 font-title text-xs uppercase text-[#321513] transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,213,34,0.3)] sm:w-auto"
            >
              <Pencil size={15} />

              Edit profile

              <ChevronRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* Profile edit */}
          <AnimatePresence>
            {editingProfile && (
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
                className="overflow-hidden"
              >
                <div className="mt-8 border-t border-[#EDE3DB] pt-7">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full name"
                      value={user.name}
                      onChange={updateprofile}
                    />

                    <Input
                      label="Email address"
                      value={user.email}
                      onChange={updateprofile}
                      type="email"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={saveProfile}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#321513] px-6 font-title text-xs uppercase text-white transition hover:-translate-y-0.5"
                    >
                      <Check size={15} />
                      Save changes
                    </button>

                    <button
                      onClick={() =>
                        setEditingProfile(false)
                      }
                      className="h-11 rounded-full border-2 border-[#E6DAD1] px-6 font-title text-xs uppercase text-[#654F49] transition hover:bg-[#F6EEE7]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ========================================================= */}
        {/* MAIN CONTENT                                               */}
        {/* ========================================================= */}

        <div className="mt-14 grid gap-12 xl:grid-cols-[1.35fr_0.85fr]">
          {/* ======================================================= */}
          {/* ADDRESSES                                                */}
          {/* ======================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
          >
            <SectionHeading
              number="01"
              eyebrow="Delivery"
              title="Your sweet spots"
              description="Places where we can send your treats."
              accent="yellow"
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {user.savedAddresses.map((address, index) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  index={index}
                  onEdit={() =>
                    openEditAddress(address)
                  }
                  onRemove={() =>
                    removeAddress(address.id)
                  }
                  onDefault={() =>
                    setDefaultAddress(address.id)
                  }
                />
              ))}

              {/* Add address */}
              <button
                onClick={openAddAddress}
                className="group flex min-h-[210px] flex-col items-center justify-center rounded-[30px] border-2 border-dashed border-[#D9C9BF] bg-transparent p-6 text-center transition-all hover:border-[#321513] hover:bg-white"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD522] text-[#321513] transition-transform group-hover:rotate-6 group-hover:scale-105">
                  <Plus size={22} />
                </span>

                <span className="mt-4 font-title text-sm uppercase">
                  Add new address
                </span>

                <span className="mt-1 font-text text-xs text-[#88736B]">
                  Another place for the good stuff
                </span>
              </button>
            </div>
          </motion.section>

          {/* ======================================================= */}
          {/* PAYMENTS                                                 */}
          {/* ======================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
          >
            <SectionHeading
              number="02"
              eyebrow="Checkout"
              title="How you pay"
              description="Your saved ways to pay."
              accent="orange"
            />

            <div className="mt-6 space-y-4">
              {user.payment.map((payment, index) => (
                <PaymentCard
                  key={payment.paymentMethodId}
                  payment={payment}
                  index={index}
                  onRemove={() =>
                    removePayment(payment.paymentMethodId)
                  }
                  onDefault={() =>
                    setDefaultPayment(payment.paymentMethodId)
                  }
                />
              ))}

              {/* Add payment */}
              <button
                onClick={() =>
                  setPaymentModal(true)
                }
                className="group flex w-full items-center justify-between rounded-[28px] bg-[#321513] p-5 text-left text-white transition-all hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(50,21,19,0.16)]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD522] text-[#321513]">
                    <Plus size={18} />
                  </span>

                  <div>
                    <p className="font-title text-sm uppercase">
                      Add payment method
                    </p>

                    <p className="mt-1 font-text text-xs text-[#D8C7C0]">
                      Card or UPI
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Security */}
            <div className="mt-6 flex gap-3 rounded-[24px] bg-[#E6F0E9] p-5">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#2E8B57]"
              />

              <div>
                <p className="font-title text-xs uppercase text-[#315E43]">
                  Safe & sound
                </p>

                <p className="mt-1 font-text text-xs leading-5 text-[#587062]">
                  Your payment information is securely handled.
                  We only display the last few characters of
                  saved payment details.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ========================================================= */}
        {/* FOOTER                                                     */}
        {/* ========================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          className="mt-16 flex flex-col items-center justify-between gap-5 border-t-2 border-[#321513] pt-6 sm:flex-row"
        >
          <div className="flex items-center gap-2">
            <Star
              size={16}
              fill="currentColor"
              className="text-[#FFD522]"
            />

            <p className="font-title text-xs uppercase">
              Good things take time
            </p>
          </div>

          <p className="font-text text-xs text-[#88736B]">
            Baked fresh. Made with love.
          </p>
        </motion.div>
      </div>

      {/* =========================================================== */}
      {/* ADDRESS MODAL                                               */}
      {/* =========================================================== */}

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

      {/* =========================================================== */}
      {/* PAYMENT MODAL                                               */}
      {/* =========================================================== */}

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
    </main>
  );
}

/* ================================================================= */
/* SECTION HEADING                                                   */
/* ================================================================= */

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  accent,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: "yellow" | "orange";
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full font-title text-[11px] ${
            accent === "yellow"
              ? "bg-[#FFD522] text-[#321513]"
              : "bg-[#FF7043] text-white"
          }`}
        >
          {number}
        </span>

        <span className="font-title text-[11px] uppercase tracking-[0.12em] text-[#806A61]">
          {eyebrow}
        </span>
      </div>

      <h2 className="mt-3 font-title text-[clamp(2.3rem,5vw,4.2rem)] font-black uppercase leading-[0.82] tracking-[0.04em] text-[#321513]">
        {title}
      </h2>

      <p className="mt-3 max-w-md font-text text-sm leading-6 text-[#806E66]">
        {description}
      </p>
    </div>
  );
}

/* ================================================================= */
/* ADDRESS CARD                                                      */
/* ================================================================= */

function AddressCard({
  address,
  index,
  onEdit,
  onRemove,
  onDefault,
}: {
  address: SavedAddress;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
  onDefault: () => void;
}) {
  const Icon =
    address.label === "Home"
      ? Home
      : address.label === "Work"
        ? BriefcaseBusiness
        : MapPin;

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
      className="group relative overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_8px_30px_rgba(54,25,20,0.055)] sm:p-6"
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

          <button
            onClick={onEdit}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[#624D47] transition hover:bg-white hover:shadow-sm"
            aria-label="Edit address"
          >
            <Pencil size={14} />
          </button>
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

/* ================================================================= */
/* PAYMENT CARD                                                      */
/* ================================================================= */

function PaymentCard({
  payment,
  index,
  onRemove,
  onDefault,
}: {
  payment: SavedPaymentMethod;
  index: number;
  onRemove: () => void;
  onDefault: () => void;
}) {
  const isUPI = payment.type === "upi";

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
      className="group relative overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_8px_30px_rgba(54,25,20,0.055)] sm:p-6"
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
