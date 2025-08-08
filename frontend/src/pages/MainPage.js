import React, { useState } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import RecommendationsList from '../components/RecommendationsList';
import FilterForm from './FilterForm';
import SearchPage from './SearchPage';
import Analytics from './Analytics';
import History from './History';

import '../css/MainPage.css';

function MainPage() {
    const [activeTab, setActiveTab] = useState('recommend');
    const [recommendations, setRecommendation] = useState(null);
    const [formDataCache, setFormDataCache] = useState(null);
    const [currentView, setCurrentView] = useState("form")

    function handleRecommend(formData) {
        formData.email = "testuser@example.com"
        setFormDataCache(formData);
        setCurrentView('recommendations');
        axios.post("http://localhost:5000/api/recommend", formData)
            .then((response) => {
                // setRecommendation(response.data)
                const mlData = response.data;

                axios.post("http://localhost:5000/api/rule-based-recommend", formData)
                    .then((ruleResponse) => {
                        mlData.ruleBasedDishes = ruleResponse.data.ruleBasedDishes;

                        setRecommendation(mlData)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleBackToForm = () => {
        setCurrentView("form")
    }

    return (
        <div className='main'>
            <Navbar />

            {/* <div className='tab-buttons'>
                <button onClick={() => setActiveTab("recommend")} className={activeTab === 'recommend' ? 'active' : ''}>Recommendations</button>
                <button onClick={() => setActiveTab("search")} className={activeTab === 'search' ? 'active' : ''}>Restaurants</button>
                <button onClick={() => setActiveTab("analytics")} className={activeTab === 'analytics' ? 'active' : ''}>Analytics</button>
                <button onClick={() => setActiveTab("history")} className={activeTab === 'history' ? 'active' : ''}>History</button>
            </div> */}

            <div className="tab-container">
                <div className="tab-buttons">

                    <button key="recommend" onClick={() => setActiveTab("recommend")} className={`tab-button ${activeTab === 'recommend' ? 'active' : ''}`}>
                        <span className="tab-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"></path>
                                <path d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z" fill="currentColor" opacity="0.7"></path>
                                <path d="M5 15L5.5 17L7.5 17.5L5.5 18L5 20L4.5 18L2.5 17.5L4.5 17L5 15Z" fill="currentColor" opacity="0.7"></path>
                            </svg>
                        </span>
                        <span className="tab-label">Recommendations</span>
                        {activeTab === 'recommend' && <div className="active-indicator"></div>}
                    </button>
                    <button key="search" onClick={() => setActiveTab("search")} className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}>
                        <span className="tab-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"></path>
                            </svg>
                        </span>
                        <span className="tab-label">Restaurants</span>
                        {activeTab === 'search' && <div className="active-indicator"></div>}
                    </button>
                    <button key="analytics" onClick={() => setActiveTab("analytics")} className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}>
                        <span className="tab-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"></path>
                            </svg>
                        </span>
                        <span className="tab-label">Analytics</span>
                        {activeTab === 'analytics' && <div className="active-indicator"></div>}
                    </button>
                    <button key="history" onClick={() => setActiveTab("history")} className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}>
                        <span className="tab-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 20 10.5 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"></path>
                            </svg>
                        </span>
                        <span className="tab-label">History</span>
                        {activeTab === 'history' && <div className="active-indicator"></div>}
                    </button>

                </div>
            </div>

            <div className='tab-content'>
                {activeTab === 'recommend' &&
                    (<>
                        {currentView === 'form' && <FilterForm onRecommend={handleRecommend} />}
                        {recommendations && currentView === 'recommendations' && <RecommendationsList recommendData={recommendations} formData={formDataCache} onBack={handleBackToForm} />}
                    </>)
                }
                {activeTab === 'search' && <SearchPage />}
                {activeTab === 'analytics' && <Analytics />}
                {activeTab === 'history' && <History />}
            </div>
        </div>
    );
}

export default MainPage;