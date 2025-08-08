from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))
db = client["smart_meal_app"]
user_collection = db['users']
restaurant_data = db['restaurants_data']
menu_data = db['menus_data']
feedback_data = db['feedback_data']