import os
import re
import requests
from urllib.parse import urlparse


products= [
    {
        "id": 1,
        "name": "Chocolate Chip Cookies",
        "category": "Cookies",
        "price": 120,
        "description": "Classic, chunky and loaded with chocolate.",
        "tags": ["Classic", "Crunchy", "Buttery"],
        "image":
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=85&w=1000&auto=format&fit=crop",
        "accent": "#FFE45E",
        "note": "CLASSIC FAVOURITE",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 2,
        "name": "Bagel With Seeds",
        "category": "Bagel",
        "price": 150,
        "description": "Freshly baked with a golden, chewy crust.",
        "tags": ["Fresh", "Chewy", "Hearty"],
        "image":
            "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=85&w=1000&auto=format&fit=crop",
        "accent": "#8FD7E8",
        "note": "FRESHLY BAKED",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 3,
        "name": "Sliced Piece Bread",
        "category": "Bread",
        "price": 80,
        "description": "Soft everyday bread baked from scratch.",
        "tags": ["Soft", "Fresh", "Everyday"],
        "image":
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=85&w=1000&auto=format&fit=crop",
        "accent": "#FFA16D",
        "note": "SO SOFT",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 4,
        "name": "Nutty Biscuits",
        "category": "Cookies",
        "price": 140,
        "description": "Golden biscuits packed with roasted nuts.",
        "tags": ["Almond", "Crunchy", "Wholesome"],
        "image":
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=85&w=1000&auto=format&fit=crop",
        "accent": "#B8D8A8",
        "note": "NUTS IN EVERY BITE",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 5,
        "name": "Classic Croissant",
        "category": "Croissant",
        "price": 160,
        "description": "Flaky layers with a rich buttery center.",
        "tags": ["Classic", "Buttery", "Flaky"],
        "image":
            "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=85&w=1000&auto=format&fit=crop",
        "accent": "#9EDFF0",
        "note": "BUTTERY & FLAKY",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 6,
        "name": "Blueberry Cake",
        "category": "Cake",
        "price": 180,
        "description": "Moist vanilla cake filled with real berries.",
        "tags": ["Fruity", "Moist", "Delicious"],
        "image":
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=85&w=1000&auto=format&fit=crop",
        "accent": "#D5B8F5",
        "note": "REAL BERRIES",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 7,
        "name": "Sea Salt Pretzel",
        "category": "Pastries",
        "price": 130,
        "description": "Golden, chewy and finished with sea salt.",
        "tags": ["Classic", "Chewy", "Salty"],
        "image":
            "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?q=85&w=1000&auto=format&fit=crop",
        "accent": "#92DCE5",
        "note": "SALTY & SOFT",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
    {
        "id": 8,
        "name": "Cinnamon Roll",
        "category": "Pastries",
        "price": 170,
        "description": "Warm cinnamon, soft dough and sweet icing.",
        "tags": ["Cinnamon", "Soft", "Creamy"],
        "image":
            "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=85&w=1000&auto=format&fit=crop",
        "accent": "#FFB08B",
        "note": "SWEET & WARM",

        "rating": 4.8,
        "reviewCount": 124,

        "ingredients": [
            "Dark chocolate",
            "Wheat flour",
            "Brown sugar",
            "Butter",
            "Free-range eggs",
            "Vanilla",
            "Sea salt",
        ],

        "reviews": [
            {
                "id": 1,
                "name": "Aarav",
                "rating": 5,
                "text": "The chocolate chunks are ridiculously good.",
                "date": "2 days ago",
            },
            {
                "id": 2,
                "name": "Meera",
                "rating": 5,
                "text": "Soft in the middle and crispy around the edges.",
                "date": "1 week ago",
            },
            {
                "id": 3,
                "name": "Rohan",
                "rating": 4,
                "text": "Really good cookie. Would order again.",
                "date": "2 weeks ago",
            },
        ],
    },
];


# Folder where images will be saved
OUTPUT_DIR = "images"

os.makedirs(OUTPUT_DIR, exist_ok=True)


# def get_image_urls(file_path):
#     with open(file_path, "r", encoding="utf-8") as file:
#         content = file.read()

#     # Finds:
#     # "image": "https://..."
#     # "image": 'https://...'
#     pattern = r'image\s*:\s*["\'](https?://[^"\']+)["\']'

#     return re.findall(pattern, content)


# def get_extension(url):
#     path = urlparse(url).path
#     extension = os.path.splitext(path)[1].lower()

#     if extension in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
#         return extension

#     return ".jpg"


def download_images():
    total = len(products)

    print(f"Found {total} images\n")

    for index, product in enumerate(products, start=1):
        url = product["image"]
        output_path = os.path.join(
            OUTPUT_DIR,
            f"{index}.png"
        )

        try:
            print(f"[{index}/{total}] Downloading...")

            response = requests.get(
                url,
                timeout=30,
                headers={
                    "User-Agent": "Mozilla/5.0"
                }
            )

            response.raise_for_status()

            with open(output_path, "wb") as file:
                file.write(response.content)

            print(f"    Saved: {output_path}")

        except requests.RequestException as error:
            print(f"    FAILED: {error}")


download_images()