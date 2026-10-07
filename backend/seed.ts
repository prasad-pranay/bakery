import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
import User from './src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery';

const sampleProducts = [
  {
    name: "Chocolate Croissant",
    category: "Croissant",
    price: 350,
    description: "Buttery croissant filled with rich dark chocolate.",
    tags: ["Chocolate", "Fresh", "Buttery", "Breakfast"],
    image: "/images/chocolate-croissant.jpg",
    accent: "#6B4226",
    note: "Best served warm",
    ingredients: ["Flour", "Butter", "Dark Chocolate", "Sugar", "Yeast", "Milk"],
    rating: 4.8,
    reviewCount: 24,
    count: 25,
    reviews: []
  },
  {
    name: "Classic Sourdough Bread",
    category: "Bread",
    price: 450,
    description: "Artisan sourdough bread baked to perfection with a crispy crust.",
    tags: ["Artisan", "Vegan", "Fresh", "Classic"],
    image: "/images/sourdough.jpg",
    accent: "#D2B48C",
    note: "Great for sandwiches",
    ingredients: ["Flour", "Water", "Salt", "Wild Yeast"],
    rating: 4.9,
    reviewCount: 42,
    count: 10,
    reviews: []
  },
  {
    name: "Everything Bagel",
    category: "Bagel",
    price: 180,
    description: "New York style bagel topped with sesame seeds, poppy seeds, and garlic.",
    tags: ["Savory", "Breakfast", "Popular"],
    image: "/images/everything-bagel.jpg",
    accent: "#E2C288",
    note: "Delicious with cream cheese",
    ingredients: ["Flour", "Water", "Salt", "Yeast", "Sesame Seeds", "Poppy Seeds", "Dried Garlic", "Dried Onion"],
    rating: 4.6,
    reviewCount: 18,
    count: 30,
    reviews: []
  },
  {
    name: "Chocolate Chip Cookie",
    category: "Cookies",
    price: 120,
    description: "Chewy and soft cookie loaded with milk chocolate chips.",
    tags: ["Sweet", "Snack", "Kids"],
    image: "/images/choc-chip-cookie.jpg",
    accent: "#8B4513",
    note: "Perfect with a glass of milk",
    ingredients: ["Flour", "Butter", "Brown Sugar", "White Sugar", "Eggs", "Vanilla", "Chocolate Chips"],
    rating: 4.7,
    reviewCount: 56,
    count: 50,
    reviews: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional, but good for a fresh seed)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    mongoose.disconnect();
    console.log('Database seeded! Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
