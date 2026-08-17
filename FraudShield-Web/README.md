# 🛡️ FraudShield Web Dashboard

### 🖥️ React + TypeScript + Vite Dashboard Frontend

This directory contains the interactive Business Intelligence dashboard frontend for the **FraudShield** project. It is designed using Microsoft Power BI design guidelines (light theme tokens, clean grids, analytical graphs, and responsive slicers).

---

## 🚀 How to Run Locally

### 1. Pre-requisites
Ensure you have ran the Pandas aggregation script at the root to compile raw data into optimized JSON schemas:
```bash
python process_data_for_ui.py
```
This updates the models inside `public/data/`.

### 2. Start the Development Server
Navigate to this folder, install the node modules, and boot the Vite server:
```bash
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
To bundle the frontend application assets for deployment:
```bash
npm run build
```
This builds static compiled HTML, CSS, and JS assets into the `dist/` directory.

---

## 🎨 Page Layouts & Components

*   **Executive Overview** (`src/pages/ExecutiveOverview.tsx`): Main dashboard tab containing dynamic slicer selects, a 5-KPI header, key callout insights, Recharts transaction graphs, and simulated investigation drawers.
*   **Fraud Patterns** (`src/pages/FraudPattern.tsx`): Focuses on transaction types comparison. Features interactive charts for cases, rates, values, and a comparative matrix table with conditional formatting.
*   **Account Analysis** (`src/pages/AccountAnalysis.tsx`): Demonstrates simulated audit logs and pagination controls for reviewing illustrative high-risk account profiles.
*   **Risk Matrix** (`src/pages/RiskMatrix.tsx`): Maps type + value combinations to academic risk ratings. Includes styling tags that highlight high-risk cells (e.g. CASH_OUT / Very High).
*   **Risk Simulation** (`src/pages/Sandbox.tsx`): Sandbox simulator calculating rule-based risk percentages based on project weights.
*   **Visual Styling** (`src/index.css`): Houses Light/Dark theme configuration variables, Power BI visual theme tokens, custom table styles, and page layouts.
