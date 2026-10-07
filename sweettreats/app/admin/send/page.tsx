"use client";

import { useState } from "react";
import {
  Check,
  CircleAlert,
  Loader2,
  PackagePlus,
  Sparkles,
  Upload,
} from "lucide-react";
import AdminHeader from "../sidebar";

type Category =
  | "All"
  | "Cookies"
  | "Cake"
  | "Pastries"
  | "Croissant"
  | "Bagel"
  | "Bread";

type ProductReview = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

type Product = {
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  description: string;
  tags: string[];
  image: string;
  accent: string;
  note: string;
  count: number;
  __v?: number;
  ingredients?: string[];
  rating?: number;
  reviews?: ProductReview[];
};

type Props = {
  products: Product[];
};

const products: Product[] = [
  {
    name: "Chocolate Chip Cookies",
    category: "Cookies",
    price: 120,
    description: "Classic, chunky and loaded with chocolate.",
    tags: ["Classic", "Crunchy", "Buttery"],
    image: "0.png",
    accent: "#FFE45E",
    note: "CLASSIC FAVOURITE",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Dark chocolate chips",
      "Brown sugar",
      "Butter",
      "Free-range eggs",
      "Vanilla extract",
      "Baking soda",
      "Sea salt",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Bagel With Seeds",
    category: "Bagel",
    price: 150,
    description: "Freshly baked with a golden, chewy crust.",
    tags: ["Fresh", "Chewy", "Hearty"],
    image: "1.png",
    accent: "#8FD7E8",
    note: "FRESHLY BAKED",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Water",
      "Yeast",
      "Malted barley",
      "Sugar",
      "Salt",
      "Sesame seeds",
      "Poppy seeds",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Sliced Piece Bread",
    category: "Bread",
    price: 80,
    description: "Soft everyday bread baked from scratch.",
    tags: ["Soft", "Fresh", "Everyday"],
    image: "2.png",
    accent: "#FFA16D",
    note: "SO SOFT",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Water",
      "Milk",
      "Butter",
      "Sugar",
      "Yeast",
      "Salt",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Nutty Biscuits",
    category: "Cookies",
    price: 140,
    description: "Golden biscuits packed with roasted nuts.",
    tags: ["Almond", "Crunchy", "Wholesome"],
    image: "3.png",
    accent: "#B8D8A8",
    note: "NUTS IN EVERY BITE",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Almonds",
      "Cashews",
      "Butter",
      "Powdered sugar",
      "Milk",
      "Vanilla extract",
      "Sea salt",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Classic Croissant",
    category: "Croissant",
    price: 160,
    description: "Flaky layers with a rich buttery center.",
    tags: ["Classic", "Buttery", "Flaky"],
    image: "4.png",
    accent: "#9EDFF0",
    note: "BUTTERY & FLAKY",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Butter",
      "Milk",
      "Water",
      "Sugar",
      "Yeast",
      "Salt",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Blueberry Cake",
    category: "Cake",
    price: 180,
    description: "Moist vanilla cake filled with real berries.",
    tags: ["Fruity", "Moist", "Delicious"],
    image: "5.png",
    accent: "#D5B8F5",
    note: "REAL BERRIES",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Fresh blueberries",
      "Sugar",
      "Butter",
      "Free-range eggs",
      "Milk",
      "Vanilla extract",
      "Baking powder",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Sea Salt Pretzel",
    category: "Pastries",
    price: 130,
    description: "Golden, chewy and finished with sea salt.",
    tags: ["Classic", "Chewy", "Salty"],
    image: "6.png",
    accent: "#92DCE5",
    note: "SALTY & SOFT",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Water",
      "Yeast",
      "Brown sugar",
      "Butter",
      "Baking soda",
      "Sea salt",
    ],
    reviews: [],
    count: 50,
  },
  {
    name: "Cinnamon Roll",
    category: "Pastries",
    price: 170,
    description: "Warm cinnamon, soft dough and sweet icing.",
    tags: ["Cinnamon", "Soft", "Creamy"],
    image: "6.png",
    accent: "#FFB08B",
    note: "SWEET & WARM",
    rating: 5,
    ingredients: [
      "Wheat flour",
      "Butter",
      "Brown sugar",
      "Cinnamon",
      "Free-range eggs",
      "Milk",
      "Yeast",
      "Cream cheese",
      "Powdered sugar",
      "Vanilla extract",
    ],
    reviews: [],
    count: 50,
  },
];

export default function ProductImporter({ products: propProducts }: Props) {
  const productList = propProducts?.length ? propProducts : products;

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const [results, setResults] = useState<
    Record<number, { success: boolean; message: string }>
  >({});

  const sendProduct = async (index: number) => {
    const product = productList[index];

    if (!product) {
      return;
    }

    setLoadingIndex(index);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        },
      );

      const data = await response.json();

      setResults((prev) => ({
        ...prev,
        [index]: {
          success: response.ok,
          message:
            data.message ||
            (response.ok
              ? "Product added successfully"
              : "Failed to add product"),
        },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [index]: {
          success: false,
          message: "Unable to connect to backend",
        },
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f0e9] text-[#3b1b16] font-text">
      <AdminHeader activeTab="dashboard" />

      <main className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "#ffd21f",
            opacity: 0.18,
          }}
        />

        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "#ffb08b",
            opacity: 0.14,
          }}
        />

        <div className="relative mx-auto max-w-7xl">


          {/* Small intro card */}
          <div className="mb-6 flex w-max items-center gap-3 rounded-2xl border border-[#eadbd2] bg-[#fffaf6] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0ad] text-[#3b1b16]">
              <Upload size={16} />
            </div>

            <p className="text-xs leading-5 text-[#795f56] sm:text-sm ">
              Select a product below to add it to backend.
            </p>
          </div>

          {/* Products */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {productList.map((product, index) => {
              const result = results[index];
              const isLoading = loadingIndex === index;

              return (
                <article
                  key={`${product.name}-${index}`}
                  className="group relative overflow-hidden rounded-[28px] border border-[#e8d9d0] bg-[#fffaf6] p-4 shadow-[0_12px_35px_rgba(59,27,22,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(59,27,22,0.10)]"
                >
                  {/* Accent strip */}
                  <div
                    className="absolute left-0 top-0 h-1.5 w-full"
                    style={{ backgroundColor: product.accent }}
                  />

                  {/* Product visual */}
                  <div
                    className="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-[22px]"
                    style={{
                      backgroundColor: product.accent,
                    }}
                  >
                    {/* Decorative circle */}
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30" />
                    <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-black/[0.04]" />

                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/images/${product.image}`}
                      alt={product.name}
                      className="relative z-10 h-full w-full rounded-lg object-contain p-5 drop-shadow-[0_14px_15px_rgba(59,27,22,0.15)] transition-transform duration-500 group-hover:scale-105"
                    />


                  </div>

                  {/* Product details */}
                  <div className="px-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-black tracking-[-0.025em]">
                          {product.name}
                        </h2>

                      </div>

                      <div className="shrink-0 rounded-xl bg-[#fff0ad] px-3 py-2">
                        <span className="text-sm font-black text-[#3b1b16]">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>


                    {/* Divider */}
                    <div className="my-4 h-px bg-[#eadfd8]" />

                    {/* Action */}
                    <button
                      type="button"
                      onClick={() => sendProduct(index)}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3b1b16] px-4 py-3.5 text-sm font-bold text-[#fffaf6] transition-all duration-200 hover:bg-[#4d251e] hover:shadow-[0_10px_24px_rgba(59,27,22,0.18)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Upload size={17} />
                          Send product
                        </>
                      )}
                    </button>

                    {/* Result */}
                    {result && (
                      <div
                        className={`mt-3 flex items-start gap-2 rounded-2xl px-3 py-3 ${
                          result.success
                            ? "bg-[#e7f4ea] text-[#287447]"
                            : "bg-[#fff0ee] text-[#b33a2b]"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {result.success ? (
                            <Check size={15} strokeWidth={2.5} />
                          ) : (
                            <CircleAlert size={15} strokeWidth={2.5} />
                          )}
                        </div>

                        <span className="text-xs font-semibold leading-5">
                          {result.message}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </main>
    </section>
  );
}


// "use client";

// import { useState } from "react";
// import AdminHeader from "../sidebar";

// type Category =
//     | "All"
//     | "Cookies"
//     | "Cake"
//     | "Pastries"
//     | "Croissant"
//     | "Bagel"
//     | "Bread";
// type ProductReview = {
//     name: string;
//     rating: number;
//     text: string;
//     date: string;
// };

// type Product = {
  
//     name: string;
//     category: Exclude<Category, "All">;
//     price: number;
//     description: string;
//     tags: string[];
//     image: string;
//     accent: string;
//     note: string;
//     count: number
//     __v?: number;
//     ingredients?: string[];
//     rating?: number;
//     reviews?: ProductReview[];
// };

// type Props = {
//   products: Product[];
// };



// const products: Product[] = [
//     {
//         name: "Chocolate Chip Cookies",
//         category: "Cookies",
//         price: 120,
//         description: "Classic, chunky and loaded with chocolate.",
//         tags: ["Classic", "Crunchy", "Buttery"],
//         image: "0.png",
//         accent: "#FFE45E",
//         note: "CLASSIC FAVOURITE",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Dark chocolate chips",
//             "Brown sugar",
//             "Butter",
//             "Free-range eggs",
//             "Vanilla extract",
//             "Baking soda",
//             "Sea salt",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Bagel With Seeds",
//         category: "Bagel",
//         price: 150,
//         description: "Freshly baked with a golden, chewy crust.",
//         tags: ["Fresh", "Chewy", "Hearty"],
//         image: "1.png",
//         accent: "#8FD7E8",
//         note: "FRESHLY BAKED",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Water",
//             "Yeast",
//             "Malted barley",
//             "Sugar",
//             "Salt",
//             "Sesame seeds",
//             "Poppy seeds",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Sliced Piece Bread",
//         category: "Bread",
//         price: 80,
//         description: "Soft everyday bread baked from scratch.",
//         tags: ["Soft", "Fresh", "Everyday"],
//         image: "2.png",
//         accent: "#FFA16D",
//         note: "SO SOFT",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Water",
//             "Milk",
//             "Butter",
//             "Sugar",
//             "Yeast",
//             "Salt",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Nutty Biscuits",
//         category: "Cookies",
//         price: 140,
//         description: "Golden biscuits packed with roasted nuts.",
//         tags: ["Almond", "Crunchy", "Wholesome"],
//         image: "3.png",
//         accent: "#B8D8A8",
//         note: "NUTS IN EVERY BITE",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Almonds",
//             "Cashews",
//             "Butter",
//             "Powdered sugar",
//             "Milk",
//             "Vanilla extract",
//             "Sea salt",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Classic Croissant",
//         category: "Croissant",
//         price: 160,
//         description: "Flaky layers with a rich buttery center.",
//         tags: ["Classic", "Buttery", "Flaky"],
//         image: "4.png",
//         accent: "#9EDFF0",
//         note: "BUTTERY & FLAKY",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Butter",
//             "Milk",
//             "Water",
//             "Sugar",
//             "Yeast",
//             "Salt",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Blueberry Cake",
//         category: "Cake",
//         price: 180,
//         description: "Moist vanilla cake filled with real berries.",
//         tags: ["Fruity", "Moist", "Delicious"],
//         image: "5.png",
//         accent: "#D5B8F5",
//         note: "REAL BERRIES",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Fresh blueberries",
//             "Sugar",
//             "Butter",
//             "Free-range eggs",
//             "Milk",
//             "Vanilla extract",
//             "Baking powder",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Sea Salt Pretzel",
//         category: "Pastries",
//         price: 130,
//         description: "Golden, chewy and finished with sea salt.",
//         tags: ["Classic", "Chewy", "Salty"],
//         image: "6.png",
//         accent: "#92DCE5",
//         note: "SALTY & SOFT",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Water",
//             "Yeast",
//             "Brown sugar",
//             "Butter",
//             "Baking soda",
//             "Sea salt",
//         ],

//         reviews: [],
//         count: 50,
//     },
//     {
//         name: "Cinnamon Roll",
//         category: "Pastries",
//         price: 170,
//         description: "Warm cinnamon, soft dough and sweet icing.",
//         tags: ["Cinnamon", "Soft", "Creamy"],
//         image: "6.png",
//         accent: "#FFB08B",
//         note: "SWEET & WARM",

//         rating: 5,

//         ingredients: [
//             "Wheat flour",
//             "Butter",
//             "Brown sugar",
//             "Cinnamon",
//             "Free-range eggs",
//             "Milk",
//             "Yeast",
//             "Cream cheese",
//             "Powdered sugar",
//             "Vanilla extract",
//         ],

//         reviews: [],
//         count: 50,
//     },
// ];



// export default function ProductImporter() {
//   const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
//   const [results, setResults] = useState<
//     Record<number, { success: boolean; message: string }>
//   >({});

//   const sendProduct = async (index: number) => {
//     const product = products[index];

//     if (!product) {
//       return;
//     }

//     setLoadingIndex(index);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(product),
//       });

//       const data = await response.json();

//       setResults((prev) => ({
//         ...prev,
//         [index]: {
//           success: response.ok,
//           message:
//             data.message ||
//             (response.ok
//               ? "Product added successfully"
//               : "Failed to add product"),
//         },
//       }));
//     } catch (error) {
//       setResults((prev) => ({
//         ...prev,
//         [index]: {
//           success: false,
//           message: "Unable to connect to backend",
//         },
//       }));
//     } finally {
//       setLoadingIndex(null);
//     }
//   };

//   return (
//     <section>
//       <AdminHeader activeTab="dashboard" />
//       <div className="flex flex-wrap gap-3 p-6">
//       {products.map((product, index) => {
//         const result = results[index];
//         const isLoading = loadingIndex === index;

//         return (
//           <div key={product.name} className="flex flex-col gap-2">
//             <button
//               type="button"
//               onClick={() => sendProduct(index)}
//               disabled={isLoading}
//               className="rounded-lg border px-4 py-2 transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {isLoading ? "Sending..." : `Send ${index + 1}`}
//             </button>

//             {result && (
//               <span
//                 className={`text-sm ${
//                   result.success ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 {result.success ? "✓" : "✕"} {result.message}
//               </span>
//             )}
//           </div>
//         );
//       })}
//     </div>
//     </section>
//   );
// }

