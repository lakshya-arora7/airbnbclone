"""
Seed 5 Sample Listings - Delegator to app.db.seed_data
"""
from app.db.seed_data import seed_database

def seed_five_sample_listings(db=None):
    return seed_database(db)

if __name__ == "__main__":
    seed_five_sample_listings()
