import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv('general_ml_prediction_dataset.csv')

X = data.drop(['price','dish'], axis=1)
Y = data['dish']

le_dict = {}
for col in X.columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    le_dict[col] = le

le_dish = LabelEncoder()
Y = le_dish.fit_transform(Y)

model = RandomForestClassifier()
model.fit(X,Y)

joblib.dump(model, 'general_model/general_ml_model.pkl')
joblib.dump(le_dict, 'general_model/label_encoders.pkl')
joblib.dump(le_dish, 'general_model/dish_encoder.pkl')

print("Model & encoders saved")
