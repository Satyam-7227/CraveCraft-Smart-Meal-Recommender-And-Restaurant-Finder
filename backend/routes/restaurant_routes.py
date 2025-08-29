from flask import Blueprint, request, jsonify
from models.user_model import restaurant_data, menu_data
import re

restaurant_bp = Blueprint('restaurant_bp', __name__)

@restaurant_bp.route('/restaurants', methods=['GET'])
def get_all_restaurants():
    """Get all restaurants with pagination and search support optimized for lazy loading."""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '').strip()
        category = request.args.get('category', '').strip()
        location = request.args.get('location', '').strip()
        
        # Validate and limit page size for performance
        if limit > 50:
            limit = 50
        elif limit < 1:
            limit = 20
        
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
        
        # Calculate pagination metadata
        total_pages = (total_count + limit - 1) // limit
        skip = (page - 1) * limit
        
        # Validate page number
        if page < 1:
            page = 1
            skip = 0
        elif page > total_pages and total_pages > 0:
            page = total_pages
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
        
        # Enhanced pagination metadata for lazy loading
        has_next = page < total_pages
        has_prev = page > 1
        next_page = page + 1 if has_next else None
        prev_page = page - 1 if has_prev else None
        
        return jsonify({
            "restaurants": restaurants,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_count": total_count,
                "has_next": has_next,
                "has_prev": has_prev,
                "next_page": next_page,
                "prev_page": prev_page,
                "items_per_page": limit,
                "items_on_current_page": len(restaurants),
                "is_last_page": page >= total_pages,
                "is_first_page": page <= 1
            },
            "meta": {
                "search_term": search,
                "category_filter": category,
                "location_filter": location,
                "query_time": "optimized"
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

@restaurant_bp.route('/restaurants/stats', methods=['GET'])
def get_restaurant_stats():
    """Get restaurant statistics for better UX."""
    try:
        total_restaurants = restaurant_data.count_documents({})
        categories_count = len(restaurant_data.distinct("Category"))
        locations_count = len(restaurant_data.distinct("Location"))
        
        # Get top categories by count
        pipeline = [
            {"$group": {"_id": "$Category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        top_categories = list(restaurant_data.aggregate(pipeline))
        
        return jsonify({
            "stats": {
                "total_restaurants": total_restaurants,
                "total_categories": categories_count,
                "total_locations": locations_count,
                "top_categories": top_categories
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
