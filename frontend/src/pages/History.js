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
                    <div className="stat-card">
                        <div className="stat-number">
                            {historyData.filter(item => item.selectedDish).length}
                        </div>
                        <div className="stat-label">Choices Made</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {historyData.filter(item => item.dish_feedback).length}
                        </div>
                        <div className="stat-label">Feedbacks Given</div>
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
                                <div className="dish-info">
                                    <h3 className="dish-name">{entry.selectedDish || 'No dish selected'}</h3>
                                    <div className="restaurant-name">
                                        {entry.selectedRestaurant ? (
                                            <>
                                                <span className="restaurant-icon">🏪</span>
                                                {entry.selectedRestaurant}
                                            </>
                                        ) : (
                                            <span className="no-restaurant">No restaurant selected</span>
                                        )}
                                    </div>
                                    {/* Show feedback if available */}
                                    {entry.dish_feedback && (
                                        <div className="dish-feedback">
                                            {getFeedbackIcon(entry.dish_feedback)}
                                        </div>
                                    )}
                                </div>
                                <div className="mood-indicator">
                                    <span className="mood-emoji">{getMoodIcon(entry.mood)}</span>
                                    <span className="mood-text">{entry.mood}</span>
                                </div>
                            </div>

                            <div className="card-content">
                                <div className="preferences-grid">
                                    <div className="preference-item">
                                        <span className="preference-icon">📅</span>
                                        <div className="preference-details">
                                            <span className="preference-label">Day Status</span>
                                            <span className="preference-value">{entry.dayStatus}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">🍽️</span>
                                        <div className="preference-details">
                                            <span className="preference-label">Craving</span>
                                            <span className="preference-value">{entry.craving}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">🥗</span>
                                        <div className="preference-details">
                                            <span className="preference-label">Diet</span>
                                            <span className="preference-value">{entry.diet}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="preference-item">
                                        <span className="preference-icon">⏰</span>
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
                                    <span className="location-icon">📍</span>
                                    <span className="location-text">{entry.location || 'Location not specified'}</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="timestamp">
                                    <span className="timestamp-icon">🕒</span>
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