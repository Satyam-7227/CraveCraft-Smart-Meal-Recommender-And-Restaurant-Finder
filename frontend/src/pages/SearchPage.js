import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import LazyLoadingDemo from '../components/LazyLoadingDemo';
import '../css/SearchPage.css';

function SearchPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [menuLoading, setMenuLoading] = useState(false);
    
    // Lazy loading states
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
    const [displayCount, setDisplayCount] = useState(20);
    
    // Refs for intersection observer
    const observerRef = useRef();
    const loadingRef = useRef();
    const searchTimeoutRef = useRef();

    // Lazy loading configuration
    const ITEMS_PER_PAGE = 20;
    const LAZY_LOAD_THRESHOLD = 5; // Load more when 5 items away from end

    // Intersection Observer for lazy loading
    const lastRestaurantRef = useCallback(node => {
        if (loading) return;
        
        if (observerRef.current) observerRef.current.disconnect();
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                loadMoreRestaurants();
            }
        });
        
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, isLoadingMore]);

    // Load more restaurants for lazy loading
    const loadMoreRestaurants = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        
        setIsLoadingMore(true);
        
        try {
            // Simulate API delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const nextPage = Math.ceil(displayedRestaurants.length / ITEMS_PER_PAGE) + 1;
            
            if (nextPage <= totalPages) {
                const response = await axios.get('http://localhost:5000/api/restaurants', {
                    params: {
                        page: nextPage,
                        limit: ITEMS_PER_PAGE,
                        search: searchTerm.trim(),
                        category: selectedCategory,
                        location: selectedLocation
                    }
                });
                
                if (response.data.restaurants.length > 0) {
                    setDisplayedRestaurants(prev => [...prev, ...response.data.restaurants]);
                    setCurrentPage(nextPage);
                }
            }
            
            setHasMore(nextPage < totalPages);
        } catch (err) {
            console.error('Error loading more restaurants:', err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, hasMore, displayedRestaurants.length, totalPages, searchTerm, selectedCategory, selectedLocation]);

    // Fetch restaurants data with improved search and lazy loading
    const fetchRestaurants = async (page = 1, search = '', category = '', location = '', reset = true) => {
        try {
            setLoading(true);
            setError(null);
            
            // Clean and prepare search term for better matching
            let cleanSearch = search.trim();
            if (cleanSearch) {
                cleanSearch = cleanSearch.toLowerCase().replace(/\s+/g, ' ');
            }
            
            const params = {
                page: page,
                limit: ITEMS_PER_PAGE,
                search: cleanSearch,
                category: category,
                location: location
            };

            const response = await axios.get('http://localhost:5000/api/restaurants', { params });
            
            // If no results with current filters, try with just search term
            if (response.data.restaurants.length === 0 && cleanSearch && (category || location)) {
                console.log('No results with filters, trying search-only...');
                const searchOnlyResponse = await axios.get('http://localhost:5000/api/restaurants', {
                    params: {
                        page: page,
                        limit: ITEMS_PER_PAGE,
                        search: cleanSearch
                    }
                });
                
                if (searchOnlyResponse.data.restaurants.length > 0) {
                    const restaurants = searchOnlyResponse.data.restaurants;
                    setDisplayedRestaurants(restaurants);
                    setAllRestaurants(restaurants);
                    setTotalPages(searchOnlyResponse.data.pagination.total_pages);
                    setCurrentPage(page);
                    setHasMore(page < searchOnlyResponse.data.pagination.total_pages);
                    setError(null);
                    return;
                }
            }
            
            const restaurants = response.data.restaurants;
            
            if (reset) {
                setDisplayedRestaurants(restaurants);
                setAllRestaurants(restaurants);
            } else {
                setDisplayedRestaurants(prev => [...prev, ...restaurants]);
                setAllRestaurants(prev => [...prev, ...restaurants]);
            }
            
            setTotalPages(response.data.pagination.total_pages);
            setCurrentPage(page);
            setHasMore(page < response.data.pagination.total_pages);
            setError(null);
        } catch (err) {
            console.error('Error fetching restaurants:', err);
            setError('Failed to load restaurants');
            setRestaurants([]);
            setDisplayedRestaurants([]);
            setAllRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories and locations with limited choices
    const fetchFilters = async () => {
        try {
            const [categoriesRes, locationsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/restaurants/categories'),
                axios.get('http://localhost:5000/api/restaurants/locations')
            ]);
            
            // Limit categories to most common ones (max 15)
            const limitedCategories = categoriesRes.data.categories ? 
                categoriesRes.data.categories.slice(0, 15) : [];
            setCategories(limitedCategories);
            
            // Limit locations to most common ones (max 20)
            const limitedLocations = locationsRes.data.locations ? 
                locationsRes.data.locations.slice(0, 20) : [];
            setLocations(limitedLocations);
        } catch (err) {
            console.error('Error fetching filters:', err);
        }
    };

    // Fetch restaurant menu
    const fetchRestaurantMenu = async (restaurantName) => {
        if (!restaurantName) {
            console.error('No restaurant name provided');
            setError('Invalid restaurant name');
            return;
        }
        
        try {
            setMenuLoading(true);
            setError(null);
            
            const response = await axios.get('http://localhost:5000/api/restaurant/details', {
                params: { name: restaurantName }
            });
            
            if (response.data && response.data.menu) {
                setMenuData(Array.isArray(response.data.menu) ? response.data.menu : []);
            } else {
                setMenuData([]);
            }
            
            if (response.data && response.data.restaurant) {
                setSelectedRestaurant(response.data.restaurant);
            } else {
                setSelectedRestaurant(null);
            }
            
            setShowMenu(true);
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError('Failed to load restaurant menu');
            setMenuData([]);
            setSelectedRestaurant(null);
        } finally {
            setMenuLoading(false);
        }
    };

    // Debounced search with lazy loading
    const handleSearch = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setCurrentPage(1);
            setHasMore(true);
            fetchRestaurants(1, searchTerm, selectedCategory, selectedLocation, true);
        }, 300);
    }, [searchTerm, selectedCategory, selectedLocation]);

    // Handle search on Enter key
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            setCurrentPage(1);
            setHasMore(true);
            fetchRestaurants(1, searchTerm, selectedCategory, selectedLocation, true);
        }
    };

    // Handle filter changes
    const handleFilterChange = useCallback(() => {
        setCurrentPage(1);
        setHasMore(true);
        fetchRestaurants(1, searchTerm, selectedCategory, selectedLocation, true);
    }, [searchTerm, selectedCategory, selectedLocation]);

    // Handle pagination (for manual navigation)
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setHasMore(true);
        fetchRestaurants(page, searchTerm, selectedCategory, selectedLocation, true);
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedLocation('');
        setCurrentPage(1);
        setHasMore(true);
        fetchRestaurants(1, '', '', '', true);
    };

    // Close menu modal
    const closeMenu = () => {
        setShowMenu(false);
        setSelectedRestaurant(null);
        setMenuData([]);
    };

    // Extract rating from ratingTime string
    const extractRating = (ratingTime) => {
        if (!ratingTime || ratingTime === 'N/A') return 'N/A';
        try {
            return ratingTime.split(' ')[0];
        } catch {
            return 'N/A';
        }
    };

    // Extract time from ratingTime string
    const extractTime = (ratingTime) => {
        if (!ratingTime || ratingTime === 'N/A') return 'N/A';
        try {
            const parts = ratingTime.split(' ');
            if (parts.length >= 3) {
                return parts.slice(2).join(' ');
            }
            return 'N/A';
        } catch {
            return 'N/A';
        }
    };

    // Render restaurant card with lazy loading ref
    const renderRestaurantCard = (restaurant, index) => {
        const isLast = index === displayedRestaurants.length - 1;
        
        return (
            <div 
                key={restaurant && restaurant.id ? restaurant.id : index} 
                className="restaurant-card"
                ref={isLast ? lastRestaurantRef : null}
            >
                <div className="restaurant-image">
                    {restaurant && restaurant.image && restaurant.image !== 'N/A' ? (
                        <img src={restaurant.image} alt={restaurant.name || 'Restaurant'} />
                    ) : (
                        <div className="placeholder-image">
                            <span>🍽️</span>
                        </div>
                    )}
                    {restaurant && restaurant.offer && restaurant.offer !== 'N/A' && (
                        <div className="offer-badge">
                            {restaurant.offer}
                        </div>
                    )}
                </div>

                <div className="restaurant-info">
                    <h3 className="restaurant-name search-page-restaurant-name">
                        {restaurant && restaurant.name ? restaurant.name : 'Unnamed Restaurant'}
                    </h3>

                    <div className="restaurant-meta">
                        <div className="rating-time-row">
                            <span className="rating">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                {extractRating(restaurant && restaurant.ratingTime)}
                            </span>
                            <span className="time">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                                {extractTime(restaurant && restaurant.ratingTime)}
                            </span>
                            <span className="location">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span className="location-text">
                                    {restaurant && restaurant.location ? restaurant.location : 'Location N/A'}
                                </span>
                            </span>
                        </div>
                        
                        <div className="categories-section">
                            <div className="categories-truncated">
                                <span className="category-badge">
                                    {restaurant && restaurant.category ? restaurant.category : 'Category N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="restaurant-actions">
                        <button
                            onClick={() => restaurant && restaurant.name ? fetchRestaurantMenu(restaurant.name) : null}
                            className="view-menu-btn"
                            disabled={!restaurant || !restaurant.name}
                        >
                            View Menu
                        </button>
                        {restaurant && restaurant.link && restaurant.link !== 'N/A' && (
                            <a
                                href={restaurant.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="visit-site-btn"
                            >
                                Visit Site
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchRestaurants();
        fetchFilters();
        
        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Effect for search and filter changes
    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    if (loading && (!displayedRestaurants || displayedRestaurants.length === 0)) {
        return (
            <div className="search-page-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading restaurants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-page-container">
            {/* Header Section */}
            <div className="search-header">
                <div className="header-content">
                    <h1>Restaurant Finder</h1>
                    <p>Discover amazing restaurants and explore their menus</p>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="search-filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search restaurants by name, cuisine, or dish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                    <button onClick={handleSearch} className="search-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="21 21l-4.35-4.35" />
                        </svg> Search
                    </button>
                </div>

                <div className="filters-row">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            handleFilterChange();
                        }}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories && Array.isArray(categories) && categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            handleFilterChange();
                        }}
                        className="filter-select"
                    >
                        <option value="">All Locations</option>
                        {locations && Array.isArray(locations) && locations.map((location, index) => (
                            <option key={index} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>

                    <button onClick={clearFilters} className="clear-filters-btn">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Results Count */}
            {/* <div className="results-info">
                <span>Found {displayedRestaurants && Array.isArray(displayedRestaurants) ? displayedRestaurants.length : 0} restaurants</span>
                {hasMore && (
                    <span className="lazy-load-info">
                        • Scroll down to load more
                    </span>
                )}
            </div> */}

            {/* Lazy Loading Demo */}
            {displayedRestaurants.length === 0 && !loading && !error && (
                <LazyLoadingDemo />
            )}

            {/* Restaurants Grid with Lazy Loading */}
            <div className="restaurants-grid">
                {displayedRestaurants && Array.isArray(displayedRestaurants) && displayedRestaurants.map((restaurant, index) => 
                    renderRestaurantCard(restaurant, index)
                )}
            </div>

            {/* Lazy Loading Indicator */}
            {isLoadingMore && (
                <div className="lazy-loading-indicator" ref={loadingRef}>
                    <div className="loading-spinner"></div>
                    <p>Loading more restaurants...</p>
                </div>
            )}

            {/* End of Results */}
            {!hasMore && displayedRestaurants.length > 0 && (
                <div className="end-of-results">
                    <p>🎉 You've reached the end! No more restaurants to load.</p>
                </div>
            )}

            {/* Manual Pagination (Alternative to lazy loading) */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        ← Previous
                    </button>

                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Restaurant Menu Modal */}
            {showMenu && (
                <div className="menu-modal-overlay" onClick={closeMenu}>
                    <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedRestaurant?.restaurantName}</h2>
                            <button onClick={closeMenu} className="close-btn">×</button>
                        </div>

                        <div className="restaurant-details search-page-restaurant-details">
                            <div className="restaurant-summary">
                                <span className="rating">⭐ {extractRating(selectedRestaurant?.ratingTime)}</span>
                                <span className="category">{selectedRestaurant?.category}</span>
                                <span className="location">📍 {selectedRestaurant?.location}</span>
                            </div>
                        </div>

                        <div className="menu-section">
                            <h3>Menu</h3>
                            {menuLoading ? (
                                <div className="menu-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Loading menu...</p>
                                </div>
                            ) : (
                                <div className="menu-items">
                                    {menuData && Array.isArray(menuData) && menuData.length > 0 ? (
                                        menuData.map((item, index) => (
                                            <div key={index} className="menu-item">
                                                <div className="menu-item-image">
                                                    {item && item.imageUrl && item.imageUrl !== 'N/A' ? (
                                                        <img src={item.imageUrl} alt={item.name || 'Menu Item'} />
                                                    ) : (
                                                        <div className="placeholder-image">
                                                            <span>🍽️</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="menu-item-details">
                                                    <h4 className="item-name">{item && item.name ? item.name : 'Unnamed Item'}</h4>
                                                    {item && item.description && (
                                                        <p className="item-description">{item.description}</p>
                                                    )}
                                                    <div className="item-price">
                                                        <span className="price">₹{item && item.price ? item.price : 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-menu">
                                            <p>No menu items available for this restaurant.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchPage;