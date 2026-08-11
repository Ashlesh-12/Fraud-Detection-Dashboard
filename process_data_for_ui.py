import pandas as pd
import json
import os

def process_data():
    dataset_path = 'Dataset/paysim.csv'
    output_dir = 'FraudShield-Web/public/data'
    
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found.")
        return
        
    os.makedirs(output_dir, exist_ok=True)
    
    print("Loading PaySim dataset for UI Pre-processing...")
    df = pd.read_csv(dataset_path)
    
    print("Generating KPIs...")
    total_transactions = len(df)
    total_amount = float(df['amount'].sum())
    fraud_transactions = len(df[df['isFraud'] == 1])
    fraud_amount = float(df[df['isFraud'] == 1]['amount'].sum())
    fraud_rate = (fraud_transactions / total_transactions) * 100
    avg_amount = float(df['amount'].mean())
    
    kpis = {
        "totalTransactions": total_transactions,
        "totalAmount": total_amount,
        "fraudTransactions": fraud_transactions,
        "fraudAmount": fraud_amount,
        "fraudRate": fraud_rate,
        "avgAmount": avg_amount
    }
    with open(os.path.join(output_dir, 'kpis.json'), 'w') as f:
        json.dump(kpis, f)

    print("Generating Fraud By Type...")
    fraud_by_type = df[df['isFraud'] == 1].groupby('type').size().reset_index(name='fraudCount')
    total_by_type = df.groupby('type').size().reset_index(name='totalCount')
    merged_type = pd.merge(total_by_type, fraud_by_type, on='type', how='left').fillna(0)
    merged_type['fraudRate'] = (merged_type['fraudCount'] / merged_type['totalCount']) * 100
    merged_type = merged_type.sort_values(by='fraudRate', ascending=False)
    # Convert to list of dicts
    type_data = merged_type.to_dict(orient='records')
    with open(os.path.join(output_dir, 'fraud_by_type.json'), 'w') as f:
        json.dump(type_data, f)
        
    print("Generating Fraud By Hour...")
    df['hour'] = df['step'] % 24
    fraud_by_hour = df[df['isFraud'] == 1].groupby('hour').size().reset_index(name='fraudCount')
    total_by_hour = df.groupby('hour').size().reset_index(name='totalCount')
    merged_hour = pd.merge(total_by_hour, fraud_by_hour, on='hour', how='left').fillna(0)
    hour_data = merged_hour.to_dict(orient='records')
    with open(os.path.join(output_dir, 'fraud_by_hour.json'), 'w') as f:
        json.dump(hour_data, f)

    print("Generating Risk Matrix Data...")
    # Amount Categories
    def get_amount_category(amt):
        if amt >= 1000000: return 'Very High'
        if amt >= 100000: return 'High'
        if amt >= 10000: return 'Medium'
        return 'Low'
    
    df['amountCategory'] = df['amount'].apply(get_amount_category)
    
    # Calculate fraud rate for each combination
    risk_data = []
    types = df['type'].unique()
    categories = ['Low', 'Medium', 'High', 'Very High']
    
    for t in types:
        for c in categories:
            subset = df[(df['type'] == t) & (df['amountCategory'] == c)]
            total = len(subset)
            fraud = len(subset[subset['isFraud'] == 1])
            rate = (fraud / total) * 100 if total > 0 else 0
            
            # Risk Level
            level = "Low Risk"
            if rate > 0.5: level = "Critical"
            elif rate > 0.1: level = "High Risk"
            elif rate > 0: level = "Medium Risk"
            
            risk_data.append({
                "type": t,
                "amountCategory": c,
                "totalTransactions": total,
                "fraudCases": fraud,
                "fraudRate": rate,
                "riskLevel": level
            })
            
    with open(os.path.join(output_dir, 'risk_matrix.json'), 'w') as f:
        json.dump(risk_data, f)
        
    print("UI Data generated successfully!")

if __name__ == "__main__":
    process_data()
