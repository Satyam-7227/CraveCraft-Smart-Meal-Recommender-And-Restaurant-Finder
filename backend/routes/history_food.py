from flask import Blueprint, request, jsonify
from models.user_model import feedback_data
from datetime import datetime

history_bp = Blueprint('history_bp',__name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    email = request.args.get('email', 'testuser@gmail.com')

    feedbacks = list(feedback_data.find({"email": email}))
    history = []

    for feedback in feedbacks:
        history_entry = {
            "mood": feedback.get("mood", "N/A"),
            "dayStatus": feedback.get("dayStatus", "N/A"),
            "craving": feedback.get("craving", "N/A"),
            "diet": feedback.get("diet", "N/A"),
            "cuisines": feedback.get("cuisines", "N/A"),
            "selectedRestaurant": feedback.get("selectedRestaurant", "N/A"),
            "timeNeed": feedback.get("timeNeed", "N/A"),
            "location": feedback.get("location", "N/A"),
            "dish_feedback": feedback.get("dish_feedback", None),  # Add dish feedback
            "feedback_type": feedback.get("feedback_type", None),  # Add feedback type
            "timestamp": feedback.get("timestamp", None)  # Add timestamp
        }

        # Handle selectedDish vs selectedDishes logic
        selected_dish = feedback.get("selectedDish")
        selected_dishes = feedback.get("selectedDishes")
        
        if selected_dish and selected_dish != "N/A":
            # If selectedDish is available and not N/A, use it
            history_entry["selectedDish"] = selected_dish
            history_entry["dishType"] = "single"
        elif selected_dishes and selected_dishes != "N/A":
            # If selectedDishes is available and not N/A, use it
            history_entry["selectedDishes"] = selected_dishes
            history_entry["dishType"] = "multiple"
        else:
            # If neither is available, set both to N/A
            history_entry["selectedDish"] = "N/A"
            history_entry["selectedDishes"] = "N/A"
            history_entry["dishType"] = "none"

        history.append(history_entry)

    # Sort history from newest to oldest (latest first)
    # Handle cases where timestamp might be None
    def get_sort_key(entry):
        timestamp = entry.get("timestamp")
        if timestamp is None:
            return datetime.min  # Put entries without timestamp at the end
        return timestamp

    # Sort in descending order (newest first)
    history.sort(key=get_sort_key, reverse=True)

    return jsonify({"history": history})