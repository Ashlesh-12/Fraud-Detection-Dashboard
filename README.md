# 🛡️ FraudShield

## Financial Transaction & Fraud Intelligence Dashboard
### Business Intelligence College Project

FraudShield is an interactive Business Intelligence dashboard designed to analyze financial transactions and identify patterns associated with fraudulent activity.

This project uses **Microsoft Power BI**, the **PaySim Dataset**, and **DAX** to provide business insights for financial risk-monitoring decisions.

## Project Structure

```text
FraudShield/
│
├── Dataset/
│   └── paysim.csv (Download required)
│
├── PowerBI/
│   └── FraudShield.pbix (Your Power BI file goes here)
│
├── Documentation/
│   └── FraudShield_Report_Template.md (Draft for your College Report)
│
├── Screenshots/
│   ├── ExecutiveOverview.png (Save your screenshots here)
│   ├── FraudPattern.png
│   ├── AccountAnalysis.png
│   └── Investigation.png
│
└── Presentation/
    └── FraudShield_Presentation_Outline.md (Draft for your PPT)
```

## Getting Started

1. **Dataset**: 
   - Download the PaySim dataset from Kaggle (`ealaxi/paysim1`).
   - You can use the provided `download_dataset.py` script to download it automatically if you have your Kaggle API configured.
   - Place the dataset inside the `Dataset/` folder and name it `paysim.csv`.
2. **Power BI Development**: 
   - Open Power BI Desktop, import `Dataset/paysim.csv` and use Power Query to clean data.
   - Build your Data Model and create the DAX measures outlined in your plan.
   - Develop the 4 Dashboard pages: Executive Overview, Fraud Pattern Intelligence, Customer & Account Analysis, and Fraud Investigation & Risk Intelligence.
   - Save your work in `PowerBI/FraudShield.pbix`.
3. **Documentation**:
   - Use the Markdown templates provided in `Documentation/` and `Presentation/` to draft your final college report and PowerPoint slides.

## Core Technologies
- **Data Cleaning & Transformation**: Power Query
- **Data Modeling**: Power BI
- **Calculations**: DAX
- **Visualization**: Microsoft Power BI
