import React from 'react';

const LazyLoadingDemo = () => {
    return (
        <div className="lazy-loading-demo">
            <div className="demo-header">
                <h3>🚀 Lazy Loading Features</h3>
                <p>Experience smooth, infinite scrolling with automatic content loading</p>
            </div>
            
            <div className="demo-features">
                <div className="feature-item">
                    <div className="feature-icon">👁️</div>
                    <div className="feature-content">
                        <h4>Intersection Observer</h4>
                        <p>Automatically detects when you're near the end and loads more content</p>
                    </div>
                </div>
                
                <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <div className="feature-content">
                        <h4>Performance Optimized</h4>
                        <p>Only loads 20 restaurants at a time for faster initial page load</p>
                    </div>
                </div>
                
                <div className="feature-item">
                    <div className="feature-icon">🔄</div>
                    <div className="feature-content">
                        <h4>Seamless Loading</h4>
                        <p>Smooth animations and loading indicators for better user experience</p>
                    </div>
                </div>
                
                <div className="feature-item">
                    <div className="feature-icon">📱</div>
                    <div className="feature-content">
                        <h4>Mobile Friendly</h4>
                        <p>Optimized for touch devices with responsive design</p>
                    </div>
                </div>
            </div>
            
            <div className="demo-instructions">
                <h4>How to Use:</h4>
                <ol>
                    <li>Scroll down to see restaurants</li>
                    <li>When you reach the bottom, more will automatically load</li>
                    <li>Use search and filters to find specific restaurants</li>
                    <li>Manual pagination is also available as an alternative</li>
                </ol>
            </div>
        </div>
    );
};

export default LazyLoadingDemo;
