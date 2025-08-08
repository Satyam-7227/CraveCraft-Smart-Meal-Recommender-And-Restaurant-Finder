from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.recommend_food import recommend_bp
from routes.feedback_food import feedback_bp
from routes.history_food import history_bp
from routes.rule_based_recommend import rule_based_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(recommend_bp, url_prefix="/api")
app.register_blueprint(feedback_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(rule_based_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
