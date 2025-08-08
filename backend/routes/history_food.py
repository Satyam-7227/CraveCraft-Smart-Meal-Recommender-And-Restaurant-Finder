from flask import Blueprint, request, jsonify
from models.user_model import feedback_data

history_bp = Blueprint('history_bp',__name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    email = request.args.get('email', 'testuser@gmail.com')

    feedbacks = list(feedback_data.find({"email": email}))
    history = []

    for feedback in feedbacks:
        history.append({
            "mood": feedback.get("mood", "N/A"),
            "dayStatus": feedback.get("dayStatus", "N/A"),
            "craving": feedback.get("craving", "N/A"),
            "diet": feedback.get("diet", "N/A"),
            "cuisines": feedback.get("cuisines", "N/A"),
            "selectedDish": feedback.get("selectedDish", "N/A"),
            "selectedRestaurant": feedback.get("selectedRestaurant", "N/A"),
            "timeNeed": feedback.get("timeNeed", "N/A"),
            "location": feedback.get("location", "N/A"),
        })

    return jsonify({"history": history})