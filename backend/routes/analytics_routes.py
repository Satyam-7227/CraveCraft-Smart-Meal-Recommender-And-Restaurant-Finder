from flask import Blueprint, jsonify
import json
import os

analytics_bp = Blueprint('analytics_bp', __name__)

@analytics_bp.route('/dish-conditions', methods=['GET'])
def get_dish_conditions():
    """Get dish conditions data for analytics"""
    try:
        file_path = 'data_stored/dish_conditions_317_rows.json'
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            return jsonify(data)
        else:
            return jsonify([]), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/analytics/summary', methods=['GET'])
def get_analytics_summary():
    """Get summary statistics for analytics dashboard"""
    try:
        # Load dish conditions data
        file_path = 'data_stored/dish_conditions_317_rows.json'
        if not os.path.exists(file_path):
            return jsonify({"error": "Data file not found"}), 404
            
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Calculate summary statistics
        total_dishes = len(data)
        moods = {}
        diets = {}
        cuisines = {}
        cravings = {}
        day_statuses = {}
        
        for item in data:
            # Count moods
            mood = item.get('mood', 'Unknown')
            moods[mood] = moods.get(mood, 0) + 1
            
            # Count diets
            diet = item.get('diet', 'Unknown')
            diets[diet] = diets.get(diet, 0) + 1
            
            # Count cuisines
            cuisine = item.get('cuisines', 'Unknown')
            cuisines[cuisine] = cuisines.get(cuisine, 0) + 1
            
            # Count cravings
            craving = item.get('craving', 'Unknown')
            cravings[craving] = cravings.get(craving, 0) + 1
            
            # Count day statuses
            day_status = item.get('dayStatus', 'Unknown')
            day_statuses[day_status] = day_statuses.get(day_status, 0) + 1
        
        # Get top categories
        top_mood = max(moods.items(), key=lambda x: x[1])[0] if moods else 'Unknown'
        top_diet = max(diets.items(), key=lambda x: x[1])[0] if diets else 'Unknown'
        top_cuisine = max(cuisines.items(), key=lambda x: x[1])[0] if cuisines else 'Unknown'
        top_craving = max(cravings.items(), key=lambda x: x[1])[0] if cravings else 'Unknown'
        top_day_status = max(day_statuses.items(), key=lambda x: x[1])[0] if day_statuses else 'Unknown'
        
        summary = {
            "total_dishes": total_dishes,
            "top_mood": top_mood,
            "top_diet": top_diet,
            "top_cuisine": top_cuisine,
            "top_craving": top_craving,
            "top_day_status": top_day_status,
            "mood_distribution": moods,
            "diet_distribution": diets,
            "cuisine_distribution": cuisines,
            "craving_distribution": cravings,
            "day_status_distribution": day_statuses
        }
        
        return jsonify(summary)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
