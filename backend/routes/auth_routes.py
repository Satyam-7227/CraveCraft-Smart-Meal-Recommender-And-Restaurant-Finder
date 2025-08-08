from flask import Blueprint, request, jsonify
from models.user_model import user_collection
import bcrypt
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = os.getenv("SECRET_KEY")

@auth_bp.route("/register",methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']

    if user_collection.find_one({'email': email}):
        return jsonify({'message':'User already exists'}), 400
    
    # print('email is ',email)
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_collection.insert_one({'name':name,'email':email,'password':hashed_pw})
    return jsonify({'message':'User registered successfully'}), 201

@auth_bp.route("/login",methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
 
    user = user_collection.find_one({'email':email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        token = jwt.encode({'email':email}, SECRET_KEY, algorithm='HS256')
        return jsonify({'token':token}), 200
    else:
        return jsonify({'message':'Invalid credentials'}), 401
