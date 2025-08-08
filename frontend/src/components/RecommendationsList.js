import React from "react";
import axios from "axios";
import '../css/RecommendationList.css';

function RecommendationsList({ recommendData, formData, onBack }) {

    function handleFeedback(restaurantName) {
        const feedbackPayload = {
            ...formData,
            selectedDish: recommendData.dish,
            selectedRestaurant: restaurantName
        };

        axios.post("http://localhost:5000/api/feedback", feedbackPayload)
            .then((response) => {
                console.log(response.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        // <div className="recommendations-container">
        //     <h2>Recommendation Dish : {recommendData.dish}</h2>
        //     <p>Confidence: {recommendData.confidence.toFixed(2)}%</p>

        //     {recommendData.personalDish && (
        //         <h3>Personalized Dish: {recommendData.personalDish}</h3>
        //     )}

        //     <div className="restaurants-cards">
        //         {recommendData.recommendation.map((res, index) => (
        //             <div key={index} className="restaurant-card">
        //                 <img src={res.image} alt={res.restaurantName} />
        //                 <h3>{res.restaurantName}</h3>
        //                 <p>{res.category}</p>
        //                 <p>{res.location}</p>
        //                 <p>{res.ratingTime}</p>
        //                 <p>{res.offer}</p>
        //                 <a href={res.link} target="_blank" rel="noopener noreferrer">View</a>
        //                 <button onClick={() => handleFeedback(res.restaurantName)}>I choose this</button>
        //             </div>
        //         ))}
        //     </div>

        //     {recommendData.ruleBasedDishes && (
        //         <div className="rule-based-dishes">
        //             <h3>Suggested Dishes Based on Your Preferences</h3>
        //             <ul>
        //                 {recommendData.ruleBasedDishes.map((item, index) => (
        //                     <li key={index}>
        //                         {item.dish} — Score: {item.score}
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     )}

        // </div>






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
                    <div className="recommendation-content">
                        <div className="recommendation-left">
                            <h2 className="dish-title">{recommendData.dish}</h2>
                            <div className="cuisine-badge-single">{formData.cuisines}</div>
                            <p className="dish-description">Perfect for your happy mood and heavy craving</p>

                            <div className="dish-stats">
                                {/* <div className="stat-item">
                                    <span className="stat-icon">🔥</span>
                                    <span>{mockRecommendations.calories} cal</span>
                                </div> */}
                                <div className="stat-item">
                                    <span className="stat-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="custom-clock-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </span>
                                    <span>{formData.timeNeed} min</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="like-button">
                                    <span style={{ display: 'flex' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="thumbs-up-icon">
                                            <path d="M7 10v12"></path>
                                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                                        </svg>
                                    </span>
                                    Like
                                </button>
                                <button className="dislike-button">
                                    <span style={{ display: 'flex' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="thumbs-down-icon">
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

                    <button className="find-restaurants-button">Find Restaurants Serving This</button>
                </div>

                {/* Restaurant Recommendations */}
                <div className="restaurants-section">
                    <h3>Available at these restaurants</h3>
                    <div className="restaurants-grid">
                        {recommendData.recommendation.map((restaurant, index) => (
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#facc15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-star">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            </span>
                                            <span>{restaurant.ratingTime}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-map-pin">
                                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                                    <circle cx="12" cy="10" r="3"></circle>
                                                </svg>
                                            </span>
                                            <span>{restaurant.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-tag">
                                                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                                </svg>
                                            </span>
                                            <span>{restaurant.category}</span>
                                        </div>
                                    </div>
                                    <div className="restaurant-actions">
                                        <button className="view-button" onClick={() => window.open(restaurant.link, "_blank")}>
                                            <span className="button-icon">🔗</span>
                                            View
                                        </button>
                                        <button className="choose-button" onClick={() => handleFeedback(restaurant.restaurantName)}>
                                            Choose This
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Rule-based suggestions */}
                {recommendData.ruleBasedDishes && (
                    <div className="other-dishes-section">
                        <div className="section-header">
                            <span className="section-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-utensils">
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-tag-small">
                                                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
                                                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                                </svg>
                                            </span>
                                            {item.cuisines}
                                        </span>
                                        <span className="dish-detail">
                                            <span className="detail-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon-clock-small">
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
            </div>
        </div>
    );
}

export default RecommendationsList;