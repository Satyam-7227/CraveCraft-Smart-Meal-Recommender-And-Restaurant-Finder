import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from "./pages/MainPage";

import './styles.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;
