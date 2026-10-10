from datetime import datetime
from pymongo import MongoClient
from app.config import Config

sample_products = [
  {
    "name": "Chocolate Croissant",
    "category": "Croissant",
    "price": 350,
    "description": "Buttery croissant filled with rich dark chocolate.",
    "tags": ["Chocolate", "Fresh", "Buttery", "Breakfast"],
    "image": "/images/chocolate-croissant.jpg",
    "accent": "#6B4226",
    "note": "Best served warm",
    "ingredients": ["Flour", "Butter", "Dark Chocolate", "Sugar", "Yeast", "Milk"],
    "rating": 4.8,
    "reviewCount": 24,
    "count": 25,
    "reviews": [],
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
  },
  {
    "name": "Classic Sourdough Bread",
    "category": "Bread",
    "price": 450,
    "description": "Artisan sourdough bread baked to perfection with a crispy crust.",
    "tags": ["Artisan", "Vegan", "Fresh", "Classic"],
    "image": "/images/sourdough.jpg",
    "accent": "#D2B48C",
    "note": "Great for sandwiches",
    "ingredients": ["Flour", "Water", "Salt", "Wild Yeast"],
    "rating": 4.9,
    "reviewCount": 42,
    "count": 10,
    "reviews": [],
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
  },
  {
    "name": "Everything Bagel",
    "category": "Bagel",
    "price": 180,
    "description": "New York style bagel topped with sesame seeds, poppy seeds, and garlic.",
    "tags": ["Savory", "Breakfast", "Popular"],
    "image": "/images/everything-bagel.jpg",
    "accent": "#E2C288",
    "note": "Delicious with cream cheese",
    "ingredients": ["Flour", "Water", "Salt", "Yeast", "Sesame Seeds", "Poppy Seeds", "Dried Garlic", "Dried Onion"],
    "rating": 4.6,
    "reviewCount": 18,
    "count": 30,
    "reviews": [],
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
  },
  {
    "name": "Chocolate Chip Cookie",
    "category": "Cookies",
    "price": 120,
    "description": "Chewy and soft cookie loaded with milk chocolate chips.",
    "tags": ["Sweet", "Snack", "Kids"],
    "image": "/images/choc-chip-cookie.jpg",
    "accent": "#8B4513",
    "note": "Perfect with a glass of milk",
    "ingredients": ["Flour", "Butter", "Brown Sugar", "White Sugar", "Eggs", "Vanilla", "Chocolate Chips"],
    "rating": 4.7,
    "reviewCount": 56,
    "count": 50,
    "reviews": [],
    "createdAt": datetime.utcnow(),
    "updatedAt": datetime.utcnow()
  }
]

def seed_db():
    client = MongoClient(Config.MONGODB_URI)
    db = client.get_default_database()
    if db is None:
        db = client['bakery']
    print("Connected to MongoDB")

    # Clear existing data (optional, matching seed.ts)
    db.products.delete_many({})
    print("Cleared existing products")

    # Insert sample products
    db.products.insert_many(sample_products)
    print("Sample products inserted successfully")
    print("Database seeded!")

if __name__ == '__main__':
    seed_db()
