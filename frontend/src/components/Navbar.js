import React from "react";
import '../css/Navbar.css';

function Navbar() {
    return (
        // <div className="navbar">
        //     <div className="navbar-left">
        //         <span className="logo">Smart Meal</span>
        //     </div>
        //     <div className="navbar-right">
        //         <span className="welcome-text">Hii user</span>
        //         <button className="logout-button">Logout</button>
        //     </div>
        // </div>




        <div className="navbar">
            <div className="navbar-left">
                <div className="logo">
                    <span className="logo-icon">
                        <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"></path>
                            <path d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z" fill="currentColor"></path>
                            <path d="M5 15L5.5 17L7.5 17.5L5.5 18L5 20L4.5 18L2.5 17.5L4.5 17L5 15Z" fill="currentColor"></path>
                        </svg>
                    </span>
                    <span className="logo-text">Smart Meal</span>
                </div>
            </div>
            <div className="navbar-right">
                <div className="user-section">
                    <div className="user-avatar">
                        <span className="avatar-icon">👤</span>
                    </div>
                    <div className="user-info">
                        <span className="welcome-text">Welcome back</span>
                        <span className="user-name">John Doe</span>
                    </div>
                </div>
                <button className="logout-button">
                    <span className="logout-icon">
                        <svg className="logout-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7Z" fill="currentColor"></path>
                            <path d="M19 19H5V5H19V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V17H19V19Z" fill="currentColor"></path>
                        </svg>
                    </span>
                    Logout
                </button>
            </div>
        </div>
    );

}

export default Navbar;