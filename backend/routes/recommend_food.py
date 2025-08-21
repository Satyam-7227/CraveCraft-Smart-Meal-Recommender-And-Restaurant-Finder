from flask import Blueprint, request, jsonify
import joblib
import numpy as np
from models.user_model import menu_data,restaurant_data
import os
import re

recommend_bp = Blueprint('recommend_bp',__name__)

# Load the improved category-based model
model = joblib.load('data_stored/category_general_model.pkl')
le_dict = joblib.load('data_stored/category_label_encoders.pkl')
category_encoder = joblib.load('data_stored/category_encoder.pkl')

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

    # Encode input data for the model
    encoded_input = []
    for i, key in enumerate(le_dict.keys()):
        try:
            encoded_input.append(le_dict[key].transform([input_data[i]])[0])
        except ValueError:
            # Handle unseen categories
            encoded_input.append(0)

    # Get category prediction from improved model
    prediction = model.predict([encoded_input])
    confidence = float(model.predict_proba([encoded_input]).max()) * 100
    predicted_category = category_encoder.inverse_transform(prediction)[0]

    # Search for restaurants with dishes matching the predicted category
    # Use regex to find dishes containing the category name (case-insensitive)
    matched_dishes = menu_data.find({"Menu Item": {"$regex": predicted_category, "$options": "i"}})
    
    # Get unique restaurant names to prevent duplicates
    matched_restaurants_name = list({r["Restaurant"] for r in matched_dishes})

    # Get restaurant details from restaurant_data
    all_restaurants = restaurant_data.find({"Name": {"$in": matched_restaurants_name}})
    sorted_all_restaurants = sorted(all_restaurants, key=lambda r: float(r.get("Rating & Time","0").split(" ")[0]) if r.get("Rating & Time") else 0,reverse=True)

    top_matches = []

    # Limit to 10 restaurants (increased from 5 as requested)
    for res in sorted_all_restaurants[:10]:
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
            # input_data.append(data['timeNeed'])
            personal_model = joblib.load(f"{model_dir}/model.pkl")
            personal_encoders = joblib.load(f"{model_dir}/encoders.pkl")
            personal_target_encoder = joblib.load(f"{model_dir}/target_encoder.pkl")

            personal_prediction = personal_model.predict([encoded_input])
            personal_dish = personal_target_encoder.inverse_transform(personal_prediction)[0]
            print("predicted dish",personal_dish)
        except Exception as e:
            print("Error in personal model prediction:", str(e))

    return jsonify({
        'dish': predicted_category,  # Now returns the predicted category instead of specific dish
        'confidence': confidence,
        'recommendation': top_matches,
        'personalDish': personal_dish,
        'predictedCategory': predicted_category,  # Additional field for clarity
        # 'category': data['cuisines'][0],
        # 'description': 'Based on your mood and preference',
        # 'calories': 500,
        # 'timetoCook': data['timeNeed']
    })


@recommend_bp.route('/restaurant/details', methods=['GET'])
def restaurant_details():
    """Return a restaurant's details and its full menu by name."""
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Missing required query param 'name'"}), 400

    try:
        res = restaurant_data.find_one({"Name": name})
        if not res:
            return jsonify({"error": "Restaurant not found"}), 404

        restaurant_info = {
            "restaurantName": res.get("Name", "N/A"),
            "location": res.get("Location", "N/A"),
            "ratingTime": res.get("Rating & Time", "N/A"),
            "category": res.get("Category", "N/A"),
            "image": res.get("Image URL", "N/A"),
            "offer": res.get("Offer", "N/A"),
            "link": res.get("Link", "N/A"),
        }

        # Fetch menu items for the restaurant (case-insensitive match by name)
        escaped = re.escape(name)
        menu_cursor = menu_data.find(
            {"Restaurant": {"$regex": f"^{escaped}$", "$options": "i"}},
            {"_id": 0, "Menu Item": 1, "Price": 1, "Description": 1, "Image URL": 1}
        )
        menu_items = [{
            "name": item.get("Menu Item", ""),
            "price": item.get("Price"),
            "description": (item.get("Description") if str(item.get("Description")).lower() != 'nan' else ""),
            "imageUrl": item.get("Image URL")
        } for item in menu_cursor]

        # Fallback: loose contains match if strict match returned nothing
        if not menu_items:
            menu_cursor = menu_data.find(
                {"Restaurant": {"$regex": escaped, "$options": "i"}},
                {"_id": 0, "Menu Item": 1, "Price": 1, "Description": 1, "Image URL": 1}
            )
            menu_items = [{
                "name": item.get("Menu Item", ""),
                "price": item.get("Price"),
                "description": (item.get("Description") if str(item.get("Description")).lower() != 'nan' else ""),
                "imageUrl": item.get("Image URL")
            } for item in menu_cursor]

        return jsonify({
            "restaurant": restaurant_info,
            "menu": menu_items
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500