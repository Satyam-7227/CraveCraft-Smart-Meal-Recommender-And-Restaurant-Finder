from flask import Blueprint, request, jsonify
from models.user_model import restaurant_data, menu_data
import re

restaurant_bp = Blueprint('restaurant_bp', __name__)

@restaurant_bp.route('/restaurants', methods=['GET'])
def get_all_restaurants():
    """Get all restaurants with pagination and search support."""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '').strip()
        category = request.args.get('category', '').strip()
        location = request.args.get('location', '').strip()
        
        # Build query filter
        query_filter = {}
        
        if search:
            query_filter["Name"] = {"$regex": search, "$options": "i"}
        
        if category:
            query_filter["Category"] = {"$regex": category, "$options": "i"}
            
        if location:
            query_filter["Location"] = {"$regex": location, "$options": "i"}
        
        # Get total count for pagination
        total_count = restaurant_data.count_documents(query_filter)
        
        # Apply pagination
        skip = (page - 1) * limit
        
        # Get restaurants with sorting by rating
        restaurants_cursor = restaurant_data.find(query_filter).skip(skip).limit(limit)
        
        # Sort by rating (extract numeric rating from "Rating & Time" field)
        def extract_rating(restaurant):
            rating_time = restaurant.get("Rating & Time", "0")
            try:
                # Extract rating from "3.8 • 25-30 mins" format
                rating = float(rating_time.split(" ")[0])
                return rating
            except:
                return 0.0
        
        restaurants_list = list(restaurants_cursor)
        restaurants_list.sort(key=extract_rating, reverse=True)
        
        # Format restaurant data
        restaurants = []
        for res in restaurants_list:
            restaurants.append({
                "id": str(res.get("_id")),
                "name": res.get("Name", "N/A"),
                "location": res.get("Location", "N/A"),
                "ratingTime": res.get("Rating & Time", "N/A"),
                "category": res.get("Category", "N/A"),
                "image": res.get("Image URL", "N/A"),
                "offer": res.get("Offer", "N/A"),
                "link": res.get("Link", "N/A")
            })
        
        return jsonify({
            "restaurants": restaurants,
            "pagination": {
                "current_page": page,
                "total_pages": (total_count + limit - 1) // limit,
                "total_count": total_count,
                "has_next": page * limit < total_count,
                "has_prev": page > 1
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@restaurant_bp.route('/restaurants/categories', methods=['GET'])
def get_restaurant_categories():
    """Get all unique restaurant categories."""
    try:
        categories = restaurant_data.distinct("Category")
        return jsonify({"categories": categories})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@restaurant_bp.route('/restaurants/locations', methods=['GET'])
def get_restaurant_locations():
    """Get all unique restaurant locations."""
    try:
        locations = restaurant_data.distinct("Location")
        return jsonify({"locations": locations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
