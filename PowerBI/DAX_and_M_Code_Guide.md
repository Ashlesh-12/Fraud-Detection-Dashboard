# FraudShield: Power BI Development Guide

This guide contains the exact **Power Query (M) Code** and **DAX Measures** you need to copy and paste into Power BI to build your dashboard exactly as planned.

---

## 1. Power Query Transformations (Data Cleaning)

When you import `paysim.csv` into Power BI, open **Transform Data** (Power Query Editor). You need to add a few custom columns to create your categories.

### Transaction Status
Go to **Add Column** -> **Conditional Column**:
- **New column name**: `Transaction Status`
- **If** `isFraud` **equals** `1` **Then** `Fraud`
- **Else** `Legitimate`

### Sender Balance Difference
Go to **Add Column** -> **Custom Column**:
- **New column name**: `Sender Balance Difference`
- **Custom column formula**:
  ```powerquery
  [oldbalanceOrg] - [newbalanceOrig]
  ```

### Transaction Amount Category
Go to **Add Column** -> **Conditional Column**:
- **New column name**: `Amount Category`
- **If** `amount` **is greater than or equal to** `1000000` **Then** `Very High`
- **Else If** `amount` **is greater than or equal to** `100000` **Then** `High`
- **Else If** `amount` **is greater than or equal to** `10000` **Then** `Medium`
- **Else** `Low`

### Time Category
*(Assuming 1 step = 1 hour, so steps range from 1 to 744 for 31 days. To get the hour of the day, we use step modulo 24).*
Go to **Add Column** -> **Custom Column**:
- **New column name**: `HourOfDay`
- **Custom column formula**:
  ```powerquery
  Number.Mod([step], 24)
  ```
Then create another **Conditional Column** based on `HourOfDay`:
- **New column name**: `Time Category`
- **If** `HourOfDay` **is greater than or equal to** `18` **Then** `Evening`
- **Else If** `HourOfDay` **is greater than or equal to** `12` **Then** `Afternoon`
- **Else If** `HourOfDay` **is greater than or equal to** `6` **Then** `Morning`
- **Else** `Night`

*Click **Close & Apply** to load the data into the model.*

---

## 2. DAX Measures (Calculations)

In the Power BI Report View, right-click your `Transactions` table and select **New Measure**. Copy and paste these exactly:

### Basic KPIs

**1. Total Transactions**
```dax
Total Transactions = COUNTROWS('Transactions')
```

**2. Total Transaction Amount**
```dax
Total Transaction Amount = SUM('Transactions'[amount])
```

**3. Average Transaction Amount**
```dax
Average Transaction Amount = AVERAGE('Transactions'[amount])
```

### Fraud Specific KPIs

**4. Fraud Transactions**
```dax
Fraud Transactions = 
CALCULATE(
    COUNTROWS('Transactions'),
    'Transactions'[isFraud] = 1
)
```

**5. Legitimate Transactions**
```dax
Legitimate Transactions = 
CALCULATE(
    COUNTROWS('Transactions'),
    'Transactions'[isFraud] = 0
)
```

**6. Fraud Amount**
```dax
Fraud Amount = 
CALCULATE(
    SUM('Transactions'[amount]),
    'Transactions'[isFraud] = 1
)
```

**7. Fraud Rate**
```dax
Fraud Rate = 
DIVIDE(
    [Fraud Transactions],
    [Total Transactions],
    0
)
```

**8. Fraud Percentage of Total Amount**
```dax
Fraud % of Amount = 
DIVIDE(
    [Fraud Amount],
    [Total Transaction Amount],
    0
)
```

---

## 3. The Fraud Risk Matrix (Page 4 Feature)

To create the Risk Matrix visual you mentioned in your plan:
1. Add a **Matrix visual** to your dashboard.
2. Put `type` (Transaction Type) in the **Rows**.
3. Put `Amount Category` in the **Columns**.
4. Put the `Fraud Rate` measure in the **Values**.
5. Apply **Conditional Formatting** -> **Background color** to the `Fraud Rate` value to get the Green, Yellow, Orange, Red (Traffic Light) colors you envisioned based on the percentage!
