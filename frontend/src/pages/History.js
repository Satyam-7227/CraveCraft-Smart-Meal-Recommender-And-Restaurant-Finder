import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../css/History.css';

function History() {
    const { user } = useAuth();
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.email) {
            setLoading(true);
            axios.get("http://localhost:5000/api/history", { 
                params: { email: user.email }
            })
            .then((response) => {
                console.log("History data received:", response.data.history);
                setHistoryData(response.data.history);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to load history data');
                setLoading(false);
            });
        }
    }, [user]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMoodIcon = (mood) => {
        const moodIcons = {
            'Happy': '😊',
            'Sad': '😢',
            'Tired': '😴',
            'Stressed': '😰',
            'Excited': '🤩'
        };
        return moodIcons[mood] || '😐';
    };

    const getCuisineColor = (cuisine) => {
        const colors = {
            'North Indian': '#f59e0b',
            'South Indian': '#10b981',
            'Chinese': '#ef4444',
            'Fast Food': '#8b5cf6',
            'Snacks': '#06b6d4',
            'Dessert': '#ec4899'
        };
        return colors[cuisine] || '#6b7280';
    };

    const getFeedbackIcon = (feedback) => {
        if (feedback === 'like') {
            return (
                <div className="feedback-badge like">
                    <span className="feedback-icon">👍</span>
                    <span className="feedback-text">Liked</span>
                </div>
            );
        } else if (feedback === 'dislike') {
            return (
                <div className="feedback-badge dislike">
                    <span className="feedback-icon">👎</span>
                    <span className="feedback-text">Disliked</span>
                </div>
            );
        }
        return null;
    };

    const renderDishInfo = (entry) => {
        if (entry.dishType === "single" && entry.selectedDish && entry.selectedDish !== "N/A") {
            return (
                <div className="dish-info">
                    <h3 className="dish-name">{entry.selectedDish}</h3>
                    <div className="dish-type-badge single">Single Dish</div>
                </div>
            );
        } else if (entry.dishType === "multiple" && entry.selectedDishes && entry.selectedDishes !== "N/A") {
            return (
                <div className="dish-info">
                    <h3 className="dish-name">Multiple Dishes Selected</h3>
                    <div className="dish-type-badge multiple">Multiple Dishes</div>
                    <div className="selected-dishes-list">
                        {Array.isArray(entry.selectedDishes) ? (
                            entry.selectedDishes.map((dish, idx) => (
                                <div key={idx} className="selected-dish-item">
                                    <span className="dish-icon">🍽️</span>
                                    <span className="dish-text">{dish}</span>
                                </div>
                            ))
                        ) : (
                            <div className="selected-dish-item">
                                <span className="dish-icon">🍽️</span>
                                <span className="dish-text">{entry.selectedDishes}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="dish-info">
                    <h3 className="dish-name">No dish selected</h3>
                    <div className="dish-type-badge none">No Selection</div>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="history-container">
                <div className="history-header">
                    <h1>Your Meal History</h1>
                    <p>Track your past recommendations and choices</p>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your meal history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-container">
                <div className="history-header">
                    <h1>Your Meal History</h1>
                    <p>Track your past recommendations and choices</p>
                </div>
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <div className="header-content">
                    <h1>Your Meal History</h1>
                    <p>Track your past recommendations and choices</p>
                </div>
                <div className="history-stats">
                    <div className="stat-card">
                        <div className="stat-number">{historyData.length}</div>
                        <div className="stat-label">Total Meals</div>
                    </div>
                </div>
            </div>

            {historyData.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                            <path d="M7 2v20"></path>
                            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                        </svg>
                    </div>
                    <h3>No meal history yet</h3>
                    <p>Start by getting some recommendations to see your history here!</p>
                </div>
            ) : (
                <div className="history-grid">
                    {historyData.map((entry, index) => (
                        <div key={index} className="history-card">
                            <div className="card-header">
                                {renderDishInfo(entry)}
                                <div className="restaurant-row">
                                    <div className="restaurant-name">
                                        {entry.selectedRestaurant ? (
                                            <>
                                                <span className="restaurant-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 9L5 3H19L21 9V11C21 12.1 20.1 13 19 13C17.9 13 17 12.1 17 11C17 12.1 16.1 13 15 13C13.9 13 13 12.1 13 11C13 12.1 12.1 13 11 13C9.9 13 9 12.1 9 11C9 12.1 8.1 13 7 13C5.9 13 5 12.1 5 11C5 12.1 4.1 13 3 13V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M3 13V20C3 20.6 3.4 21 4 21H20C20.6 21 21 20.6 21 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </span>
                                                {entry.selectedRestaurant}
                                            </>
                                        ) : (
                                            <span className="no-restaurant">No restaurant selected</span>
                                        )}
                                    </div>
                                    <div className="mood-indicator">
                                        <span className="mood-emoji">{getMoodIcon(entry.mood)}</span>
                                        <span className="mood-text">{entry.mood}</span>
                                    </div>
                                </div>
                                {/* Show feedback if available */}
                                {entry.dish_feedback && (
                                    <div className="dish-feedback">
                                        {getFeedbackIcon(entry.dish_feedback)}
                                    </div>
                                )}
                            </div>

                            <div className="card-content">
                                <div className="preferences-grid">
                                    <div className="preference-item">
                                        <span className="preference-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <div className="preference-details">
                                            <span className="preference-label">Day Status</span>
                                            <span className="preference-value">{entry.dayStatus}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M8 8L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M16 8L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                        <div className="preference-details">
                                            <span className="preference-label">Craving</span>
                                            <span className="preference-value">{entry.craving}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M12 6C8 6 5 9 5 13V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V13C19 9 16 6 12 6Z" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M8 13C8 11 10 9 12 9C14 9 16 11 16 13" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </span>
                                        <div className="preference-details">
                                            <span className="preference-label">Diet</span>
                                            <span className="preference-value">{entry.diet}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <div className="preference-details">
                                            <span className="preference-label">Time</span>
                                            <span className="preference-value">{entry.timeNeed} mins</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cuisines-section">
                                    <span className="cuisines-label">Cuisines:</span>
                                    <div className="cuisine-tags">
                                        {entry.cuisines && entry.cuisines.length > 0 ? (
                                            entry.cuisines.map((cuisine, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="cuisine-tag"
                                                    style={{ backgroundColor: getCuisineColor(cuisine) }}
                                                >
                                                    {cuisine}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="no-cuisines">No cuisines specified</span>
                                        )}
                                    </div>
                                </div>

                                <div className="location-section">
                                    <span className="location-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5 7 1 12 1S21 5 21 10Z" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </span>
                                    <span className="location-text history-location-text">{entry.location || 'Location not specified'}</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="timestamp">
                                    <span className="timestamp-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    <span className="timestamp-text">
                                        {formatDate(entry.timestamp || Date.now())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;