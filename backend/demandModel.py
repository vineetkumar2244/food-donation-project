import pandas as pd
import json
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import math
import sys

# Load food listings
with open("data/foodListings.json", "r") as f:
    listings = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(listings)

# If there's nothing to process, stop
if df.empty:
    sys.exit(0)

# Encode food item and location
le_food = LabelEncoder()
le_loc = LabelEncoder()
df["foodItem_encoded"] = le_food.fit_transform(df["foodItem"])
df["pickupLocation_encoded"] = le_loc.fit_transform(df["pickupLocation"])

# Label data: claimed = 1, unclaimed = 0
df["demandLabel"] = df["claimedBy"].apply(lambda x: 1 if pd.notnull(x) else 0)

# Calculate days until expiry
df["daysUntilExpiry"] = pd.to_datetime(df["expiryDate"]) - pd.to_datetime("today")
df["daysUntilExpiry"] = df["daysUntilExpiry"].dt.days
df["daysUntilExpiry"] = df["daysUntilExpiry"].apply(lambda x: max(0, x) if pd.notnull(x) else 0)

# Features and target
X = df[["foodItem_encoded", "pickupLocation_encoded", "quantity", "daysUntilExpiry"]].astype(float)
y = df["demandLabel"]

# Skip model training if only one class present
if len(set(y)) < 2:
    print("Not enough class diversity to train the model. Skipping update.")
    sys.exit(0)

# Scale numeric features
scaler = StandardScaler()
X[["quantity", "daysUntilExpiry"]] = scaler.fit_transform(X[["quantity", "daysUntilExpiry"]])

# ✅ Stratified split to maintain class balance in train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Evaluate
train_acc = model.score(X_train, y_train) * 100
test_acc = model.score(X_test, y_test) * 100

print(f"\nClass Distribution:")
print(f"  Claimed (1):   {sum(y == 1)}")
print(f"  Unclaimed (0): {sum(y == 0)}")
print(f"\nTraining Accuracy: {train_acc:.2f}%")
print(f"Test Accuracy: {test_acc:.2f}%\n")

# Detailed classification report
y_pred = model.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, y_pred))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Predict demand probability for all
df["demandScore"] = model.predict_proba(X)[:, 1] * 100
df["demandScore"] = df["demandScore"].round(1)

# Drop helper columns
df.drop(columns=["foodItem_encoded", "pickupLocation_encoded", "demandLabel"], inplace=True)

# Replace NaN with None manually
records = df.to_dict(orient="records")
for item in records:
    for key, value in item.items():
        if isinstance(value, float) and math.isnan(value):
            item[key] = None

# Save updated listings
with open("data/foodListings.json", "w") as f:
    json.dump(records, f, indent=2)

print("\nDemand scores updated using enhanced features.")
