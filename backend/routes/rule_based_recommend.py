from flask import Blueprint, request, jsonify
import json
import os

rule_based_bp = Blueprint('rule_based_bp', __name__)

with open('data_stored/dish_conditions_317_rows.json', 'r', encoding='utf-8') as file:
    dish_data = json.load(file)

@rule_based_bp.route('/rule-based-recommend', methods=['POST'])
def rule_based_recommend():
    data = request.json

    scores = []

    for dish_entry in dish_data:
        dish = dish_entry.get("dish")

        score = 0

        if data['mood'] == dish_entry.get('mood'): score += 1
        if data['dayStatus'] == dish_entry.get('dayStatus'): score += 1
        if data['craving'] == dish_entry.get('craving'): score += 1
        if data['diet'] == dish_entry.get('diet'): score += 1
        if dish_entry.get('cuisines') in data['cuisines']: score += 1

        scores.append((dish,dish_entry.get('cuisines'),score))

    top_dishes = sorted(scores, key=lambda x: x[2], reverse=True)[:5]

    result = [{"dish": d[0],"cuisines": d[1],"score": d[2]} for d in top_dishes]

    return jsonify({"ruleBasedDishes": result})
