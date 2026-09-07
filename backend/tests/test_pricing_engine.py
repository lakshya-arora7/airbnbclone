import pytest
from app.services.pricing_engine import PricingEngine

def test_basic_stay_pricing_no_discount():
    # 2 nights at 3000/night, 400 cleaning fee
    result = PricingEngine.calculate_stay_pricing(
        price_per_night=3000.0,
        cleaning_fee=400.0,
        total_nights=2
    )
    assert result["gross_subtotal"] == 6000.0
    assert result["discount_percent"] == 0.0
    assert result["net_nightly_total"] == 6000.0
    # Service fee 14% of 6000 = 840.0
    assert result["service_fee"] == 840.0
    # Total = 6000 + 400 + 840 = 7240.0
    assert result["total_price"] == 7240.0

def test_weekly_discount_7_nights():
    # 7 nights at 1000/night, 200 cleaning fee
    result = PricingEngine.calculate_stay_pricing(
        price_per_night=1000.0,
        cleaning_fee=200.0,
        total_nights=7
    )
    # Gross: 7000
    assert result["gross_subtotal"] == 7000.0
    # 10% discount on 7+ nights
    assert result["discount_percent"] == 10.0
    assert result["discount_amount"] == 700.0
    # Net: 6300
    assert result["net_nightly_total"] == 6300.0
    # Service fee: 14% of 6300 = 882.0
    assert result["service_fee"] == 882.0
    # Total = 6300 + 200 + 882 = 7382.0
    assert result["total_price"] == 7382.0

def test_monthly_discount_30_nights():
    # 30 nights at 1000/night
    result = PricingEngine.calculate_stay_pricing(
        price_per_night=1000.0,
        cleaning_fee=500.0,
        total_nights=30
    )
    assert result["gross_subtotal"] == 30000.0
    # 20% discount on 28+ nights
    assert result["discount_percent"] == 20.0
    assert result["discount_amount"] == 6000.0
    assert result["net_nightly_total"] == 24000.0
    # Service fee: 14% of 24000 = 3360.0
    assert result["service_fee"] == 3360.0
    assert result["total_price"] == 24000.0 + 500.0 + 3360.0

def test_currency_conversion():
    # 100,000 INR conversion
    usd = PricingEngine.convert_currency(100000.0, "USD")
    assert usd["currency"] == "USD"
    assert usd["symbol"] == "$"
    assert usd["amount"] == 1200.0  # 100000 * 0.012

    eur = PricingEngine.convert_currency(100000.0, "EUR")
    assert eur["currency"] == "EUR"
    assert eur["symbol"] == "€"
    assert eur["amount"] == 1100.0  # 100000 * 0.011
