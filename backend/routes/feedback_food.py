from flask import Blueprint, request, jsonify
from models.user_model import feedback_data
from routes.train_personal_model import train_personal_model

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
        "selectedDish": data.get("selectedDish"),
        "selectedRestaurant": data.get("selectedRestaurant")
    }

    feedback_data.insert_one(feedback_entry)

    feedback_count = feedback_data.count_documents({'email': email})
    if feedback_count >= 2:
        train_personal_model(email)
    return jsonify({"message": "Feedback submitted successfully"}), 200
