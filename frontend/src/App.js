import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from "./pages/MainPage";

import './styles.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route path="/main" element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    } />
                    {/* RestaurantDetails is rendered within MainPage to keep layout consistent */}
                    
                    {/* Redirect root to main page if authenticated, otherwise to login */}
                    <Route path="/" element={<Navigate to="/main" replace />} />
                    
                    {/* Catch all route - redirect to main */}
                    <Route path="*" element={<Navigate to="/main" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
