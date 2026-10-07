"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertTriangle,
  ArrowDownAZ,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AdminHeader from "../sidebar";

/* ============================================================
   CONFIG
============================================================ */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API = {
  products: `${API_BASE}/api/products`,
  product: (id: string) =>
    `${API_BASE}/api/products/${id}`,
};

/* ============================================================
   TYPES
============================================================ */

type Category =
  | "Cookies"
  | "Cake"
  | "Pastries"
  | "Croissant"
  | "Bagel"
  | "Bread";

type Product = {
  _id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  tags: string[];
  image: string;
  accent?: string;
  note?: string;
  ingredients?: string[];
  rating?: number;
  reviews?: number;
  count: number;
};

type ProductForm = {
  id: string;
  name: string;
  category: Category;
  price: string;
  description: string;
  tags: string;
  image: string;
  accent: string;
  note: string;
  ingredients: string;
  count: string;
};

type SortOption =
  | "newest"
  | "name"
  | "price-low"
  | "price-high"
  | "stock-low"
  | "stock-high";

type ModalMode = "add" | "edit" | null;

/* ============================================================
   CONSTANTS
============================================================ */

const categories: Category[] = [
  "Cookies",
  "Cake",
  "Pastries",
  "Croissant",
  "Bagel",
  "Bread",
];

const categoryEmoji: Record<Category, string> = {
  Cookies: "🍪",
  Cake: "🍰",
  Pastries: "🥧",
  Croissant: "🥐",
  Bagel: "🥯",
  Bread: "🍞",
};

const categoryAccent: Record<Category, string> = {
  Cookies: "#f5d89b",
  Cake: "#f3c8c2",
  Pastries: "#e8c997",
  Croissant: "#f1ce86",
  Bagel: "#d7c2a7",
  Bread: "#d5b28b",
};

const emptyForm: ProductForm = {
  id:"",
  name: "",
  category: "Cookies",
  price: "",
  description: "",
  tags: "",
  image: "",
  accent: "#8B5E3C",
  note: "",
  ingredients: "",
  count: "0",
};

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(value: number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getStockState(count: number) {
  if (count <= 0) {
    return {
      label: "OUT OF STOCK",
      className: "bg-[#ffd9d5] text-[#a52d24]",
      dot: "bg-[#ed4337]",
    };
  }

  if (count <= 10) {
    return {
      label: "LOW STOCK",
      className: "bg-[#ffe5a6] text-[#7a5510]",
      dot: "bg-[#f0a900]",
    };
  }

  return {
    label: "AVAILABLE",
    className: "bg-[#c9efd4] text-[#24643a]",
    dot: "bg-[#2ea457]",
  };
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    tags: Array.isArray(product.tags)
      ? product.tags
      : [],
    ingredients: Array.isArray(product.ingredients)
      ? product.ingredients
      : [],
    rating: Number(product.rating || 0),
    reviews: Number(product.reviews || 0),
    count: Number(product.count || 0),
    price: Number(product.price || 0),
  };
}

function productToForm(product: Product): ProductForm {
  return {
    id: product._id,
    name: product.name || "",
    category: product.category || "Cookies",
    price: String(product.price ?? ""),
    description: product.description || "",
    tags: (product.tags || []).join(", "),
    image: product.image || "",
    accent:
      product.accent ||
      categoryAccent[product.category] ||
      "#8B5E3C",
    note: product.note || "",
    ingredients: (product.ingredients || []).join(", "),
    count: String(product.count ?? 0),
  };
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function AdminItemsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"All" | Category>("All");

  const [sort, setSort] =
    useState<SortOption>("newest");

  const [modalMode, setModalMode] =
    useState<ModalMode>(null);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [page, setPage] = useState(1);

  const pageSize = 8;

  /* ==========================================================
     FETCH PRODUCTS
  ========================================================== */

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API.products, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products.",
        );
      }

      const result = await response.json();

      /*
        Supports either:

        { data: [...] }

        or

        [...]
      */

      const data = Array.isArray(result)
        ? result
        : result.data || [];

      const normalized = data.map(normalizeProduct);

      setProducts(normalized);

      setSelectedProduct((current) => {
        if (!current) return null;

        return (
          normalized.find(
            (product: Product) =>
              product._id === current._id,
          ) || null
        );
      });
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ==========================================================
     FILTER / SORT
  ========================================================== */

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(query),
        );

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);

        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "stock-low":
          return a.count - b.count;

        case "stock-high":
          return b.count - a.count;

        case "newest":
        default:
          return 0;
      }
    });
  }, [
    products,
    search,
    selectedCategory,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / pageSize,
    ),
  );

  const visibleProducts =
    filteredProducts.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* ==========================================================
     STATS
  ========================================================== */

  const totalProducts = products.length;

  const categoryCounts = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category] = products.filter(
          (product) =>
            product.category === category,
        ).length;

        return acc;
      },
      {} as Record<Category, number>,
    );
  }, [products]);

  const lowStockCount = products.filter(
    (product) =>
      product.count > 0 &&
      product.count <= 10,
  ).length;

  /* ==========================================================
     OPEN ADD
  ========================================================== */

  function openAddModal() {
    setForm(emptyForm);
    setModalMode("add");
  }

  /* ==========================================================
     OPEN EDIT
  ========================================================== */

  function openEdit(product: Product) {
    setForm(productToForm(product));
    setModalMode("edit");
  }

  /* ==========================================================
     FORM CHANGE
  ========================================================== */

  function updateForm(
    field: keyof ProductForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    /*
      For a real backend upload, replace this
      with your image upload endpoint.

      For now this converts the image to a
      data URL so the form immediately previews it.
    */
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      updateForm(
        "image",
        String(reader.result || ""),
      );
    };

    reader.readAsDataURL(file);
  }

  /* ==========================================================
     SAVE PRODUCT
  ========================================================== */

  async function handleSubmit(
    event: FormEvent,
    selectedProductId?: string
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Enter a valid product price.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // const payload = {
      //   name: form.name.trim(),
      //   category: form.category,
      //   price: Number(form.price),
      //   description:
      //     form.description.trim(),
      //   tags: form.tags
      //     .split(",")
      //     .map((tag) => tag.trim())
      //     .filter(Boolean),

      //   image: form.image,

      //   accent:
      //     form.accent ||
      //     categoryAccent[form.category],

      //   note: form.note.trim(),

      //   ingredients: form.ingredients
      //     .split(",")
      //     .map((item) => item.trim())
      //     .filter(Boolean),

      //   count: Number(form.count) || 0,
      // };

      const formData = new FormData();

formData.append("name", form.name.trim());
formData.append("category", form.category);
formData.append("price", String(Number(form.price)));
formData.append("description", form.description.trim());

formData.append(
  "tags",
  JSON.stringify(
    form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  )
);

formData.append(
  "accent",
  form.accent || categoryAccent[form.category]
);

formData.append("note", form.note.trim());

formData.append(
  "ingredients",
  JSON.stringify(
    form.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  )
);

formData.append("count", String(Number(form.count) || 0));
if(form.image.endsWith(".png")||form.image.endsWith(".jpg")||form.image.endsWith(".jpeg")||form.image.endsWith(".webp")){
  formData.append("image", form.image);
}else{
  formData.append("image",imageFile!);
}


  for (const [key, value] of formData.entries()) {
  console.log(
    key,
    value instanceof File
      ? `FILE: ${value.name} (${value.size} bytes)`
      : value
  );
}


      const isEditing =
        modalMode === "edit" &&
        selectedProductId;

      const response = await fetch(
        isEditing
          ? API.product(selectedProductId!)
          : API.products,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            // "Content-Type":
            //   "application/json",
          },

          credentials: "include",

          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save product.",
        );
      }

      /*
        Supports:

        { data: product }

        or

        product
      */

      const savedProduct =
        normalizeProduct(
          result.data || result,
        );

      if (isEditing) {
        setProducts((current) =>
          current.map((product) =>
            product._id ===
            savedProduct._id
              ? savedProduct
              : product,
          ),
        );

        setSelectedProduct(
          savedProduct,
        );
      } else {
        setProducts((current) => [
          savedProduct,
          ...current,
        ]);

        setSelectedProduct(
          savedProduct,
        );
      }

      setModalMode(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     DELETE PRODUCT
  ========================================================== */

  async function handleDelete() {
    if (!selectedProduct) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        API.product(
          selectedProduct._id,
        ),
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete product.",
        );
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !==
            selectedProduct._id,
        ),
      );

      setSelectedProduct(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#f8f0e8] ">
      <AdminHeader activeTab="items" />
      <div className="mx-auto max-w-[1550px] px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="relative inline-block">
              <h1 className="font-text tracking-wider text-[50px] font-black leading-[0.85] tracking-[-0.07em] sm:text-[64px]">
                ITEMS
              </h1>

              <span className="absolute -bottom-3 left-0 h-[6px] w-[115px] rotate-[-2deg] rounded-full bg-[#ffd21c]" />
            </div>

            <p className="mt-5 max-w-[500px] text-[12px] font-medium text-[#765e57] sm:text-[13px]">
              Manage everything currently
              available in your bakery.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden rotate-[-5deg] text-right font-text tracking-wider text-[11px] font-black leading-tight sm:block">
              Freshly
              <br />
              baked, always!
            </div>

            <div className="hidden h-[70px] w-[90px] rotate-[4deg] items-center justify-center rounded-[45%] bg-[#ffd976] text-4xl sm:flex">
              🍪
            </div>

            <button
              onClick={openAddModal}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#351615] bg-[#ffd21c] px-5 font-text tracking-wider text-[10px] font-black shadow-[0_2px_0_rgba(53,22,21,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#ffdc43] active:translate-y-0 sm:h-14 sm:px-7 sm:text-[11px]"
            >
              <Plus
                size={17}
                strokeWidth={3}
              />

              ADD NEW PRODUCT
            </button>
          </div>
        </section>

        {/* ======================================================
            ERROR
        ====================================================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-[#efaaa3] bg-[#fff0ee] px-4 py-3 text-[11px] font-semibold text-[#a52d24]"
            >
              <span>{error}</span>

              <button
                onClick={() =>
                  setError("")
                }
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================
            CATEGORY STATS
        ====================================================== */}

        <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            active={
              selectedCategory === "All"
            }
            icon={<Package size={20} />}
            label="ALL PRODUCTS"
            value={totalProducts}
            onClick={() => {
              setSelectedCategory("All");
              setPage(1);
            }}
          />

          {categories.slice(0, 4).map(
            (category) => (
              <StatCard
                key={category}
                active={
                  selectedCategory ===
                  category
                }
                icon={
                  <span className="text-[20px]">
                    {categoryEmoji[
                      category
                    ]}
                  </span>
                }
                label={category.toUpperCase()}
                value={
                  categoryCounts[
                    category
                  ] || 0
                }
                onClick={() => {
                  setSelectedCategory(
                    category,
                  );
                  setPage(1);
                }}
              />
            ),
          )}

          <StatCard
            active={false}
            warning
            icon={
              <AlertTriangle
                size={20}
              />
            }
            label="LOW STOCK"
            value={lowStockCount}
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          />
        </section>

        {/* ======================================================
            FILTER BAR
        ====================================================== */}

        <section className="mb-5 rounded-[20px] border border-[#dfd3ca] bg-[#fffaf5] p-3">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#927a72]"
              />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value,
                  );
                  setPage(1);
                }}
                placeholder="Search products..."
                className="h-12 w-full rounded-[14px] font-text border border-[#e4d8d0] bg-white pl-11 pr-4 text-[12px] font-medium outline-none placeholder:text-[#ad9b94] focus:border-[#9b8279]"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(
                    event.target
                      .value as
                      | "All"
                      | Category,
                  );
                  setPage(1);
                }}
                className="h-12 w-full font-text  appearance-none rounded-[14px] border border-[#e4d8d0] bg-white px-4 pr-10 text-[11px] font-bold outline-none sm:min-w-[180px]"
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ),
                )}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target
                      .value as SortOption,
                  )
                }
                className="h-12 w-full font-text appearance-none rounded-[14px] border border-[#e4d8d0] bg-white px-4 pr-10 text-[11px] font-bold outline-none sm:min-w-[180px]"
              >
                <option className=" font-text " value="newest">
                  Sort by: Newest
                </option>

                <option className=" font-text " value="name">
                  Name A-Z
                </option>

                <option className=" font-text " value="price-low">
                  Price: Low to High
                </option>

                <option className=" font-text " value="price-high">
                  Price: High to Low
                </option>

                <option className=" font-text " value="stock-low">
                  Stock: Low to High
                </option>

                <option className=" font-text " value="stock-high">
                  Stock: High to Low
                </option>
              </select>

              <ArrowUpDown
                size={14}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </section>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        {/* <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_430px]"> */}
        <section className="grid grid-cols-1 gap-5">
          {/* ====================================================
              PRODUCT LIST
          ==================================================== */}

          <div className="min-w-0 rounded-[22px] border border-[#dfd3ca] bg-[#fffaf5] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="relative inline-block">
                <h2 className="font-text tracking-wider text-[23px] font-black tracking-[-0.04em]">
                  {selectedCategory ===
                  "All"
                    ? "ALL PRODUCTS"
                    : selectedCategory.toUpperCase()}
                </h2>

                <span className="absolute -right-5 top-0 text-[13px]">
                  ✦
                </span>
              </div>

              <span className="text-[9px] font-semibold font-text tracking-wider text-[#927a72]">
                {filteredProducts.length}{" "}
                products
              </span>
            </div>

            {loading ? (
              <LoadingProducts />
            ) : visibleProducts.length ===
              0 ? (
              <EmptyProducts
                onAdd={openAddModal}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleProducts.map(
                    (product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        selected={
                          selectedProduct?._id ===
                          product._id
                        }
                        onClick={() =>
                          setSelectedProduct(
                            product,
                          )
                        }
                        onEdit={() =>
                          openEdit(product)
                        }
                      />
                    ),
                  )}
                </div>

                {/* Pagination */}
                <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[#e8ddd6] pt-4 sm:flex-row">
                  <p className="text-[9px] font-medium text-[#927a72]">
                    Showing{" "}
                    <strong>
                      {filteredProducts.length ===
                      0
                        ? 0
                        : (page - 1) *
                            pageSize +
                          1}
                    </strong>{" "}
                   –
                    <strong>
                      {Math.min(
                        page * pageSize,
                        filteredProducts.length,
                      )}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {
                        filteredProducts.length
                      }
                      </strong>
                    
                  </p>

                  <div className="flex items-center gap-1">
                    <PaginationButton
                      disabled={
                        page === 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              1,
                              current - 1,
                            ),
                        )
                      }
                    >
                      <ChevronLeft
                        size={14}
                      />
                    </PaginationButton>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1,
                    ).map(
                      (pageNumber) => (
                        <PaginationButton
                          key={
                            pageNumber
                          }
                          active={
                            pageNumber ===
                            page
                          }
                          onClick={() =>
                            setPage(
                              pageNumber,
                            )
                          }
                        >
                          {pageNumber}
                        </PaginationButton>
                      ),
                    )}

                    <PaginationButton
                      disabled={
                        page ===
                        totalPages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.min(
                              totalPages,
                              current + 1,
                            ),
                        )
                      }
                    >
                      <ChevronRight
                        size={14}
                      />
                    </PaginationButton>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ====================================================
              PRODUCT DETAILS
          ==================================================== */}

          {/* <AnimatePresence mode="wait">
            {selectedProduct ? (
              <ProductDetails
                key={selectedProduct._id}
                product={
                  selectedProduct
                }
                onClose={() =>
                  setSelectedProduct(
                    null,
                  )
                }
                onEdit={() =>
                  openEdit(
                    selectedProduct,
                  )
                }
                onDelete={() =>
                  setShowDeleteConfirm(
                    true,
                  )
                }
              />
            ) : (
              <motion.div
                key="empty-details"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="hidden min-h-[500px] items-center justify-center rounded-[22px] border border-dashed border-[#cdbdb4] bg-[#fffaf5] xl:flex"
              >
                <div className="max-w-[220px] text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffedb0] text-3xl">
                    🍪
                  </div>

                  <h3 className="font-text tracking-wider text-[18px] font-black">
                    PICK A PRODUCT
                  </h3>

                  <p className="mt-2 text-[11px] font-text leading-relaxed text-[#806a62]">
                    Select a product to
                    see its details,
                    ingredients and
                    management options.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </section>
      </div>


      {/* 
      ==========================================================
        open product details
      ==========================================================
      */}
      <AnimatePresence mode="wait">
            {selectedProduct && (
              <ProductDetails
                key={selectedProduct._id}
                product={
                  selectedProduct
                }
                onClose={() =>
                  setSelectedProduct(
                    null,
                  )
                }
                onEdit={() =>
                  openEdit(
                    selectedProduct,
                  )
                }
                onDelete={() =>
                  setShowDeleteConfirm(
                    true,
                  )
                }
              />
            )}
          </AnimatePresence>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      <AnimatePresence>
        {modalMode && (
          <ProductFormModal
            mode={modalMode}
            form={form}
            saving={saving}
            fileInputRef={
              fileInputRef
            }
            onClose={() =>
              setModalMode(null)
            }
            onSubmit={
              handleSubmit
            }
            onChange={
              updateForm
            }
            onImageClick={
              handleImageClick
            }
            onImageChange={
              handleImageChange
            }
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      <AnimatePresence>
        {showDeleteConfirm &&
          selectedProduct && (
            <DeleteConfirmation
              product={
                selectedProduct
              }
              deleting={deleting}
              onClose={() =>
                setShowDeleteConfirm(
                  false,
                )
              }
              onConfirm={
                handleDelete
              }
            />
          )}
      </AnimatePresence>
    </main>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon,
  label,
  value,
  active,
  warning = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  active: boolean;
  warning?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative min-h-[92px] rounded-[18px] border px-3 py-3 text-left transition-all",
        active
          ? "border-[#351615] bg-[#ffd21c] shadow-[0_2px_0_rgba(53,22,21,0.15)]"
          : "border-[#bbaaa1] bg-[#fffaf5] hover:-translate-y-0.5 hover:bg-white",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            active
              ? "bg-[#fff2a9]"
              : "bg-[#ffedbd]",
          ].join(" ")}
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="truncate font-text tracking-wider text-[8px] font-black">
            {label}
          </p>

          <p className="mt-0.5 font-text tracking-wider text-[25px] font-black leading-none tracking-[-0.05em]">
            {value}
          </p>
        </div>
      </div>

      {active && (
        <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#351615]" />
      )}

      {warning && value > 0 && (
        <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-[#ed4337]" />
      )}
    </button>
  );
}

/* ================================================================
   PRODUCT CARD
================================================================ */

function ProductCard({
  product,
  selected,
  onClick,
  onEdit,
}: {
  product: Product;
  selected: boolean;
  onClick: () => void;
  onEdit: () => void;
}) {
  const stock = getStockState(
    product.count,
  );

  return (
    <motion.div
      layout
      whileHover={{
        y: -2,
      }}
      className={[
        "group cursor-pointer overflow-hidden rounded-[17px] border bg-[#fffaf5] transition-all",
        selected
          ? "border-[#351615] shadow-[0_3px_0_rgba(53,22,21,0.15)]"
          : "border-[#dfd3ca] hover:border-[#bca79d]",
      ].join(" ")}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative m-2.5 overflow-hidden rounded-[12px] bg-[#f2dfc6]">
        <div className="aspect-[2.1/1]">
          {product.image ? (
            <img
              src={process.env.NEXT_PUBLIC_API_URL+'/images/'+product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-5xl"
              style={{
                background:
                  product.accent ||
                  categoryAccent[
                    product.category
                  ],
              }}
            >
              {
                categoryEmoji[
                  product.category
                ]
              }
            </div>
          )}
        </div>

        <span className="absolute bottom-2 left-2 rounded-full bg-[#fff8ee] px-2.5 py-1 font-text tracking-wider text-[7px] font-black">
          {product.category.toUpperCase()}
        </span>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e0d2ca] bg-[#fffaf5]/95 transition-all hover:bg-white"
        >
          <Pencil size={13} />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <h3 className="truncate font-text tracking-wider text-[12px] font-black">
          {product.name}
        </h3>

        <p className="mt-1 min-h-[28px] line-clamp-2 text-[9px] leading-relaxed text-[#806a62]">
          {product.description ||
            "Freshly baked and made with love."}
        </p>

        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="font-text tracking-wider text-[16px] font-black">
            {formatPrice(
              product.price,
            )}
          </span>

          <span
            className={[
              "flex items-center gap-1 rounded-full px-2 py-1 text-[7px] font-black",
              stock.className,
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                stock.dot,
              ].join(" ")}
            />

            {product.count}{" "}
            {product.count === 1
              ? "in stock"
              : "in stock"}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span
            className={[
              "rounded-full px-2.5 py-1 text-[7px] font-black",
              stock.className,
            ].join(" ")}
          >
            {stock.label}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9cbc3] bg-white hover:bg-[#fff0d6]"
            >
              <Pencil size={11} />
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d9cbc3] bg-white hover:bg-[#fff0d6]"
            >
              <ArrowUpDown
                size={11}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   PRODUCT DETAILS
================================================================ */

function ProductDetails({
  product,
  onClose,
  onEdit,
  onDelete,
}: {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const stock = getStockState(
    product.count,
  );

  return (
    <motion.aside
      initial={{
        opacity: 0,
        x: 25,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 25,
      }}
      transition={{
        duration: 0.2,
      }}
      data-lenis-prevent
      className="fixed overflow-hidden overscroll-contain inset-0 z-40 flex bg-[#351615]/20 backdrop-blur-[2px] z-[11000] max-h-screen"
    >
      <div className="absolute inset-0 bg-black/10" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-[460px] flex-col rounded-l-[24px] border border-[#dfd3ca] bg-[#fffaf5] p-5 shadow-2xl  xl:rounded-[22px] xl:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-text tracking-wider text-[18px] font-black">
            Product Details
          </h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f2e6de]"
          >
            <X size={17} />
          </button>
        </div>

        {/* Product hero */}
        <div className="mt-5 grid grid-cols-[145px_1fr] gap-4">
          <div className="overflow-hidden rounded-[13px] ">
            <div className="aspect-square">
              {product.image ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_URL+'/images/'+product.image}
                  alt={product.name}
                  className="w-full object-cover rounded-[13px]"
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center text-5xl"
                  style={{
                    background:
                      product.accent ||
                      categoryAccent[
                        product.category
                      ],
                  }}
                >
                  {
                    categoryEmoji[
                      product.category
                    ]
                  }
                </div>
              )}
            </div>
          </div>

          <div className="pt-1">
            <span className="inline-flex rounded-full bg-[#ffedb0] px-3 py-1 font-text tracking-wider text-[8px] font-black">
              {product.category.toUpperCase()}
            </span>

            <h3 className="mt-3 font-text tracking-wider text-[17px] font-black leading-tight">
              {product.name}
            </h3>

            <p className="mt-2 font-text tracking-wider text-[20px] font-black">
              {formatPrice(
                product.price,
              )}
            </p>

            <div className="mt-1 flex items-center gap-1 text-[10px]">
              <Star
                size={12}
                fill="#351615"
              />

              <strong>
                {product.rating?.toFixed(
                  1,
                ) || "0.0"}
              </strong>

              <span className="text-[#806a62]">
                ({product.reviews || 0}{" "}
                reviews)
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  stock.dot,
                ].join(" ")}
              />

              {product.count} in stock
            </div>

            <span
              className={[
                "mt-2 inline-flex rounded-full px-2.5 py-1 text-[8px] font-black",
                stock.className,
              ].join(" ")}
            >
              {stock.label}
            </span>
          </div>
        </div>

        <div className="my-5 border-t border-[#e4d8d0]" />
        
        {/* middle items */}
        <div className="h-full overflow-y-auto font-text tracking-wider">    
       {/* Description */}
        <DetailSection title="Description">
          <p className="text-[11px] leading-relaxed text-[#67504a]">
            {product.description ||
              "No description added."}
          </p>
        </DetailSection>

        {/* Ingredients */}
        <DetailSection title="Ingredients">
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients &&
            product.ingredients.length >
              0 ? (
              product.ingredients.map(
                (ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-[#f4eadf] px-2.5 py-1 text-[9px] font-medium"
                  >
                    {ingredient}
                  </span>
                ),
              )
            ) : (
              <p className="text-[10px] text-[#806a62]">
                No ingredients added.
              </p>
            )}
          </div>
        </DetailSection>

        {/* Tags */}
        <DetailSection title="Tags">
          <div className="flex flex-wrap gap-1.5">
            {product.tags.length >
            0 ? (
              product.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#ffedb0] px-3 py-1.5 text-[9px] font-semibold"
                  >
                    {tag}
                  </span>
                ),
              )
            ) : (
              <span className="text-[10px] text-[#806a62]">
                No tags.
              </span>
            )}
          </div>
        </DetailSection>

        {/* Meta */}
        <div className="my-5 border-t border-[#e4d8d0]" />

        <div className="grid grid-cols-2 gap-y-5">
          <MetaItem
            label="CATEGORY"
            value={product.category}
          />

          <MetaItem
            label="ACCENT COLOR"
            value={product.accent || "—"}
            color={product.accent}
          />

          <MetaItem
            label="STOCK"
            value={String(
              product.count,
            )}
          />

          <MetaItem
            label="NOTE"
            value={
              product.note || "—"
            }
          />

          <MetaItem
            label="RATING"
            value={
              product.rating
                ? `${product.rating.toFixed(
                    1,
                  )} (${product.reviews || 0})`
                : "—"
            }
          />

          <MetaItem
            label="AVAILABILITY"
            value={
              product.count > 0
                ? "Available"
                : "Out of stock"
            }
          />
        </div>

         </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={()=>{
              onClose()
              onEdit()
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#351615] bg-[#ffd21c] font-text tracking-wider text-[9px] font-black transition-colors hover:bg-[#ffdc43]"
          >
            <Pencil size={13} />
            EDIT PRODUCT
          </button>

          <button
            onClick={onDelete}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#ef8b82] bg-white font-text tracking-wider text-[9px] font-black text-[#d64242] transition-colors hover:bg-[#fff0ee]"
          >
            <Trash2 size={13} />
            DELETE PRODUCT
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

/* ================================================================
   DETAIL SECTION
================================================================ */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h4 className="mb-2 font-text tracking-wider text-[11px] font-black">
        {title}
      </h4>

      {children}
    </section>
  );
}

/* ================================================================
   META
================================================================ */

function MetaItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <p className="font-text tracking-wider text-[8px] font-black text-[#907970]">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        {color && (
          <span
            className="h-4 w-4 rounded-full border border-black/10"
            style={{
              backgroundColor: color,
            }}
          />
        )}

        <p className="text-[10px] font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   FORM MODAL
================================================================ */

function ProductFormModal({
  mode,
  form,
  saving,
  fileInputRef,
  onClose,
  onSubmit,
  onChange,
  onImageClick,
  onImageChange,
}: {
  mode: "add" | "edit";
  form: ProductForm;
  saving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onSubmit: (
    event: FormEvent,
    seledtedProductId: string,
  ) => void;
  onChange: (
    field: keyof ProductForm,
    value: string,
  ) => void;
  onImageClick: () => void;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
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
      data-lenis-prevent
      className="fixed inset-0 z-[11000] font-text overscroll-contain flex items-end justify-center bg-[#351615]/35 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <motion.form
        initial={{
          y: 35,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: 35,
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        // onSubmit={onSubmit}
        onSubmit={(event: FormEvent)=>{
          onSubmit(event,form.id)
        }}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="max-h-[95vh] w-full max-w-[800px] overflow-y-auto rounded-t-[25px] border border-[#d9cbc3] bg-[#fffaf5] p-5 shadow-2xl sm:rounded-[25px] sm:p-7"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-text tracking-wider text-[25px] font-black tracking-[-0.04em]">
              {mode === "add"
                ? "ADD NEW PRODUCT"
                : "EDIT PRODUCT"}
            </h2>

            <p className="mt-1 text-[10px] text-[#806a62]">
              {mode === "add"
                ? "Add a new treat to your bakery."
                : "Update your product information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f1e5dd]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
          {/* Image */}
          <div>
            <label className="mb-2 block font-text tracking-wider text-[9px] font-black">
              PRODUCT IMAGE
            </label>

            <button
              type="button"
              onClick={onImageClick}
              className="group relative aspect-square w-full overflow-hidden rounded-[18px] border-2 border-dashed border-[#cdbdb4] bg-[#f7eadf] transition-colors hover:border-[#927a72]"
            >
              {form.image ? (
                <>
                  <img
                    src={(form.image.endsWith(".png") || form.image.endsWith(".jpg"))  ? `${process.env.NEXT_PUBLIC_API_URL}/images/${form.image}` : form.image}
                    // src={process.env.NEXT_PUBLIC_API_URL+'/images/'+form.image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute inset-0 flex items-center justify-center bg-[#351615]/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-2 font-text tracking-wider text-[9px] font-black">
                      <Upload size={15} />
                      CHANGE IMAGE
                    </span>
                  </span>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffedb0]">
                    <ImagePlus
                      size={25}
                    />
                  </span>

                  <span className="font-text tracking-wider text-[10px] font-black">
                    UPLOAD IMAGE
                  </span>

                  <span className="text-[9px] leading-relaxed text-[#927a72]">
                    Click to select a
                    product image.
                  </span>
                </div>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <FormInput
              label="PRODUCT NAME"
              value={form.name}
              placeholder="Chocolate Chip Cookies"
              onChange={(value) =>
                onChange(
                  "name",
                  value,
                )
              }
              required
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormSelect
                label="CATEGORY"
                value={form.category}
                options={categories}
                onChange={(value) =>
                  onChange(
                    "category",
                    value,
                  )
                }
              />

              <FormInput
                label="PRICE"
                value={form.price}
                type="number"
                placeholder="320"
                onChange={(value) =>
                  onChange(
                    "price",
                    value,
                  )
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormInput
                label="STOCK"
                value={form.count}
                type="number"
                placeholder="42"
                onChange={(value) =>
                  onChange(
                    "count",
                    value,
                  )
                }
              />

              <FormInput
                label="ACCENT COLOR"
                value={form.accent}
                placeholder="#8B5E3C"
                onChange={(value) =>
                  onChange(
                    "accent",
                    value,
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <FormTextarea
            label="DESCRIPTION"
            value={form.description}
            placeholder="Classic cookies with rich chocolate chips..."
            onChange={(value) =>
              onChange(
                "description",
                value,
              )
            }
          />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <FormInput
            label="TAGS"
            value={form.tags}
            placeholder="Crunchy, Chocolate, Popular"
            onChange={(value) =>
              onChange(
                "tags",
                value,
              )
            }
          />

          <p className="mt-1.5 text-[8px] text-[#927a72]">
            Separate tags using commas.
          </p>
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <FormTextarea
            label="INGREDIENTS"
            value={form.ingredients}
            placeholder="Flour, butter, sugar, chocolate chips..."
            onChange={(value) =>
              onChange(
                "ingredients",
                value,
              )
            }
          />

          <p className="mt-1.5 text-[8px] text-[#927a72]">
            Separate ingredients using
            commas.
          </p>
        </div>

        {/* Note */}
        <div className="mt-4">
          <FormInput
            label="NOTE"
            value={form.note}
            placeholder="Best seller!"
            onChange={(value) =>
              onChange(
                "note",
                value,
              )
            }
          />
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="h-12 rounded-xl border border-[#d9cbc3] bg-white px-6 font-text tracking-wider text-[9px] font-black hover:bg-[#f8eee7] disabled:opacity-50"
          >
            CANCEL
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#351615] bg-[#ffd21c] px-7 font-text tracking-wider text-[9px] font-black hover:bg-[#ffdc43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />

                SAVING...
              </>
            ) : (
              <>
                <CircleCheck
                  size={15}
                />

                {mode === "add"
                  ? "ADD PRODUCT"
                  : "SAVE CHANGES"}
              </>
            )}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/* ================================================================
   FORM INPUT
================================================================ */

function FormInput({
  label,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-text tracking-wider text-[9px] font-black">
        {label}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-[#dfd3ca] bg-white px-3 text-[11px] font-medium outline-none placeholder:text-[#b3a29a] focus:border-[#927a72]"
      />
    </label>
  );
}

/* ================================================================
   TEXTAREA
================================================================ */

function FormTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-text tracking-wider text-[9px] font-black">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        rows={4}
        className="w-full resize-none rounded-xl border border-[#dfd3ca] bg-white px-3 py-3 text-[11px] font-medium leading-relaxed outline-none placeholder:text-[#b3a29a] focus:border-[#927a72]"
      />
    </label>
  );
}

/* ================================================================
   SELECT
================================================================ */

function FormSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-text tracking-wider text-[9px] font-black">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="h-11 w-full appearance-none rounded-xl border border-[#dfd3ca] bg-white px-3 pr-9 text-[11px] font-medium outline-none focus:border-[#927a72]"
        >
          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ),
          )}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>
    </label>
  );
}

/* ================================================================
   DELETE CONFIRMATION
================================================================ */

function DeleteConfirmation({
  product,
  deleting,
  onClose,
  onConfirm,
}: {
  product: Product;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#351615]/40 px-4 backdrop-blur-[3px]"
    >
      <motion.div
        initial={{
          scale: 0.96,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.96,
          opacity: 0,
        }}
        className="w-full max-w-[420px] rounded-[24px] border border-[#dfd3ca] bg-[#fffaf5] p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffd9d5] text-[#a52d24]">
          <Trash2 size={20} />
        </div>

        <h2 className="mt-5 font-text tracking-wider text-[20px] font-black">
          DELETE PRODUCT?
        </h2>

        <p className="mt-2 text-[11px] leading-relaxed text-[#806a62]">
          Are you sure you want to delete{" "}
          <strong className="text-[#351615]">
            {product.name}
          </strong>
          ? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            disabled={deleting}
            className="h-11 rounded-xl border border-[#d9cbc3] bg-white px-5 font-text tracking-wider text-[9px] font-black hover:bg-[#f7eee8]"
          >
            KEEP PRODUCT
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#a52d24] bg-[#d64242] px-5 font-text tracking-wider text-[9px] font-black text-white disabled:opacity-60"
          >
            {deleting ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={14} />
            )}

            DELETE PRODUCT
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   LOADING
================================================================ */

function LoadingProducts() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[17px] border border-[#e2d7d0] bg-white p-2.5"
        >
          <div className="aspect-[2.1/1] rounded-xl bg-[#eee1d7]" />

          <div className="space-y-2 p-2">
            <div className="h-3 w-2/3 rounded bg-[#eee1d7]" />
            <div className="h-2 w-full rounded bg-[#eee1d7]" />
            <div className="h-4 w-1/3 rounded bg-[#eee1d7]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   EMPTY
================================================================ */

function EmptyProducts({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffedb0] text-3xl">
        🍪
      </div>

      <h3 className="mt-4 font-text tracking-wider text-[18px] font-black">
        NO PRODUCTS FOUND
      </h3>

      <p className="mt-2 max-w-[280px] text-[10px] leading-relaxed text-[#806a62]">
        There are no products matching
        your current search or filter.
      </p>

      <button
        onClick={onAdd}
        className="mt-5 flex h-10 items-center gap-2 rounded-full border border-[#351615] bg-[#ffd21c] px-5 font-text tracking-wider text-[9px] font-black"
      >
        <Plus size={14} />
        ADD PRODUCT
      </button>
    </div>
  );
}

/* ================================================================
   PAGINATION
================================================================ */

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-text tracking-wider text-[9px] font-black transition-colors",
        active
          ? "bg-[#ffd21c]"
          : "hover:bg-[#f1e4dc]",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}