# Smart Meal Recommender 🍽️

A comprehensive meal recommendation system built for college examination (4th semester) that intelligently suggests personalized food options based on user preferences, dietary restrictions, and historical data.

## 📋 Project Overview

This Smart Meal Recommender is a full-stack web application that combines machine learning algorithms with rule-based systems to provide intelligent food recommendations. The project was initially developed for academic purposes and continues to be improved over time with new features and optimizations.

## ✨ Features

### 🎯 Core Functionality
- **Personalized Food Recommendations**: AI-powered suggestions based on user preferences and history
- **Rule-based Filtering**: Dietary restrictions, allergies, and nutritional requirements
- **Restaurant Integration**: Browse and discover nearby restaurants
- **User Authentication**: Secure login/registration system with JWT tokens
- **Feedback System**: Rate and provide feedback on recommendations
- **History Tracking**: Monitor your food choices and preferences over time

### 📊 Analytics & Insights
- **Personal Analytics Dashboard**: Visualize your eating patterns
- **Nutritional Insights**: Track your dietary intake and goals
- **Recommendation Performance**: Monitor how well the system learns your preferences

### 🚀 Technical Features
- **Lazy Loading**: Optimized performance with progressive content loading
- **Responsive Design**: Mobile-first approach for all devices
- **Real-time Updates**: Dynamic content updates without page refresh
- **Data Visualization**: Interactive charts using Chart.js

## 🏗️ Architecture

### Frontend (React.js)
- **React 19.1.0**: Latest React with modern hooks and features
- **React Router**: Client-side routing for seamless navigation
- **Axios**: HTTP client for API communication
- **Chart.js**: Data visualization and analytics
- **Responsive CSS**: Mobile-first design approach

### Backend (Python Flask)
- **Flask 3.1.1**: Lightweight web framework
- **MongoDB**: NoSQL database for flexible data storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **Modular Architecture**: Blueprint-based route organization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000)

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
The backend API will run on [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
Smart_Meal_Recommender/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── context/        # React context for state management
│   │   └── css/            # Stylesheets
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Python Flask backend
│   ├── routes/             # API endpoint definitions
│   ├── models/             # Data models and schemas
│   ├── data_stored/        # Data storage and processing
│   └── requirements.txt    # Python dependencies
└── README.md               # Project documentation
```

## 🔧 Key Components

### Frontend Components
- **Navbar**: Navigation and user authentication
- **RecommendationsList**: Display food recommendations
- **SearchPage**: Advanced food search with filters
- **Analytics**: Data visualization dashboard
- **History**: User's food choice history
- **RestaurantDetails**: Restaurant information and reviews

### Backend Routes
- **Authentication**: User login, registration, and JWT management
- **Recommendations**: AI-powered food suggestions
- **Feedback**: User rating and feedback collection
- **History**: User preference tracking
- **Analytics**: Data analysis and insights
- **Restaurants**: Restaurant information and management

## 🎓 Academic Context

This project was developed as part of the **4th semester college examination** requirements, demonstrating:
- Full-stack web development skills
- Machine learning integration
- Database design and management
- User experience design
- API development and integration
- Modern web technologies

## 🔮 Future Improvements

The project is continuously evolving with planned enhancements:
- [ ] Enhanced ML algorithms for better recommendations
- [ ] Mobile app development
- [ ] Social features and food sharing
- [ ] Integration with food delivery services
- [ ] Advanced nutritional analysis
- [ ] Multi-language support

## 🤝 Contributing

This is a personal academic project that's being improved over time. Feel free to explore the code and provide feedback!

## 📝 License

This project is developed for educational purposes as part of college coursework.

## 👨‍💻 Developer

Built with ❤️ for academic excellence and continuous learning in web development and machine learning.

---

*Last updated: December 2024*
*Project Status: Active Development*
