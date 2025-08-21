# Make Json to CSV Data (till - 317)

# import json
# import pandas as pd

# with open("dish_conditions_317_rows.json", "r", encoding="utf-8") as f:
#     data = json.load(f)

# # Convert to DataFrame
# df = pd.DataFrame(data)

# # Save to CSV for training
# df.to_csv("new_317_general_ml_dataset.csv", index=False)

# print("Dataset created.")


# New Code for General_ML

import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load data
df = pd.read_csv("general_model_train_data/combined_output_2500.csv")

# Features and label
X = df.drop("dish", axis=1)
y = df["dish"]

# Encode
le_dict = {}
for col in X.columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    le_dict[col] = le

dish_encoder = LabelEncoder()
y_encoded = dish_encoder.fit_transform(y)

# Split for evaluation
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy on test set: {accuracy * 100:.2f}%")

# Save model and encoders
joblib.dump(model, "general_model/general_ml_model.pkl")
joblib.dump(le_dict, "general_model/label_encoders.pkl")
joblib.dump(dish_encoder, "general_model/dish_encoder.pkl")

print("✅ Improved general ML model trained and saved.")



# Combine all the data into one CSV file
# import json
# import csv

# # 👇 Add your JSON file names in the desired order
# file_order = [
#     'general_model_train_data/dishes_1_500_data.json',
#     'general_model_train_data/dishes_501_1000_data.json',
#     'general_model_train_data/dishes_1001_1500_data.json',
#     'general_model_train_data/dishes_1501_2000_data.json',
#     'general_model_train_data/dishes_2001_2100_data.json',
#     'general_model_train_data/dishes_2101_2500_data.json'
# ]

# combined_data = []

# # Load and combine the data in order
# for file_name in file_order:
#     with open(file_name, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#         combined_data.extend(data)

# # Get headers from first item
# if combined_data:
#     headers = combined_data[0].keys()
# else:
#     headers = []

# # Save to CSV
# with open('general_model_train_data/combined_output_2500.csv', 'w', newline='', encoding='utf-8') as f:
#     writer = csv.DictWriter(f, fieldnames=headers)
#     writer.writeheader()
#     writer.writerows(combined_data)

# print("✅ Combined CSV created successfully!")
