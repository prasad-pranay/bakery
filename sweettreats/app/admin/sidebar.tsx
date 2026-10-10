"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BadgePercent,
  MessageCircleQuestionMark,
} from "lucide-react";
import { useRouter } from "next/navigation";

type SidebarTab = "dashboard" | "items" | "orders" | "support" | "coupons";

type AdminHeaderProps = {
  activeTab: SidebarTab;
};

export default function AdminHeader({
  activeTab,
}: AdminHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  function onLogout() {
    router.push("/logout");
  }

  const navigation = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      id: "items" as const,
      label: "Products",
      icon: Package,
      href: "/admin/items",
    },
    {
      id: "coupons" as const,
      label: "Coupons",
      icon: BadgePercent,
      href: "/admin/coupon",
    },
    {
      id: "orders" as const,
      label: "Orders",
      icon: ShoppingBag,
      href: "/admin/order",
    },
    {
      id: "support" as const,
      label: "Support",
      icon: MessageCircleQuestionMark,
      href: "/admin/contact",
    },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#f8f0e8]">
      <div className="mx-auto flex h-[88px] max-w-[1500px] items-center px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className="shrink-0 text-left"
          aria-label="Go to home"
        >
          <div className="font-text text-[27px] font-black tracking-[-0.07em] text-[#351615] sm:text-[30px]">
            SWEETREATS
            <span className="text-[#ee5538]">.</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden items-center gap-2 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={`
                  cursor-pointer hover:scale-110
                  flex items-center gap-2 rounded-full
                  px-6 py-3
                  font-text text-[13px] font-black
                  tracking-wider
                  transition-all duration-200
                  ${
                    active
                      ? "bg-[#ffd21c] text-[#351615] shadow-[0_2px_0_rgba(53,22,21,0.12)]"
                      : "text-[#351615] hover:bg-[#fff7ee]"
                  }
                `}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2.8 : 2.4}
                />

                <span>{item.label.toUpperCase()}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Admin */}
        <button
          type="button"
          onClick={onLogout}
          className="
            ml-auto hidden items-center gap-3
            rounded-full border border-[#dfd2c6]
            bg-[#fffaf5] px-3 py-2
            transition-all duration-200
            hover:border-[#ee5538]
            hover:bg-white
            md:flex cursor-pointer
          "
        >
          <span
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full bg-[#ffd21c] text-lg
            "
          >
            🧑‍🍳
          </span>

          <span className="hidden font-text text-[12px] font-black tracking-wider sm:block">
            Logout
          </span>

          <ChevronDown
            size={15}
            strokeWidth={3}
          />
        </button>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="
            ml-auto flex h-11 w-11
            items-center justify-center
            rounded-full
            border border-[#dfd2c6]
            bg-[#fffaf5]
            text-[#351615]
            transition-all duration-200
            hover:bg-white
            md:hidden
          "
          aria-label={
            mobileOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={21} strokeWidth={2.5} />
          ) : (
            <Menu size={21} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div
          className="
            border-t border-[#dfd2c6]
            bg-[#f8f0e8]
            px-5 py-4
            md:hidden
          "
        >
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`
                    flex w-full items-center gap-3
                    rounded-full px-5 py-3.5
                    font-text text-[13px] font-black
                    tracking-wider
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#ffd21c] text-[#351615] shadow-[0_2px_0_rgba(53,22,21,0.12)]"
                        : "text-[#351615] hover:bg-[#fff7ee]"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.8 : 2.3}
                  />

                  <span>{item.label.toUpperCase()}</span>
                </button>
              );
            })}

            {/* Mobile Logout */}
            <div className="my-3 border-t border-[#dfd2c6]" />

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onLogout();
              }}
              className="
                flex w-full items-center gap-3
                rounded-full px-5 py-3.5
                font-text text-[13px] font-black
                tracking-wider
                text-[#351615]
                transition-all duration-200
                hover:bg-[#fff7ee]
              "
            >
              <LogOut
                size={17}
                strokeWidth={2.3}
              />

              <span>LOGOUT</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
 


// "use client";

// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingBag,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// type SidebarTab = "dashboard" | "items" | "orders" | "support";

// type AdminHeaderProps = {
//   activeTab: SidebarTab;
// };


// export default function AdminHeader({
//   activeTab}:AdminHeaderProps) {
//   const [mobileOpen, setMobileOpen] = useState(false);
  
//   const router = useRouter();
  
//   function onLogout(){
//     router.push("/logout")
//   }


//   const navigation = [
//     {
//       id: "dashboard" as const,
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       href: "/admin"
//     },
//     {
//         id: "items" as const,
//         label: "Items",
//         icon: Package,
//         href: "/admin/items"
//     },
//     {
//         id: "orders" as const,
//       label: "Orders",
//       icon: ShoppingBag,
//       href: "/admin/order"
//     },
//     {
//         id: "support" as const,
//       label: "Support",
//       icon: ShoppingBag,
//       href: "/admin/contact"
//     },
//   ];

//   const handleNavigate = (href:string) => {
//     router.push(href);
//     setMobileOpen(false);
//   };

//   return (
//     <header className="sticky top-0 z-[100] w-full bg-[var(--background)]/95 backdrop-blur-md">
//       <div className="mx-auto flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
//         {/* Logo */}
//         <button
//           onClick={() => handleNavigate("/")}
//           className="text-left"
//         >
//           <p className="font-title tracking-wider text-xl font-bold tracking-tight text-[var(--foreground)]">
//             SweetTreats
//           </p>

//           <p className="mt-0.5 font-text text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
//             Admin panel
//           </p>
//         </button>

//         {/* Desktop Navigation */}
//         <nav className="hidden items-center gap-1 md:flex">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const active = activeTab === item.id;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigate(item.href)}
//                 className={`
//                   group flex items-center gap-2 rounded-xl px-4 py-2.5
//                   font-text text-sm font-medium transition-all duration-200
//                   ${
//                     active
//                       ? "bg-[#321714] text-white shadow-sm"
//                       : "text-[var(--muted)] hover:bg-black/[0.035] hover:text-[var(--foreground)]"
//                   }
//                 `}
//               >
//                 <Icon
//                   size={17}
//                   strokeWidth={active ? 2.2 : 1.8}
//                 />

//                 <span>{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         {/* Desktop Logout */}
//         <button
//           onClick={onLogout}
//           className="
//             hidden items-center gap-2 rounded-xl px-3 py-2.5
//             font-text text-sm font-medium text-[var(--muted)]
//             transition md:flex
//             hover:bg-red-50 hover:text-red-600
//           "
//         >
//           <LogOut size={17} strokeWidth={1.8} />
//           <span>Logout</span>
//         </button>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setMobileOpen((prev) => !prev)}
//           className="
//             flex h-10 w-10 items-center justify-center rounded-xl
//             border border-[var(--border)] text-[var(--foreground)]
//             transition hover:bg-black/[0.035] md:hidden
//           "
//           aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
//         >
//           {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Mobile Navigation */}
//       {mobileOpen && (
//         <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-3 md:hidden">
//           <nav className="space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const active = activeTab === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => handleNavigate(item.id)}
//                   className={`
//                     flex w-full items-center gap-3 rounded-xl px-3 py-3
//                     font-text text-sm font-medium transition
//                     ${
//                       active
//                         ? "bg-[#321714] text-white"
//                         : "text-[var(--muted)] hover:bg-black/[0.035] hover:text-[var(--foreground)]"
//                     }
//                   `}
//                 >
//                   <Icon
//                     size={18}
//                     strokeWidth={active ? 2.2 : 1.8}
//                   />

//                   <span>{item.label}</span>
//                 </button>
//               );
//             })}

//             {/* Mobile Logout */}
//             <div className="my-2 border-t border-[var(--border)]" />

//             <button
//               onClick={() => {
//                 setMobileOpen(false);
//                 onLogout();
//               }}
//               className="
//                 flex w-full items-center gap-3 rounded-xl px-3 py-3
//                 font-text text-sm font-medium text-[var(--muted)]
//                 transition hover:bg-red-50 hover:text-red-600
//               "
//             >
//               <LogOut size={18} strokeWidth={1.8} />
//               <span>Logout</span>
//             </button>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }
