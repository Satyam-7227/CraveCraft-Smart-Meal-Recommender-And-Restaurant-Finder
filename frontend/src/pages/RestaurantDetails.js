import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../css/RestaurantDetails.css';

function RestaurantDetails({ restaurantName: restaurantNameProp, predictedCategory: predictedCategoryProp, formData: formDataProp, onBack }) {
    const navigate = useNavigate();
    const { name } = useParams();
    const { state } = useLocation();

    const restaurantName = restaurantNameProp || decodeURIComponent(name || state?.restaurantName || "");
    const predictedCategory = predictedCategoryProp || state?.predictedCategory || "";
    const formData = formDataProp || state?.formData || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:5000/api/restaurant/details`, {
                    params: { name: restaurantName }
                });
                setRestaurant(res.data.restaurant);
                setMenu(res.data.menu || []);
            } catch (e) {
                setError(e?.response?.data?.error || e.message || "Failed to load details");
            } finally {
                setLoading(false);
            }
        }
        if (restaurantName) fetchDetails();
    }, [restaurantName]);

    const filteredMenu = useMemo(() => {
        if (!query) return menu;
        const q = query.toLowerCase();
        return menu.filter(m =>
            (m.name || "").toLowerCase().includes(q) ||
            (m.description || "").toLowerCase().includes(q)
        );
    }, [menu, query]);

    function addDish(dishName) {
        if (!selectedDishes.includes(dishName)) {
            setSelectedDishes([...selectedDishes, dishName]);
        }
    }

    function removeDish(dishName) {
        setSelectedDishes(selectedDishes.filter(d => d !== dishName));
    }

    async function handleOrderNow() {
        if (!restaurantName || selectedDishes.length === 0) return;
        setSubmitting(true);
        setSuccessMessage("");
        try {
            const payload = {
                ...formData,
                selectedRestaurant: restaurantName,
                selectedDishes,
                dish_feedback: 'like',
                feedback_type: 'general_recommendation'
            };
            await axios.post("http://localhost:5000/api/feedback", payload);
            setSuccessMessage("✅ Order submitted successfully! Redirecting to new recommendation form...");
            
            // Redirect to form submission page after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (e) {
            setError(e?.response?.data?.error || e.message || "Failed to submit");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="meal-recommender recommendations-view">
            <div className="container-wide restaurant-details-page">
                <div className="restaurant-header">
                    <button onClick={() => (onBack ? onBack() : navigate(-1))} className="back-button">← Back</button>
                    <h2 className="restaurant-title">{restaurantName}</h2>
                </div>

                {predictedCategory && (
                    <div className="predicted-area">Predicted area: <strong>{predictedCategory}</strong></div>
                )}

                {loading && <div className="info-text">Loading restaurant details…</div>}
                {error && !loading && <div className="error-text">{error}</div>}

                {!loading && restaurant && (
                    <div className="restaurant-hero">
                        <img
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.restaurantName}
                            className="restaurant-hero-image"
                        />
                        <div className="restaurant-hero-info">
                            <div className="hero-name">{restaurant.restaurantName}</div>
                            <div className="hero-line">{restaurant.location}</div>
                            <div className="hero-line">{restaurant.ratingTime}</div>
                            <div className="hero-line">{restaurant.category}</div>
                            {restaurant.link && (
                                <a href={restaurant.link} target="_blank" rel="noopener noreferrer" className="external-link">Open in Swiggy ↗</a>
                            )}
                        </div>
                    </div>
                )}

                {!loading && (
                    <div>
                        <div className="menu-search">
                            <input
                                type="text"
                                placeholder="Search dishes…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="menu-search-input"
                                name="search"
                            />
                        </div>

                        <div className="menu-grid">
                            {filteredMenu.map((item, idx) => (
                                <div key={`${item.name}-${idx}`} className="menu-card">
                                    <div className="menu-card-content">
                                        <div className="menu-card-info">
                                            <div className="menu-card-title">{item.name}</div>
                                            {item.description && (
                                                <div className="menu-card-desc">{item.description}</div>
                                            )}
                                            {item.price && (
                                                <div className="menu-card-price">₹ {item.price}</div>
                                            )}
                                        </div>
                                        <div className="menu-card-actions">
                                            {item.imageUrl && (
                                                <div className="menu-card-thumb">
                                                    <img src={item.imageUrl} alt={item.name} />
                                                </div>
                                            )}
                                            {selectedDishes.includes(item.name) ? (
                                                <button className="dislike-button" onClick={() => removeDish(item.name)}>Remove</button>
                                            ) : (
                                                <button className="like-button add-button" onClick={() => addDish(item.name)}>Add</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="restaurant-sticky-footer">
                    <div className="footer-content">
                        <div className="selected-dishes">
                            {selectedDishes.length === 0 ? (
                                <span className="muted-text">No dishes selected</span>
                            ) : (
                                selectedDishes.map(d => (
                                    <span key={d} className="selected-pill">
                                        {d}
                                        <button className="pill-remove" onClick={() => removeDish(d)}>×</button>
                                    </span>
                                ))
                            )}
                        </div>
                        <div className="footer-actions">
                            <button className="back-button" onClick={() => (onBack ? onBack() : navigate(-1))}>Back</button>
                            <button className="find-restaurants-button order-now-button" disabled={submitting || selectedDishes.length === 0} onClick={handleOrderNow}>
                                {submitting ? "Submitting…" : "Order now"}
                            </button>
                        </div>
                    </div>
                    {successMessage && (
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <div className="success-content">
                                <div className="success-title">Success!</div>
                                <div className="success-text">{successMessage}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RestaurantDetails;


