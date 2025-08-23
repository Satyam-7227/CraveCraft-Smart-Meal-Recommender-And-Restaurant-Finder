# from flask import Blueprint, request, jsonify
from models.user_model import feedback_data
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import pandas as pd

# personal_model_bp = Blueprint('personal_model_bp', __name__)

# @personal_model_bp.route('/train-personal-model', methods=['POST'])
def train_personal_model(email):
    print(f"Starting personal model training for {email}")
    feedbacks = list(feedback_data.find({'email': email}))
    print(f"Found {len(feedbacks)} feedback entries")
    
    if len(feedbacks) < 2:
        return "Not enough data to train"
    
    df = pd.DataFrame(feedbacks)
    print(f"DataFrame columns: {list(df.columns)}")
    
    # Check which dish columns exist
    dish_columns = []
    if 'selectedDish' in df.columns:
        dish_columns.append('selectedDish')
    if 'selectedDishes' in df.columns:
        dish_columns.append('selectedDishes')
    
    print(f"Available dish columns: {dish_columns}")
    if dish_columns:
        print(f"Sample data:\n{df[dish_columns].head()}")
    
    df['cuisines'] = df['cuisines'].apply(lambda x: x[0] if isinstance(x,list) and x else 'Unknown')

    # Handle both single dish and multiple dishes for training
    all_dishes = []
    for _, row in df.iterrows():
        # Check for single selected dish (if column exists)
        if 'selectedDish' in df.columns:
            selected_dish = row.get('selectedDish')
            if selected_dish and str(selected_dish).strip() and str(selected_dish).lower() != 'nan':
                all_dishes.append(str(selected_dish))
        
        # Check for multiple selected dishes (if column exists)
        if 'selectedDishes' in df.columns:
            selected_dishes = row.get('selectedDishes')
            if selected_dishes:
                if isinstance(selected_dishes, list) and len(selected_dishes) > 0:
                    # Filter out empty/None values from the list
                    valid_dishes = [str(dish) for dish in selected_dishes if dish and str(dish).strip() and str(dish).lower() != 'nan']
                    all_dishes.extend(valid_dishes)
                elif str(selected_dishes).strip() and str(selected_dishes).lower() != 'nan':
                    # Single dish value (not a list)
                    all_dishes.append(str(selected_dishes))
    
    # Filter out None/empty values
    all_dishes = [dish for dish in all_dishes if dish and str(dish).strip()]
    print(f"Total dishes found: {len(all_dishes)}")
    print(f"Sample dishes: {all_dishes[:5]}")
    
    if len(all_dishes) < 2:
        return "Not enough dish data to train personal model"
    
    # Create training data with repeated rows for each dish
    training_data = []
    for _, row in df.iterrows():
        row_dishes = []
        
        # Get dishes from this feedback entry
        if 'selectedDish' in df.columns:
            selected_dish = row.get('selectedDish')
            if selected_dish and str(selected_dish).strip() and str(selected_dish).lower() != 'nan':
                row_dishes.append(str(selected_dish))
        
        if 'selectedDishes' in df.columns:
            selected_dishes = row.get('selectedDishes')
            if selected_dishes:
                if isinstance(selected_dishes, list) and len(selected_dishes) > 0:
                    # Filter out empty/None values from the list
                    valid_dishes = [str(dish) for dish in selected_dishes if dish and str(dish).strip() and str(dish).lower() != 'nan']
                    row_dishes.extend(valid_dishes)
                elif str(selected_dishes).strip() and str(selected_dishes).lower() != 'nan':
                    # Single dish value (not a list)
                    row_dishes.append(str(selected_dishes))
        
        # Create a training row for each dish
        for dish in row_dishes:
            if dish and str(dish).strip():
                training_row = {
                    'mood': row['mood'],
                    'dayStatus': row['dayStatus'],
                    'craving': row['craving'],
                    'diet': row['diet'],
                    'timeNeed': row['timeNeed'],
                    'cuisines': row['cuisines'],
                    'dish': dish
                }
                training_data.append(training_row)
    
    # Create DataFrame from training data
    training_df = pd.DataFrame(training_data)
    print(f"Training DataFrame created with {len(training_df)} rows")
    print(f"Training data sample:\n{training_df.head()}")
    
    if len(training_df) < 2:
        return "Not enough valid dish data to train personal model"
    
    X = training_df[['mood', 'dayStatus', 'craving', 'diet', 'timeNeed', 'cuisines']]
    Y = training_df['dish']

    # Handle missing values
    X = X.fillna('Unknown')
    Y = Y.fillna('Unknown')

    encoders = {}
    for col in X.columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le

    target_encoder = LabelEncoder()
    Y = target_encoder.fit_transform(Y)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, Y)

    user_id = email.replace('@','_at_').replace('.','_')
    model_dir = f"data_stored/personal_models/{user_id}"
    os.makedirs(model_dir, exist_ok=True)

    joblib.dump(model, f"{model_dir}/model.pkl")
    joblib.dump(encoders, f"{model_dir}/encoders.pkl")
    joblib.dump(target_encoder, f"{model_dir}/target_encoder.pkl")

    print(f"Personal model trained successfully for {email} with {len(training_df)} dish samples")
    return "Model trained successfully"