import React, { useState } from "react";
import axios from "axios";
import '../css/RecommendationList.css';

function RecommendationsList({ recommendData, formData, onBack, onViewRestaurant }) {
    const [showGeneralRestaurants, setShowGeneralRestaurants] = useState(false);
    const [showPersonalRestaurants, setShowPersonalRestaurants] = useState(false);
    const [generalFeedback, setGeneralFeedback] = useState('like'); // 'like', 'dislike', or null
    const [personalFeedback, setPersonalFeedback] = useState('like'); // 'like', 'dislike', or null
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    function handleFeedback(restaurantName) {
        // Determine which dish and feedback to use based on whether it's personal or general
        const isPersonalDish = recommendData.personalDish;
        const selectedDish = isPersonalDish ? recommendData.personalDish : recommendData.dish;
        const dishFeedback = isPersonalDish ? personalFeedback : generalFeedback;
        const feedbackType = isPersonalDish ? 'personal_recommendation' : 'general_recommendation';

        const feedbackPayload = {
            ...formData,
            selectedDish: selectedDish,
            selectedRestaurant: restaurantName,
            dish_feedback: dishFeedback,
            feedback_type: feedbackType
        };

        axios.post("http://localhost:5000/api/feedback", feedbackPayload)
            .then((response) => {
                console.log('Feedback submitted successfully:', response.data);
                // Show success message
                setSuccessMessage("✅ Dish selected successfully! Redirecting to new recommendation form...");
                setShowSuccess(true);
                
                // Redirect to form submission page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            })
            .catch((err) => {
                console.error('Error submitting feedback:', err);
                setSuccessMessage("❌ Failed to submit feedback. Please try again.");
                setShowSuccess(true);
                
                // Hide error message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                    setSuccessMessage('');
                }, 3000);
            })
    }

    const handleFindGeneralRestaurants = () => {
        setShowGeneralRestaurants(!showGeneralRestaurants);
    };

    const handleFindPersonalRestaurants = () => {
        setShowPersonalRestaurants(!showPersonalRestaurants);
    };

    const handleGeneralFeedback = (feedback) => {
        setGeneralFeedback(feedback);
        // Don't save to backend immediately - just update local state
    };

    const handlePersonalFeedback = (feedback) => {
        setPersonalFeedback(feedback);
        // Don't save to backend immediately - just update local state
    };

    return (
        <div className="meal-recommender recommendations-view">
            <div className="container-wide">
                {/* Header with back button */}
                <div className="recommendations-header">
                    <button onClick={() => onBack()} className="back-button">
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
                    {/* Main Recommendation Card General */}
                    <div className={`main-recommendation-card-left ${recommendData.personalDish ? '' : 'full'}`}>
                        <div className="recommendation-content">
                            <div className="recommendation-left">
                                <h2 className="dish-title">{recommendData.dish}</h2>
                                <div className="cuisine-badge-single">{formData.cuisines}</div>
                                <p className="dish-description">Perfect for your happy mood and heavy craving</p>

                                <div className="dish-stats">
                                    <div className="stat-item">
                                        <span className="stat-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="custom-clock-icon">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </span>
                                        <span>{formData.timeNeed} min</span>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button 
                                        className={`like-button ${generalFeedback === 'like' ? 'active' : ''}`}
                                        onClick={() => handleGeneralFeedback('like')}
                                    >
                                        <span style={{ display: 'flex' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="thumbs-up-icon">
                                                <path d="M7 10v12"></path>
                                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                                            </svg>
                                        </span>
                                        Like
                                    </button>
                                    <button 
                                        className={`dislike-button ${generalFeedback === 'dislike' ? 'active' : ''}`}
                                        onClick={() => handleGeneralFeedback('dislike')}
                                    >
                                        <span style={{ display: 'flex' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="thumbs-down-icon">
                                                <path d="M17 14V2"></path>
                                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                                            </svg>
                                        </span>
                                        Dislike
                                    </button>
                                </div>
                            </div>

                            <div className="recommendation-right">
                                <div className="confidence-score">{recommendData.confidence.toFixed(0)}%</div>
                                <div className="confidence-label">Confidence</div>
                            </div>
                        </div>

                        <div className="confidence-bar-section">
                            <div className="confidence-bar-header">
                                <span>Recommendation Confidence</span>
                                <span>{recommendData.confidence.toFixed(2)}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${recommendData.confidence.toFixed(2)}%` }}></div>
                            </div>
                        </div>

                        <button 
                            className="find-restaurants-button"
                            onClick={handleFindGeneralRestaurants}
                        >
                            {showGeneralRestaurants ? 'Hide Restaurants' : `Find Restaurants Serving ${recommendData.dish} Category`}
                        </button>
                    </div>

                    {/* Main Recommendation Card Personal */}
                    {recommendData.personalDish && (
                        <div className="main-recommendation-card-right">
                            <div className="recommendation-content">
                                <div className="recommendation-left">
                                    <h2 className="dish-title">{recommendData.personalDish}</h2>
                                    <div className="cuisine-badge-single">{formData.cuisines}</div>
                                    <p className="dish-description">Perfect for your happy mood and heavy craving</p>

                                    {/* Show multiple personal dish predictions if available */}
                                    {recommendData.personalDishes && recommendData.personalDishes.length > 1 && (
                                        <div className="personal-dish-alternatives">
                                            <h4>Other Personal Recommendations:</h4>
                                            <div className="alternative-dishes">
                                                {recommendData.personalDishes.slice(1, 4).map((dishData, index) => (
                                                    <span key={index} className="alternative-dish">
                                                        {dishData.dish} ({dishData.confidence.toFixed(0)}%)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="dish-stats">
                                        <div className="stat-item">
                                            <span className="stat-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="custom-clock-icon">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            </span>
                                            <span>{formData.timeNeed} min</span>
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button 
                                            className={`like-button ${personalFeedback === 'like' ? 'active' : ''}`}
                                            onClick={() => handlePersonalFeedback('like')}
                                        >
                                            <span style={{ display: 'flex' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="thumbs-up-icon">
                                                    <path d="M7 10v12"></path>
                                                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                                                </svg>
                                            </span>
                                            Like
                                        </button>
                                        <button 
                                            className={`dislike-button ${personalFeedback === 'dislike' ? 'active' : ''}`}
                                            onClick={() => handlePersonalFeedback('dislike')}
                                        >
                                            <span style={{ display: 'flex' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="thumbs-down-icon">
                                                    <path d="M17 14V2"></path>
                                                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                                                </svg>
                                            </span>
                                            Dislike
                                        </button>
                                    </div>
                                </div>

                                <div className="recommendation-right">
                                    <div className="confidence-score">{recommendData.confidence.toFixed(0)}%</div>
                                    <div className="confidence-label">Confidence</div>
                                </div>
                            </div>

                            <div className="confidence-bar-section">
                                <div className="confidence-bar-header">
                                    <span>Recommendation Confidence</span>
                                    <span>{recommendData.confidence.toFixed(2)}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${recommendData.confidence.toFixed(2)}%` }}></div>
                                </div>
                            </div>

                            <button 
                                className="find-restaurants-button"
                                onClick={handleFindPersonalRestaurants}
                            >
                              {showPersonalRestaurants ? 'Hide Restaurants' : 'Find Restaurants Serving This'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Restaurant Recommendations - Show based on which model's button was clicked */}
                {(showGeneralRestaurants || showPersonalRestaurants) && (
                    <div className="restaurants-section">
                        <h3>
                            {showPersonalRestaurants 
                                ? `Restaurants serving ${recommendData.personalDish} or similar dishes`
                                : `Restaurants serving ${recommendData.dish} category dishes`
                            }
                        </h3>
                        {showGeneralRestaurants && showPersonalRestaurants && (
                            <p className="model-indicator">
                                💡 Showing restaurants from both General ML (category-based) and Personal ML (dish-based) models
                            </p>
                        )}
                        {showGeneralRestaurants && !showPersonalRestaurants && (
                            <p className="model-indicator">
                                🎯 Showing restaurants from General ML Model (category-based recommendations)
                            </p>
                        )}
                        {!showGeneralRestaurants && showPersonalRestaurants && (
                            <p className="model-indicator">
                                🎯 Showing restaurants from Personal ML Model (dish-based recommendations)
                            </p>
                        )}
                        <div className="restaurants-grid">
                            {/* Show restaurants based on which model's button was clicked */}
                            {(() => {
                                let restaurantsToShow = [];
                                
                                if (showGeneralRestaurants && recommendData.generalRestaurants) {
                                    restaurantsToShow.push(...recommendData.generalRestaurants);
                                }
                                
                                if (showPersonalRestaurants && recommendData.personalRestaurants) {
                                    restaurantsToShow.push(...recommendData.personalRestaurants);
                                }
                                
                                // Remove duplicates based on restaurant name
                                const uniqueRestaurants = restaurantsToShow.filter((restaurant, index, self) => 
                                    index === self.findIndex(r => r.restaurantName === restaurant.restaurantName)
                                );
                                
                                return uniqueRestaurants.map((restaurant, index) => (
                                <div key={index} className="restaurant-card">
                                    <div className="restaurant-image">
                                        <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.restaurantName} />
                                        {restaurant.offer && <div className="offer-badge">{restaurant.offer}</div>}
                                    </div>
                                    <div className="restaurant-info">
                                        <h4>{restaurant.restaurantName}</h4>
                                        <div className="restaurant-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#facc15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-star">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                </span>
                                                <span>{restaurant.ratingTime}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-map-pin">
                                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                </span>
                                                <span>{restaurant.location}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-tag">
                                                        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                                        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                                    </svg>
                                                </span>
                                                <span>{restaurant.category}</span>
                                            </div>
                                        </div>
                                        <div className="restaurant-actions">
                                            <button className="view-button" onClick={() => {
                                                if (onViewRestaurant) {
                                                    onViewRestaurant(
                                                        restaurant.restaurantName,
                                                        recommendData.personalDish || recommendData.dish,
                                                        formData
                                                    );
                                                }
                                            }}>
                                                <span className="button-icon">🔗</span>
                                                View
                                            </button>
                                                                                    {/* 
                                            "Choose This" button only appears for personal dish predictions
                                            - General ML Model: NO button (predicts categories, not specific dishes)
                                            - Personal ML Model: YES button (predicts specific dish names)
                                        */}
                                        {recommendData.personalDish && showPersonalRestaurants && (
                                            <button className="choose-button" onClick={() => handleFeedback(restaurant.restaurantName)}>
                                                Choose This
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            ));
                            })()}
                        </div>
                    </div>
                )}

                {/* Enhanced Rule-based suggestions */}
                {recommendData.ruleBasedDishes && (
                    <div className="other-dishes-section">
                        <div className="section-header">
                            <span className="section-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-utensils">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                    <path d="M7 2v20"></path>
                                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                                </svg>
                            </span>
                            <h3>Other dishes you might like</h3>
                        </div>
                        <div className="other-dishes-grid">
                            {recommendData.ruleBasedDishes.map((item, index) => (
                                <div key={index} className="other-dish-card">
                                    <div className="dish-card-header">
                                        <h4>{item.dish}</h4>
                                        <div className="score-badge">Score: {item.score}</div>
                                    </div>
                                    <div className="dish-card-details">
                                        <span className="dish-detail">
                                            <span className="detail-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-tag-small">
                                                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                                </svg>
                                            </span>
                                            {item.cuisines}
                                        </span>
                                        <span className="dish-detail">
                                            <span className="detail-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-clock-small">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            </span>
                                            30 Min
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Success/Error Message */}
                {showSuccess && (
                    <div className={`message-overlay ${successMessage.includes('❌') ? 'error' : 'success'}`}>
                        <div className="message-content">
                            <div className="message-icon">
                                {successMessage.includes('❌') ? '❌' : '✅'}
                            </div>
                            <div className="message-text">{successMessage}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecommendationsList;