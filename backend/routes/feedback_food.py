from flask import Blueprint, request, jsonify
from models.user_model import feedback_data
from routes.train_personal_model import train_personal_model
from datetime import datetime

feedback_bp = Blueprint('feedback_bp',__name__)

@feedback_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json

    email = data.get("email", "testuser@example.com")
    feedback_entry = {
        "email": data.get("email", "testuser@example.com"),
        "mood": data.get("mood"),
        "dayStatus": data.get("dayStatus"),
        "craving": data.get("craving"),
        "diet": data.get("diet"),
        "cuisines": data.get("cuisines"),
        "priceMin": data.get("priceMin"),
        "priceMax": data.get("priceMax"),
        "timeNeed": data.get("timeNeed"),
        "location": data.get("location"),
        "selectedRestaurant": data.get("selectedRestaurant"),
        # Add new fields for dish feedback
        "dish_feedback": data.get("dish_feedback"),  # 'like' or 'dislike'
        "feedback_type": data.get("feedback_type"),  # 'general_recommendation' or 'personal_recommendation'
        "timestamp": datetime.now()
    }

    # Include single selected dish only if provided (e.g., "Choose This" flow)
    if data.get("selectedDish") is not None:
        feedback_entry["selectedDish"] = data.get("selectedDish")

    # Include multiple selected dishes only if provided (RestaurantDetails flow)
    if data.get("selectedDishes") is not None:
        feedback_entry["selectedDishes"] = data.get("selectedDishes")

    feedback_data.insert_one(feedback_entry)

    feedback_count = feedback_data.count_documents({'email': email})
    if feedback_count >= 10:
        train_personal_model(email)
    return jsonify({"message": "Feedback submitted successfully"}), 200
