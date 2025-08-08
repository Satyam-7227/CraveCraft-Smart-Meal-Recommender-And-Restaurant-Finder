"use client"

import { useState } from "react"
import "./SmartMealRecommender.css"

function SmartMealRecommender() {
    const [currentView, setCurrentView] = useState("form") // "form" or "recommendations"
    const [isLoading, setIsLoading] = useState(false)

    // Mock data for demonstration - replace with your actual data
    const mockRecommendations = {
        dish: "Spicy Chicken Biryani",
        confidence: 92,
        personalDish: "Paneer Tikka Masala",
        cuisine: "North Indian",
        description: "Perfect for your happy mood and heavy craving",
        calories: 650,
        cookTime: 25,
        recommendation: [
            {
                restaurantName: "Spice Garden",
                location: "Satellite, Ahmedabad",
                ratingTime: "4.5 • 25-30 mins",
                category: "North Indian",
                image: "/placeholder.svg",
                offer: "20% OFF up to ₹100",
                link: "#",
            },
            {
                restaurantName: "Royal Kitchen",
                location: "Vastrapur, Ahmedabad",
                ratingTime: "4.3 • 30-35 mins",
                category: "North Indian, Mughlai",
                image: "/placeholder.svg",
                offer: "Free delivery",
                link: "#",
            },
            {
                restaurantName: "Taste of Punjab",
                location: "CG Road, Ahmedabad",
                ratingTime: "4.2 • 20-25 mins",
                category: "Punjabi, North Indian",
                image: "/placeholder.svg",
                offer: "Buy 1 Get 1 Free",
                link: "#",
            },
        ],
        ruleBasedDishes: [
            { dish: "Paneer Butter Masala", score: 4, cuisine: "North Indian", time: "20 min" },
            { dish: "Dal Makhani", score: 3, cuisine: "North Indian", time: "15 min" },
            { dish: "Chicken Tikka", score: 3, cuisine: "North Indian", time: "25 min" },
        ],
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call - replace with your actual API call
        setTimeout(() => {
            setIsLoading(false)
            setCurrentView("recommendations")
        }, 2000)
    }

    const handleBackToForm = () => {
        setCurrentView("form")
    }

    const handleRestaurantChoice = (restaurantName) => {
        console.log(`Selected: ${restaurantName}`)
        // Add your feedback API call here
        setCurrentView("form")
    }

    if (currentView === "form") {
        return (
            <div className="meal-recommender">
                <div className="container">
                    <div className="header-section">
                        <h1>Find Your Perfect Meal</h1>
                        <p>Tell us about your mood and preferences</p>
                    </div>

                    <div className="form-card">
                        <div className="form-header">
                            <h2>Meal Recommendation Form</h2>
                        </div>
                        <form onSubmit={handleFormSubmit} className="form-content">
                            {/* Mood Selection */}
                            <div className="form-group">
                                <label>How are you feeling?</label>
                                <div className="button-grid-2">
                                    <button type="button" className="option-button">
                                        <span className="emoji">😊</span>
                                        Happy
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">😢</span>
                                        Sad
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">😴</span>
                                        Tired
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">😰</span>
                                        Stressed
                                    </button>
                                </div>
                            </div>

                            {/* Day Status */}
                            <div className="form-group">
                                <label>How was your day?</label>
                                <div className="button-grid-2">
                                    <button type="button" className="option-button">
                                        Productive
                                    </button>
                                    <button type="button" className="option-button">
                                        Lazy
                                    </button>
                                    <button type="button" className="option-button">
                                        Hectic
                                    </button>
                                    <button type="button" className="option-button">
                                        Normal
                                    </button>
                                </div>
                            </div>

                            {/* Craving */}
                            <div className="form-group">
                                <label>What do you crave?</label>
                                <div className="button-grid-2">
                                    <button type="button" className="option-button">
                                        <span className="emoji">🌶️</span>
                                        Spicy
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">🍯</span>
                                        Sweet
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">🥗</span>
                                        Light
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">🍖</span>
                                        Heavy
                                    </button>
                                </div>
                            </div>

                            {/* Diet Preference */}
                            <div className="form-group">
                                <label>Diet Preference</label>
                                <div className="button-grid-3">
                                    <button type="button" className="option-button">
                                        <span className="emoji">🥬</span>
                                        Veg
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">🍗</span>
                                        Non-Veg
                                    </button>
                                    <button type="button" className="option-button">
                                        <span className="emoji">🙏</span>
                                        Jain
                                    </button>
                                </div>
                            </div>

                            {/* Cuisine Preferences */}
                            <div className="form-group">
                                <label>Cuisine Preferences</label>
                                <div className="cuisine-grid">
                                    <div className="cuisine-badge">North Indian</div>
                                    <div className="cuisine-badge">South Indian</div>
                                    <div className="cuisine-badge">Chinese</div>
                                    <div className="cuisine-badge">Fast Food</div>
                                    <div className="cuisine-badge">Snacks</div>
                                    <div className="cuisine-badge">Dessert</div>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="form-group">
                                <label>Price Range (₹)</label>
                                <div className="price-inputs">
                                    <input type="number" placeholder="Min" className="price-input" />
                                    <input type="number" placeholder="Max" className="price-input" />
                                </div>
                            </div>

                            {/* Time and Location */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Time to eat</label>
                                    <select className="form-select">
                                        <option value="">Select time</option>
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input type="text" defaultValue="Ahmedabad" className="form-input" />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="submit-button">
                                {isLoading ? (
                                    <div className="loading-content">
                                        <div className="spinner"></div>
                                        Finding your perfect meal...
                                    </div>
                                ) : (
                                    "Get My Recommendation"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="meal-recommender recommendations-view">
            <div className="container-wide">
                {/* Header with back button */}
                <div className="recommendations-header">
                    <button onClick={handleBackToForm} className="back-button">
                        <span className="back-arrow">←</span>
                        New Search
                    </button>
                    <div>
                        <h1>Your Perfect Match</h1>
                        <p>Based on your preferences</p>
                    </div>
                </div>

                {/* Main Recommendation Card */}
                <div className="main-recommendation-card">
                    <div className="recommendation-content">
                        <div className="recommendation-left">
                            <h2 className="dish-title">{mockRecommendations.dish}</h2>
                            <div className="cuisine-badge-single">{mockRecommendations.cuisine}</div>
                            <p className="dish-description">{mockRecommendations.description}</p>

                            <div className="dish-stats">
                                <div className="stat-item">
                                    <span className="stat-icon">🔥</span>
                                    <span>{mockRecommendations.calories} cal</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">⏱️</span>
                                    <span>{mockRecommendations.cookTime} min</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="like-button">
                                    <span>👍</span>
                                    Like
                                </button>
                                <button className="dislike-button">
                                    <span>👎</span>
                                    Dislike
                                </button>
                            </div>
                        </div>

                        <div className="recommendation-right">
                            <div className="confidence-score">{mockRecommendations.confidence}%</div>
                            <div className="confidence-label">Confidence</div>
                        </div>
                    </div>

                    <div className="confidence-bar-section">
                        <div className="confidence-bar-header">
                            <span>Recommendation Confidence</span>
                            <span>{mockRecommendations.confidence}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${mockRecommendations.confidence}%` }}></div>
                        </div>
                    </div>

                    <button className="find-restaurants-button">Find Restaurants Serving This</button>
                </div>

                {/* Restaurant Recommendations */}
                <div className="restaurants-section">
                    <h3>Available at these restaurants</h3>
                    <div className="restaurants-grid">
                        {mockRecommendations.recommendation.map((restaurant, index) => (
                            <div key={index} className="restaurant-card">
                                <div className="restaurant-image">
                                    <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.restaurantName} />
                                    {restaurant.offer && <div className="offer-badge">{restaurant.offer}</div>}
                                </div>
                                <div className="restaurant-info">
                                    <h4>{restaurant.restaurantName}</h4>
                                    <div className="restaurant-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">⭐</span>
                                            <span>{restaurant.ratingTime}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">📍</span>
                                            <span>{restaurant.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">🏷️</span>
                                            <span>{restaurant.category}</span>
                                        </div>
                                    </div>
                                    <div className="restaurant-actions">
                                        <button className="view-button" onClick={() => window.open(restaurant.link, "_blank")}>
                                            <span className="button-icon">🔗</span>
                                            View
                                        </button>
                                        <button className="choose-button" onClick={() => handleRestaurantChoice(restaurant.restaurantName)}>
                                            Choose This
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Rule-based suggestions */}
                <div className="other-dishes-section">
                    <div className="section-header">
                        <span className="section-icon">🍽️</span>
                        <h3>Other dishes you might like</h3>
                    </div>
                    <div className="other-dishes-grid">
                        {mockRecommendations.ruleBasedDishes.map((item, index) => (
                            <div key={index} className="other-dish-card">
                                <div className="dish-card-header">
                                    <h4>{item.dish}</h4>
                                    <div className="score-badge">Score: {item.score}</div>
                                </div>
                                <div className="dish-card-details">
                                    <span className="dish-detail">
                                        <span className="detail-icon">🏷️</span>
                                        {item.cuisine}
                                    </span>
                                    <span className="dish-detail">
                                        <span className="detail-icon">⏱️</span>
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmartMealRecommender
