# 🛡️ FraudShield: Transaction Risk & BI Analytics Platform

### 📊 Business Intelligence College Project
FraudShield is an interactive Business Intelligence analytics and risk-monitoring platform designed to analyze financial transactions and identify patterns associated with fraudulent behavior. 

This project operates on two layers:
1. **Interactive Web App Dashboard**: Built in React + TypeScript + Vite, featuring dynamic slicers, KPI cards, comparative matrices with conditional formatting, and rule-based risk simulation.
2. **Microsoft Power BI Report**: A `.pbix` modeling file with a DAX-calculated data model mapping transaction variables to risk categories.

Both layers analyze the **PaySim Dataset** (synthetic financial transaction dataset modeled after real mobile money operations).

---

## 📁 Project Structure

```text
BI_Project_Fraud-Detection/
│
├── Dataset/
│   └── paysim.csv                     (Raw 493MB transaction dataset; download required)
│
├── FraudShield-Web/                   (Interactive React Dashboard Frontend)
│   ├── src/                           
│   │   ├── pages/                     (Dashboard views: ExecutiveOverview, FraudPattern, etc.)
│   │   ├── App.tsx                    (Main application shell & routing)
│   │   └── index.css                  (Power BI visual styling & tokens)
│   ├── public/data/                   (Aggregated analytical model JSON files)
│   └── package.json                   (React dependencies & npm scripts)
│
├── PowerBI/
│   ├── FraudShield.pbix               (Power BI visual report model file)
│   └── DAX_and_M_Code_Guide.md        (Calculated measures & DAX reference formulas)
│
├── Documentation/
│   └── FraudShield_Report_Template.md (Draft outline for your College Project Report)
│
├── download_dataset.py                (Kaggle API dataset download script)
├── process_data_for_ui.py             (Pandas data-preprocessing/aggregation pipeline)
└── README.md                          (Main project documentation)
```

---

## 🚀 Getting Started

### 1. Download & Prepare the Dataset
1. To pull the dataset, you need a Kaggle account. Obtain your API credentials and ensure your `kaggle.json` is set up on your machine.
2. Run the helper download script to fetch and extract the dataset automatically:
   ```bash
   python download_dataset.py
   ```
   This will download the `ealaxi/paysim1` dataset and place it in `Dataset/paysim.csv`.

### 2. Preprocess & Aggregate the Data
Before running the React web dashboard, compile the raw 6.36 million transaction rows into optimized, aggregated JSON models. Run the preprocessor:
```bash
python process_data_for_ui.py
```
This script runs a Pandas aggregation pipeline that computes:
*   KPI cards data (transaction volume, total transactions, total fraud cases, total fraud value).
*   Case counts and exact financial loss values grouped by transaction type (`fraud_by_type.json`).
*   Fraud occurrence rates by hour of the day (`fraud_by_hour.json`).
*   Risk matrix groupings crossing transaction type and amount category (`risk_matrix.json`).

### 3. Run the React Web Dashboard
Navigate into the web application folder, install the packages, and boot the Vite development server:
```bash
cd FraudShield-Web
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the live dashboard.

---

## 🎨 Web App Feature Overview

The web dashboard is styled to resemble a clean **Microsoft Power BI dashboard** in light mode:
*   **Dynamic Slicer Controls**: Slicers at the top of report pages let you filter by *Transaction Type*, *Fraud Status*, and *Hour Range* in real-time. All KPIs and charts dynamically recalculate in memory.
*   **5 KPI Cards Grid**: Shows Total Transactions, Transaction Value (T/B/M formatting), Fraud Cases, Fraud Transaction Value, and Fraud Rate (%).
*   **Key Insights Block**: Highlighted analytical insights derived directly from PaySim statistics.
*   **Interactive Visuals**: Recharts bar charts contrasting case counts with financial loss value, alongside a 24-hour time trend.
*   **Risk Matrix Table**: Displays risk categories based on type and transaction values. The critical row (`CASH_OUT` / `Very High`) correctly reflects a `81.614%` rate with conditional cell styling.
*   **Risk Simulation**: Allows users to enter custom transaction variables and see risk scoring contributions labeled as *"Project-defined rule weights"*.

---

## ⚖️ Disclaimers & Project Context
*   **Demonstration Layer**: Account Profiles, Auditing Notes, and Alert Drawers are simulated mockups to showcase decision-support tools.
*   **Analytical Thresholds**: Risk assessment classifications (Critical, High, Medium, Low) and rule weights represent project-defined analytical indices and do not constitute absolute banking compliance limits.
