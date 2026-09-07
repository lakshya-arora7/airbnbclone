"""
Layer 3: Dynamic Pricing & Multi-Currency Engine

Authoritative server-side price computation:
- Length-of-stay discounts: >= 7 nights (10%), >= 28 nights (20%)
- Cleaning fee: flat per-stay fee
- Platform service fee: round(discounted_subtotal * 0.14, 2)
- Multi-currency conversion matrix
"""

from typing import Dict, Any, Optional
from datetime import date

class PricingEngine:
    AIRBNB_SERVICE_FEE_PERCENT = 14.0  # 14% standard guest service fee
    WEEKLY_DISCOUNT_THRESHOLD = 7       # 7 nights = 10% off
    WEEKLY_DISCOUNT_PERCENT = 10.0
    MONTHLY_DISCOUNT_THRESHOLD = 28     # 28 nights = 20% off
    MONTHLY_DISCOUNT_PERCENT = 20.0

    # Exchange rates relative to INR (base currency)
    EXCHANGE_RATES: Dict[str, Dict[str, Any]] = {
        "INR": {"rate": 1.0, "symbol": "₹", "name": "Indian Rupee"},
        "USD": {"rate": 0.012, "symbol": "$", "name": "United States Dollar"},
        "EUR": {"rate": 0.011, "symbol": "€", "name": "Euro"},
        "GBP": {"rate": 0.0094, "symbol": "£", "name": "British Pound"},
        "JPY": {"rate": 1.80, "symbol": "¥", "name": "Japanese Yen"},
        "AUD": {"rate": 0.018, "symbol": "A$", "name": "Australian Dollar"},
        "CAD": {"rate": 0.016, "symbol": "C$", "name": "Canadian Dollar"},
        "AED": {"rate": 0.044, "symbol": "AED", "name": "UAE Dirham"}
    }

    @classmethod
    def calculate_stay_pricing(
        cls,
        price_per_night: float,
        cleaning_fee: float,
        total_nights: int,
        custom_service_fee_percent: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Authoritatively calculates pricing breakdowns with discounts and fees.
        """
        if total_nights <= 0:
            raise ValueError("Total nights must be at least 1.")

        gross_subtotal = round(price_per_night * total_nights, 2)

        # Apply tiered length-of-stay discounts
        discount_percent = 0.0
        if total_nights >= cls.MONTHLY_DISCOUNT_THRESHOLD:
            discount_percent = cls.MONTHLY_DISCOUNT_PERCENT
        elif total_nights >= cls.WEEKLY_DISCOUNT_THRESHOLD:
            discount_percent = cls.WEEKLY_DISCOUNT_PERCENT

        discount_amount = round(gross_subtotal * (discount_percent / 100.0), 2)
        net_nightly_total = round(gross_subtotal - discount_amount, 2)

        fee_percent = custom_service_fee_percent if custom_service_fee_percent is not None else cls.AIRBNB_SERVICE_FEE_PERCENT
        service_fee = round(net_nightly_total * (fee_percent / 100.0), 2)
        total_price = round(net_nightly_total + cleaning_fee + service_fee, 2)

        return {
            "nightly_rate": price_per_night,
            "total_nights": total_nights,
            "gross_subtotal": gross_subtotal,
            "discount_percent": discount_percent,
            "discount_amount": discount_amount,
            "net_nightly_total": net_nightly_total,
            "cleaning_fee": cleaning_fee,
            "service_fee_percent": fee_percent,
            "service_fee": service_fee,
            "total_price": total_price
        }

    @classmethod
    def convert_currency(cls, amount_inr: float, target_currency: str) -> Dict[str, Any]:
        """
        Converts an INR price amount to target currency.
        """
        code = target_currency.upper()
        if code not in cls.EXCHANGE_RATES:
            code = "INR"

        meta = cls.EXCHANGE_RATES[code]
        converted = round(amount_inr * meta["rate"], 2 if code != "JPY" else 0)

        return {
            "currency": code,
            "symbol": meta["symbol"],
            "amount": converted,
            "formatted": f"{meta['symbol']}{int(converted):,}" if code in ["INR", "JPY"] else f"{meta['symbol']}{converted:,.2f}"
        }
