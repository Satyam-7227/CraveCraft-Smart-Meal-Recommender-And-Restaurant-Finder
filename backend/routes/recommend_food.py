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
    personal_dishes = []  # For multiple dish predictions
    if model_dir and os.path.exists(f"{model_dir}/model.pkl"):
        try:
            personal_model = joblib.load(f"{model_dir}/model.pkl")
            personal_encoders = joblib.load(f"{model_dir}/encoders.pkl")
            personal_target_encoder = joblib.load(f"{model_dir}/target_encoder.pkl")

            # Create input data in the EXACT same order as training
            personal_input_data = [
                data['mood'],
                data['dayStatus'], 
                data['craving'],
                data['diet'],
                data['timeNeed'],
                data['cuisines'][0] if isinstance(data['cuisines'], list) else data['cuisines']
            ]
            
            print(f"Personal model input data: {personal_input_data}")
            
            # Encode input data using personal model encoders
            personal_encoded_input = []
            for i, col in enumerate(['mood', 'dayStatus', 'craving', 'diet', 'timeNeed', 'cuisines']):
                try:
                    encoded_value = personal_encoders[col].transform([personal_input_data[i]])[0]
                    personal_encoded_input.append(encoded_value)
                    print(f"Encoded {col}: {personal_input_data[i]} -> {encoded_value}")
                except (ValueError, KeyError) as e:
                    # Handle unseen categories by using the first known category
                    personal_encoded_input.append(0)
                    print(f"Error encoding {col}: {e}, using default value 0")
            
            print(f"Personal model encoded input: {personal_encoded_input}")

            # Get prediction probabilities for top dishes
            prediction_probs = personal_model.predict_proba([personal_encoded_input])[0]
            
            # Get top 3 dish predictions with confidence > 10%
            top_indices = prediction_probs.argsort()[-3:][::-1]
            top_dishes = []
            
            for idx in top_indices:
                dish_name = personal_target_encoder.inverse_transform([idx])[0]
                confidence = prediction_probs[idx] * 100
                if confidence > 10:  # Only include dishes with >10% confidence
                    top_dishes.append({
                        'dish': dish_name,
                        'confidence': confidence
                    })
            
            if top_dishes:
                personal_dish = top_dishes[0]['dish']  # Primary prediction
                personal_dishes = top_dishes  # All top predictions
                print(f"Personal model predicted: {personal_dish} (confidence: {top_dishes[0]['confidence']:.1f}%)")
                if len(top_dishes) > 1:
                    print(f"Other predictions: {[d['dish'] for d in top_dishes[1:]]}")
                    
        except Exception as e:
            print("Error in personal model prediction:", str(e))
            personal_dish = None
            personal_dishes = []

    # Create separate restaurant lists for each model type
    general_restaurants = top_matches  # Keep the original general category restaurants
    personal_restaurants = []
    
    if personal_dish:
        # Personal ML Model: Filter restaurants by predicted dish or similar dishes
        print(f"Filtering restaurants for personal dish: {personal_dish}")
        
        try:
            # Search for restaurants with the exact predicted dish
            exact_matched_dishes = menu_data.find({"Menu Item": {"$regex": re.escape(personal_dish), "$options": "i"}})
            exact_restaurants = list({r["Restaurant"] for r in exact_matched_dishes})
            print(f"Found {len(exact_restaurants)} restaurants with exact dish match")
            
            # Search for restaurants with similar dishes (using keywords from predicted dish)
            # Extract key words from dish name (remove common words like "Coffee", "Pack", etc.)
            dish_keywords = personal_dish.lower().split()
            # Filter out common words
            common_words = ['coffee', 'pack', 'ml', 'box', 'bite', 'sized', 'donuts', 'premium', 'bestseller', 'grams', '250', '500']
            keywords = [word for word in dish_keywords if word not in common_words and len(word) > 2]
            print(f"Extracted keywords for similar search: {keywords}")
            
            similar_restaurants = []
            if keywords:
                # Search for restaurants with similar keywords
                for keyword in keywords:
                    try:
                        # Escape special regex characters in the keyword
                        escaped_keyword = re.escape(keyword)
                        similar_dishes = menu_data.find({"Menu Item": {"$regex": escaped_keyword, "$options": "i"}})
                        keyword_restaurants = [r["Restaurant"] for r in similar_dishes]
                        similar_restaurants.extend(keyword_restaurants)
                        print(f"Keyword '{keyword}' found {len(keyword_restaurants)} restaurants")
                    except Exception as e:
                        print(f"Error searching for keyword '{keyword}': {e}")
                        continue
            
            # Combine and get unique restaurants
            all_personal_restaurants = list(set(exact_restaurants + similar_restaurants))
            print(f"Total unique restaurants found: {len(all_personal_restaurants)}")
            
            if all_personal_restaurants:
                # Get restaurant details for personal recommendations
                personal_restaurant_data = restaurant_data.find({"Name": {"$in": all_personal_restaurants}})
                sorted_personal_restaurants = sorted(personal_restaurant_data, key=lambda r: float(r.get("Rating & Time","0").split(" ")[0]) if r.get("Rating & Time") else 0, reverse=True)
                
                # Create personal restaurant list
                for res in sorted_personal_restaurants[:10]:
                    personal_restaurants.append({
                        "restaurantName": res.get("Name","N/A"),
                        "location": res.get("Location", "N/A"),
                        "ratingTime": res.get("Rating & Time","N/A"),
                        "category": res.get("Category", "N/A"),
                        "image": res.get("Image URL", "N/A"),
                        "offer": res.get("Offer", "N/A"),
                        "link": res.get("Link", "N/A")
                    })
                print(f"Successfully found {len(personal_restaurants)} restaurants for personal dish: {personal_dish}")
            else:
                print(f"No restaurants found for personal dish: {personal_dish}")
                
        except Exception as e:
            print(f"Error in personal restaurant filtering: {e}")
    else:
        print(f"No personal dish predicted, only general category recommendations available")
    
    print(f"General restaurants: {len(general_restaurants)}, Personal restaurants: {len(personal_restaurants)}")

    return jsonify({
        'dish': predicted_category,  # Now returns the predicted category instead of specific dish
        'confidence': confidence,
        'generalRestaurants': general_restaurants,  # Restaurants for general ML model (category-based)
        'personalRestaurants': personal_restaurants,  # Restaurants for personal ML model (dish-based)
        'personalDish': personal_dish,  # Primary personal dish prediction
        'personalDishes': personal_dishes,  # All personal dish predictions with confidence
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