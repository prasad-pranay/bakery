from datetime import datetime
from bson import ObjectId

class UserDoc:
    @staticmethod
    def create_payload(name, email, hashed_password, verification_token, verification_expires):
        now = datetime.utcnow()
        return {
            "name": name,
            "email": email,
            "password": hashed_password,
            "cart": [],
            "orders": [],
            "savedAddresses": [],
            "savedPaymentMethods": [],
            "usedCoupons": [],
            "emailVerified": False,
            "emailVerificationToken": verification_token,
            "emailVerificationExpires": verification_expires,
            "passwordResetToken": None,
            "passwordResetExpires": None,
            "createdAt": now,
            "updatedAt": now
        }

class ProductDoc:
    VALID_CATEGORIES = ["Cookies", "Cake", "Pastries", "Croissant", "Bagel", "Bread"]

class OrderDoc:
    ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"]
    PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"]
