import sys
import json
import os
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
from matplotlib.backends.backend_pdf import PdfPages

# Read donor ID from command line
donor_id = sys.argv[1]

# Load food listings
with open("data/foodListings.json", "r") as f:
    listings = json.load(f)

# Filter listings by donor
donor_listings = [item for item in listings if str(item["donorId"]) == str(donor_id)]

if not donor_listings:
    print("no_data_found")
    sys.exit()

# Create DataFrame
df = pd.DataFrame(donor_listings)

# Fix: Convert quantity to numeric
df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0)

# Convert expiryDate to datetime
df["expiryDate"] = pd.to_datetime(df["expiryDate"], errors="coerce")
df = df.dropna(subset=["expiryDate"])  # Drop rows with invalid/missing dates
df["month"] = df["expiryDate"].dt.to_period("M").astype(str)

# Prepare output folder
os.makedirs("reports", exist_ok=True)

# 1. Monthly Total Donations (Last 6 Months including current)
current_month = datetime.now().strftime("%Y-%m")
last_5_months = pd.date_range(end=datetime.now(), periods=5, freq="M").strftime("%Y-%m").tolist()
last_6_months = last_5_months + [current_month]
monthly_data = df[df["month"].isin(last_6_months)].groupby("month")["quantity"].sum().reindex(last_6_months, fill_value=0)

# 2. Category-wise Breakdown
category_data = df["foodItem"].value_counts()

# 3. Top Locations Donated To
location_data = df["pickupLocation"].value_counts().nlargest(5)

# 4. Claimed vs Unclaimed Stats
claimed_df = df[df["claimedBy"].notna()]
unclaimed_df = df[df["claimedBy"].isna()]
claimed_count = len(claimed_df)
unclaimed_count = len(unclaimed_df)
claimed_quantity = int(claimed_df["quantity"].sum())
unclaimed_quantity = int(unclaimed_df["quantity"].sum())

# 5. Summary Calculations
total_donations = int(df["quantity"].sum())
total_items = len(df)
unique_categories = df["foodItem"].nunique()
unique_locations = df["pickupLocation"].nunique()

summary_text = f"""
Donor ID: {donor_id}
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

--- Summary Report ---

Total Food Items Donated: {total_items}
Total Quantity Donated: {total_donations}
Unique Food Categories: {unique_categories}
Unique Pickup Locations: {unique_locations}

--- Claimed vs Unclaimed ---

Claimed Items: {claimed_count}
Claimed Quantity: {claimed_quantity}

Unclaimed Items: {unclaimed_count}
Unclaimed Quantity: {unclaimed_quantity}

--- Active Months Covered ---
{', '.join(last_6_months)}
"""

# Save all content into a single PDF
final_pdf_path = f"reports/{donor_id}_report.pdf"

with PdfPages(final_pdf_path) as pdf:
    # Page 1: Summary Text
    plt.figure(figsize=(8.5, 6))
    plt.axis("off")
    plt.text(0.01, 0.98, summary_text, fontsize=12, va='top', family="monospace")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # Page 2: Monthly Donations
    plt.figure(figsize=(8, 4))
    monthly_data.plot(kind="bar", color="skyblue")
    plt.title("Total Food Donated (Including Current Month)")
    plt.xlabel("Month")
    plt.ylabel("Quantity")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # Page 3: Category-wise Pie Chart
    plt.figure(figsize=(5, 5))
    category_data.plot(kind="pie", autopct="%1.1f%%")
    plt.title("Category-wise Food Donations")
    plt.ylabel("")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # Page 4: Top Pickup Locations
    plt.figure(figsize=(8, 4))
    location_data.plot(kind="bar", color="orange")
    plt.title("Top Pickup Locations")
    plt.xlabel("Location")
    plt.ylabel("Donations")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # Page 5: Claimed vs Unclaimed Pie Chart
    plt.figure(figsize=(5, 5))
    status_data = pd.Series({
        "Claimed": claimed_quantity,
        "Unclaimed": unclaimed_quantity
    })
    status_data.plot(kind="pie", autopct="%1.1f%%", colors=["green", "red"])
    plt.title("Claimed vs Unclaimed Food (by Quantity)")
    plt.ylabel("")
    plt.tight_layout()
    pdf.savefig()
    plt.close()

# Output path to Node.js
print(final_pdf_path)
