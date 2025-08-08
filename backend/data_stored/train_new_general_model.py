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
df = pd.read_csv("new_317_general_ml_dataset.csv")

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
# joblib.dump(model, "general_model/new_general_ml_model.pkl")
# joblib.dump(le_dict, "general_model/new_label_encoders.pkl")
# joblib.dump(dish_encoder, "general_model/new_dish_encoder.pkl")

print("✅ Improved general ML model trained and saved.")

