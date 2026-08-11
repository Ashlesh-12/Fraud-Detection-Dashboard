import pandas as pd
import os

def generate_insights():
    dataset_path = 'Dataset/paysim.csv'
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found. Please download the dataset first.")
        return

    print("Loading PaySim dataset (this might take a minute due to its size)...")
    df = pd.read_csv(dataset_path)

    # Basic KPIs
    total_transactions = len(df)
    total_amount = df['amount'].sum()
    fraud_transactions = len(df[df['isFraud'] == 1])
    fraud_amount = df[df['isFraud'] == 1]['amount'].sum()
    fraud_rate = (fraud_transactions / total_transactions) * 100
    avg_amount = df['amount'].mean()

    print("\n" + "="*50)
    print("📈 FRAUDSHIELD - BASIC KPIs")
    print("="*50)
    print(f"Total Transactions: {total_transactions:,}")
    print(f"Total Transaction Amount: ${total_amount:,.2f}")
    print(f"Fraud Transactions: {fraud_transactions:,}")
    print(f"Fraud Amount: ${fraud_amount:,.2f}")
    print(f"Fraud Rate: {fraud_rate:.4f}%")
    print(f"Average Transaction Amount: ${avg_amount:,.2f}")

    # Insight 1: Which transaction types have most fraud?
    print("\n" + "="*50)
    print("🚨 INSIGHT 1: Fraud by Transaction Type")
    print("="*50)
    fraud_by_type = df[df['isFraud'] == 1].groupby('type').size().reset_index(name='Fraud Count')
    fraud_by_type = fraud_by_type.sort_values(by='Fraud Count', ascending=False)
    for index, row in fraud_by_type.iterrows():
        print(f"Type: {row['type']} -> Fraud Cases: {row['Fraud Count']:,}")

    # Insight 2: Which transaction types have highest fraud rate?
    print("\n" + "="*50)
    print("⚠️ INSIGHT 2: Fraud Rate by Transaction Type")
    print("="*50)
    total_by_type = df.groupby('type').size().reset_index(name='Total Count')
    merged_type = pd.merge(total_by_type, fraud_by_type, on='type', how='left').fillna(0)
    merged_type['Fraud Rate (%)'] = (merged_type['Fraud Count'] / merged_type['Total Count']) * 100
    merged_type = merged_type.sort_values(by='Fraud Rate (%)', ascending=False)
    for index, row in merged_type.iterrows():
        print(f"Type: {row['type']} -> Fraud Rate: {row['Fraud Rate (%)']:.4f}%")

    # Insight 3: High Value transactions
    print("\n" + "="*50)
    print("💰 INSIGHT 3: High Value Transaction Risk")
    print("="*50)
    high_value_df = df[df['amount'] >= 100000]
    high_val_total = len(high_value_df)
    high_val_fraud = len(high_value_df[high_value_df['isFraud'] == 1])
    if high_val_total > 0:
        high_val_rate = (high_val_fraud / high_val_total) * 100
        print(f"Transactions >= $100k Total: {high_val_total:,}")
        print(f"Transactions >= $100k Fraud: {high_val_fraud:,}")
        print(f"High-Value Fraud Rate: {high_val_rate:.4f}% (Compare to overall {fraud_rate:.4f}%)")

    # Insight 4: Peak Fraud Hours
    print("\n" + "="*50)
    print("⏰ INSIGHT 4: Peak Fraud Hours (Top 5)")
    print("="*50)
    df['hour'] = df['step'] % 24
    fraud_by_hour = df[df['isFraud'] == 1].groupby('hour').size().reset_index(name='Fraud Count')
    fraud_by_hour = fraud_by_hour.sort_values(by='Fraud Count', ascending=False).head(5)
    for index, row in fraud_by_hour.iterrows():
        print(f"Hour {row['hour']}:00 -> Fraud Cases: {row['Fraud Count']:,}")

    print("\n" + "="*50)
    print("✅ Use these actual dataset findings to fill out your College Report!")
    print("="*50)

if __name__ == "__main__":
    generate_insights()
