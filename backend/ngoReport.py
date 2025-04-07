import json
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from datetime import datetime, timedelta
import os
import sys

# Get NGO ID from command-line argument
if len(sys.argv) != 2:
    print("Usage: python ngoReport.py <ngo_id>")
    sys.exit()

ngo_id = str(sys.argv[1])

# Ensure reports directory exists
os.makedirs('./reports', exist_ok=True)

# Load food listings data
with open('./data/foodListings.json', 'r') as file:
    listings = json.load(file)

# Filter claimed listings for the given NGO ID
claimed = [
    item for item in listings
    if str(item.get("claimedBy")) == ngo_id
]

if not claimed:
    print("No claimed data found.")
    sys.exit()

# Convert to DataFrame
df = pd.DataFrame(claimed)

# Use expiryDate instead of claimedDate (as claimedDate is missing)
df["expiryDate"] = pd.to_datetime(df["expiryDate"], errors="coerce")
df.dropna(subset=["expiryDate"], inplace=True)
df["month"] = df["expiryDate"].dt.strftime("%B %Y")  # Use expiry date for grouping

# Get current and last 5 months
today = datetime.today()
month_labels = []
monthly_totals = []

for i in range(5, -1, -1):
    month = (today - timedelta(days=30 * i)).strftime('%B %Y')
    month_labels.append(month)
    monthly_totals.append(0)

# Ensure quantity is numeric
df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0)

# Compute total quantity per month
for i, month in enumerate(month_labels):
    total = df[df["month"] == month]["quantity"].sum()
    monthly_totals[i] = total

# Pie Chart - Category Breakdown
category_counts = df["foodItem"].str.strip().value_counts()

# Bar Chart - Top Pickup Locations
location_counts = df["pickupLocation"].str.strip().value_counts().head(5)

# Save charts to PDF in reports folder with NGO-specific filename
# Save charts to PDF in reports folder with NGO-specific filename
report_path = f"reports/{ngo_id}_report.pdf"
with PdfPages(report_path) as pdf:
    # Summary Page
    total_listings = len(df)
    total_quantity = df["quantity"].sum()
    most_common_item = category_counts.idxmax() if not category_counts.empty else "N/A"
    most_common_location = location_counts.idxmax() if not location_counts.empty else "N/A"
    active_months = df["month"].nunique()

    summary_text = f"""
    NGO Report Summary - {ngo_id}

    Total Listings Claimed: {total_listings}
    Total Quantity Claimed: {total_quantity}
    Most Common Food Item: {most_common_item}
    Most Frequent Pickup Location: {most_common_location}
    Active Claim Months: {active_months}
    """

    plt.figure(figsize=(8.5, 11))
    plt.axis('off')
    plt.text(0.1, 0.9, summary_text, fontsize=12, va='top', wrap=True)
    pdf.savefig()
    plt.close()

    # 📊 Monthly Quantity Chart
    plt.figure(figsize=(10, 6))
    plt.bar(month_labels, monthly_totals, color="skyblue")
    plt.title("Total Food Claimed per Month (by Expiry Date)")
    plt.xlabel("Month")
    plt.ylabel("Quantity")
    plt.xticks(rotation=30)
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # 🥧 Category Pie Chart
    plt.figure(figsize=(8, 6))
    plt.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', startangle=140)
    plt.title("Claimed Food Category Breakdown")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # 📍 Top Pickup Locations
    plt.figure(figsize=(10, 6))
    plt.bar(location_counts.index, location_counts.values, color='orange')
    plt.title("Top 5 Pickup Locations")
    plt.xlabel("Location")
    plt.ylabel("Listings Claimed")
    plt.xticks(rotation=30)
    plt.tight_layout()
    pdf.savefig()
    plt.close()
