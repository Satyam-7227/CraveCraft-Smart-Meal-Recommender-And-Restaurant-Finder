import React,{ useEffect, useState } from "react";
import axios from 'axios';

import '../css/History.css'

function History(){
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/history", { 
            params: { email: "testuser@example.com"}
        })
        .then((response) => {
            setHistoryData(response.data.history);
        })
        .catch((err) => {
            console.log(err);
        })
    },[]);

    return(
        <div className="history-container">
            <h2>Your Meal History</h2>
            {historyData.map((entry, index) => (
                <div key={index} className="history-card">
                    <h3>{entry.selectedDish}</h3>
                    <p><strong>Restaurant:</strong> {entry.selectedRestaurant}</p>
                    <p><strong>Mood:</strong> {entry.mood}</p>
                    <p><strong>Day Status:</strong> {entry.dayStatus}</p>
                    <p><strong>Craving:</strong> {entry.craving}</p>
                    <p><strong>Diet:</strong> {entry.diet}</p>
                    <p><strong>Cuisines:</strong> {entry.cuisines.join(", ")}</p>
                    <p><strong>Time:</strong> {entry.timeNeed} mins</p>
                    <p><strong>Location:</strong> {entry.location}</p>
                </div>
            ))}
        </div>
    );
}

export default History;