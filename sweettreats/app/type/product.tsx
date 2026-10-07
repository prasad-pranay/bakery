export type Category =
    | "All"
    | "Cookies"
    | "Cake"
    | "Pastries"
    | "Croissant"
    | "Bagel"
    | "Bread";

export type ProductReview = {
    id: number;
    name: string;
    rating: number;
    text: string;
    date: string;
};

export type Product = {
    _id: number;
    name: string;
    category: Exclude<Category, "All">;
    price: number;
    description: string;
    tags: string[];
    image: string;
    accent: string;
    note: string;
    count: number
    __v?: number;
    ingredients?: string[];
    rating?: number;
    reviews?: ProductReview[];
};