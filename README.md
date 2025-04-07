# AI-Powered Food Waste & Redistribution System

This is a smart, centralized platform that connects food donors (restaurants, grocery stores, households) with NGOs and volunteers to reduce food waste and improve redistribution efficiency. The system uses artificial intelligence to prioritize food pickups, predict demand, and provide automated monthly reports with visual insights.

## Overview

Each day, large quantities of edible food are wasted while many go hungry. This platform aims to solve that problem by allowing food donors to list surplus food and NGOs to claim it based on real-time availability, pickup location, expiry date, and predicted demand.

The platform is divided into two roles: Donors and NGOs. Donors can upload food details, including expiry and location, while NGOs can claim available items, prioritize pickups, and download reports of their activity. The system integrates AI-powered logic to sort, score, and analyze listings, ensuring efficient and timely redistribution.

## Features

### For Donors
- Add food listings with name, quantity, expiry date, and pickup location.
- View your own active and claimed listings.
- Delete your own listings at any time.
- Monthly downloadable reports with charts (quantities, categories, top locations).

### For NGOs
- View all available food listings sorted by expiry date.
- Claim food listings from various donors.
- Demand score is displayed for each listing based on historical trends.
- Expiry-based urgency shown using color codes:
  - Red = High Priority (≤3 days)
  - Orange = Medium Priority (4–5 days)
  - Green = Safe (>5 days)
- Listings are auto-deleted once expired.
- Monthly downloadable reports with quantity analysis, category breakdown, and top pickup locations.

### AI Features
- Logistic Regression model (scikit-learn) predicts demand score for each listing using historical claim data.
- Scores are updated automatically whenever listings are added or claimed.
- Auto-sorting and labeling based on expiry dates.
- Matplotlib + Pandas scripts generate statistical reports and visualizations.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Data Storage:** JSON files (`data/` folder)
- **AI and Reporting:** Python (scikit-learn, Pandas, Matplotlib)

## Installation

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/vineetkumar2244/food-donation-project
cd food-donation-project
```

### 2. Install Node.js Dependencies (Backend + Frontend)
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Open a new terminal tab or window for the frontend:
```bash
cd frontend
npm install
```

### 3. Set Up Python Environment for AI and Reports
Make sure Python 3 is installed on your system. Then install the required Python libraries:

```bash
pip install pandas matplotlib scikit-learn
```

## Running the App

### 1. Start the Backend Server
In the backend directory:
```bash
node server.js
```
This runs the server at `http://localhost:5000`.

### 2. Start the Frontend App
In the frontend directory:
```bash
npm start
```
This opens the React app at `http://localhost:3000`.

### 3. Using the System
* Donors can log in to add or manage listings.
* NGOs can log in to view and claim listings.
* Reports can be downloaded from the dashboard with one click.
* AI scripts are automatically triggered when listings are added or claimed.
