import pandas as pd
import json
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import math

# Load food listings
with open("data/foodListings.json", "r") as f:
    listings = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(listings)

# If there's nothing to process, stop
if df.empty:
    exit()

# Encode food item and location
le_food = LabelEncoder()
le_loc = LabelEncoder()
df["foodItem_encoded"] = le_food.fit_transform(df["foodItem"])
df["pickupLocation_encoded"] = le_loc.fit_transform(df["pickupLocation"])

# Label data: claimed = 1, unclaimed = 0
df["demandLabel"] = df["claimedBy"].apply(lambda x: 1 if pd.notnull(x) else 0)

# Training data
X = df[["foodItem_encoded", "pickupLocation_encoded"]]
y = df["demandLabel"]

# Train model
model = LogisticRegression()
model.fit(X, y)

# Predict demand probability (i.e., demand score)
df["demandScore"] = model.predict_proba(X)[:, 1] * 100
df["demandScore"] = df["demandScore"].round(1)

# Drop helper columns
df.drop(columns=["foodItem_encoded", "pickupLocation_encoded", "demandLabel"], inplace=True)

# Convert to list of dictionaries
records = df.to_dict(orient="records")

# Replace NaN with None manually
for item in records:
    for key, value in item.items():
        if isinstance(value, float) and math.isnan(value):
            item[key] = None

# Save to JSON
with open("data/foodListings.json", "w") as f:
    json.dump(records, f, indent=2)

print("Demand scores updated and NaN values fixed.")

