import time

class PaymentService:
    @staticmethod
    def create_payment_intent(amount: float, currency: str = 'usd'):
        # Matches backend/src/services/PaymentService.ts
        return {
            'clientSecret': 'stub_secret_123',
            'transactionId': f'txn_{int(time.time() * 1000)}'
        }

    @staticmethod
    def verify_payment(transaction_id: str):
        return True

    @staticmethod
    def process_refund(transaction_id: str, amount: float):
        return True
