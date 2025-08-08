from flask import Blueprint, request, jsonify
import joblib
import numpy as np
from models.user_model import menu_data,restaurant_data
import os

recommend_bp = Blueprint('recommend_bp',__name__)

model = joblib.load('data_stored/general_model/general_ml_model.pkl')
le_dict = joblib.load('data_stored/general_model/label_encoders.pkl')
dish_encoder = joblib.load('data_stored/general_model/dish_encoder.pkl')

@recommend_bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.json

    input_data = [
        data['mood'],
        data['dayStatus'],
        data['craving'],
        data['diet'],
        data['cuisines'][0],
        data['timeNeed'],
    ]

    for i,key in enumerate(le_dict.keys()):
        input_data[i] = le_dict[key].transform([input_data[i]])[0]

    prediction = model.predict([input_data])
    confidence = float(model.predict_proba([input_data]).max()) * 100
    dish_name = dish_encoder.inverse_transform(prediction)[0]

    matched_restaurants = menu_data.find({"Menu Item" : dish_name})
    matched_restaurants_name = list({r["Restaurant"] for r in matched_restaurants})

    all_restaurants = restaurant_data.find({"Name": {"$in": matched_restaurants_name}})
    sorted_all_restaurants = sorted(all_restaurants, key=lambda r: float(r.get("Rating & Time","0").split(" ")[0]) if r.get("Rating & Time") else 0,reverse=True)

    top_matches = []

    for res in sorted_all_restaurants[:5]:
        top_matches.append({
            "restaurantName": res.get("Name","N/A"),
            "location": res.get("Location", "N/A"),
            "ratingTime": res.get("Rating & Time","N/A"),
            "category": res.get("Category", "N/A"),
            "image": res.get("Image URL", "N/A"),
            "offer": res.get("Offer", "N/A"),
            "link": res.get("Link", "N/A")
        })

    # Personal ML Model
    email = data.get('email', None)
    user_id = email.replace('@','_at_').replace('.','_') if email else None
    model_dir = f"data_stored/personal_models/{user_id}" if user_id else None

    personal_dish = None
    if model_dir and os.path.exists(f"{model_dir}/model.pkl"):
        try:
            personal_model = joblib.load(f"{model_dir}/model.pkl")
            personal_encoders = joblib.load(f"{model_dir}/encoders.pkl")
            personal_target_encoder = joblib.load(f"{model_dir}/target_encoder.pkl")

            personal_prediction = personal_model.predict([input_data])
            personal_dish = personal_target_encoder.inverse_transform(personal_prediction)[0]
        except Exception as e:
            print("Error in personal model prediction:", str(e))

    return jsonify({
        'dish': dish_name,
        'confidence': confidence,
        'recommendation': top_matches,
        'personalDish': personal_dish,
        # 'category': data['cuisines'][0],
        # 'description': 'Based on your mood and preference',
        # 'calories': 500,
        # 'timetoCook': data['timeNeed']
    })