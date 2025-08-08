# from flask import Blueprint, request, jsonify
from models.user_model import feedback_data
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import pandas as pd

# personal_model_bp = Blueprint('personal_model_bp', __name__)

# @personal_model_bp.route('/train-personal-model', methods=['POST'])
def train_personal_model(email):
    feedbacks = list(feedback_data.find({'email': email}))
    if len(feedbacks) < 2:
        return "Not enough data to train"
    
    df = pd.DataFrame(feedbacks)
    df['cuisines'] = df['cuisines'].apply(lambda x: x[0] if isinstance(x,list) and x else 'Unknown')

    X = df[['mood', 'dayStatus', 'craving', 'diet', 'timeNeed', 'cuisines']]
    Y = df['selectedDish']

    encoders = {}
    for col in X.columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le

    target_encoder = LabelEncoder()
    Y = target_encoder.fit_transform(Y)

    model = RandomForestClassifier()
    model.fit(X,Y)

    user_id = email.replace('@','_at_').replace('.','_')
    model_dir = f"data_stored/personal_models/{user_id}"
    os.makedirs(model_dir, exist_ok=True)

    joblib.dump(model, f"{model_dir}/model.pkl")
    joblib.dump(encoders, f"{model_dir}/encoders.pkl")
    joblib.dump(target_encoder, f"{model_dir}/target_encoder.pkl")

    return "Model trained"