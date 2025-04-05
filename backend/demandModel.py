import json
import sys
from collections import defaultdict

# File paths
data_path = "./data/foodListings.json"

# Load food listing data
with open(data_path, "r") as f:
    food_data = json.load(f)

# Count how often each food item is claimed at each location
claim_counts = defaultdict(int)
total_claims = defaultdict(int)

for item in food_data:
    if item.get("claimedBy"):
        key = (item["foodItem"].lower(), item["pickupLocation"].lower())
        claim_counts[key] += 1
        total_claims[item["foodItem"].lower()] += 1

# Predict demand score for new (unclaimed) listings
for item in food_data:
    if not item.get("demandScore"):  # Only set if not already set
        key = (item["foodItem"].lower(), item["pickupLocation"].lower())
        total = total_claims[item["foodItem"].lower()]
        score = (claim_counts[key] / total) * 100 if total > 0 else 0
        item["demandScore"] = round(score, 2)

# Write back updated data
with open(data_path, "w") as f:
    json.dump(food_data, f, indent=2)
