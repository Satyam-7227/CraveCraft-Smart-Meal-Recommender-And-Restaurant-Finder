import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../css/Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      fetchAnalyticsData(user.email);
    } else {
      setLoading(false);
      setError('Please log in to view analytics');
    }
  }, [user]);

  const fetchAnalyticsData = async (userEmail) => {
    try {
      setLoading(true);
      setNoData(false);
      
      // Fetch only user's personal history data
      const historyResponse = await axios.get(`http://localhost:5000/api/history?email=${userEmail}`);
      const historyData = historyResponse.data.history;

      // Check if user has any history data
      if (!historyData || historyData.length === 0) {
        setNoData(true);
        setAnalyticsData(null);
        setLoading(false);
        return;
      }

      // Process only user's personal data for charts
      const processedData = processDataForCharts(historyData);
      console.log('Processed user data:', processedData);
      setAnalyticsData(processedData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const processDataForCharts = (historyData) => {
    // Process only user's personal data
    const moodCounts = {};
    const dietCounts = {};
    const cuisineCounts = {};

    // Process user's personal history data
    historyData.forEach(item => {
      // Count moods from user's choices
      if (item.mood && item.mood !== 'N/A') {
        moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
      }

      // Count diets from user's choices
      if (item.diet && item.diet !== 'N/A') {
        dietCounts[item.diet] = (dietCounts[item.diet] || 0) + 1;
      }

      // Count cuisines from user's choices
      if (item.cuisines && item.cuisines !== 'N/A') {
        if (Array.isArray(item.cuisines)) {
          item.cuisines.forEach(cuisine => {
            cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
          });
        } else {
          cuisineCounts[item.cuisines] = (cuisineCounts[item.cuisines] || 0) + 1;
        }
      }
    });

    return {
      moodData: {
        labels: Object.keys(moodCounts),
        datasets: [{
          data: Object.values(moodCounts),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      dietData: {
        labels: Object.keys(dietCounts),
        datasets: [{
          label: 'Your Diet Choices',
          data: Object.values(dietCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderWidth: 1
        }]
      },
      cuisineData: {
        labels: Object.keys(cuisineCounts).slice(0, 6), // Top 6 cuisines
        datasets: [{
          data: Object.values(cuisineCounts).slice(0, 6),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        color: '#333',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading your personal analytics...</div>
      </div>
    );
  }

  // Show login required message
  if (error === 'Please log in to view analytics') {
    return (
      <div className="analytics-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Show no data message if user has no history
  if (noData) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Your Food Analytics</h1>
          <p>Personal insights into your food preferences</p>
        </div>
        <div className="no-data-message">
          <h3>No Data Available Yet</h3>
          <p>You haven't made any food recommendations yet. Start using the app to see your personal analytics!</p>
        </div>
      </div>
    );
  }

  // Show error message if API failed
  if (error && !analyticsData) {
    return (
      <div className="analytics-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Ensure we have data to display
  if (!analyticsData) {
    console.log('No analytics data available');
    return (
      <div className="analytics-container">
        <div className="error-message">No analytics data available</div>
      </div>
    );
  }

  console.log('Rendering charts with user data:', analyticsData);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Your Food Analytics</h1>
        <p>Personal insights into your food preferences and patterns</p>
      </div>

      <div className="charts-grid">
        {/* Mood Distribution - Shows when user wants food */}
        <div className="chart-card">
          <h3>When You Want Food</h3>
          <div className="chart-container">
            <Pie 
              data={analyticsData.moodData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: 'Your Mood-Food Patterns' }
                }
              }}
            />
          </div>
          <div className="chart-insight">
            <p>💡 <strong>Insight:</strong> This shows your emotional eating patterns. 
            When you're in these moods, you're most likely to seek food recommendations.</p>
          </div>
        </div>

        {/* Diet Preferences - Shows user's dietary choices */}
        <div className="chart-card">
          <h3>Your Diet Choices</h3>
          <div className="chart-container">
            <Bar 
              data={analyticsData.dietData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: 'Your Dietary Preferences' }
                }
              }}
            />
          </div>
          <div className="chart-insight">
            <p>💡 <strong>Insight:</strong> This reveals your dietary preferences over time. 
            Track how your choices evolve and maintain consistency with your health goals.</p>
          </div>
        </div>

        {/* Cuisine Preferences - Shows user's favorite cuisines */}
        <div className="chart-card">
          <h3>Your Favorite Cuisines</h3>
          <div className="chart-container">
            <Doughnut 
              data={analyticsData.cuisineData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { display: true, text: 'Your Cuisine Preferences' }
                }
              }}
            />
          </div>
          <div className="chart-insight">
            <p>💡 <strong>Insight:</strong> Discover your true cuisine preferences based on your actual choices. 
            This helps you explore new restaurants and dishes within your favorite styles.</p>
          </div>
        </div>
      </div>

      <div className="analytics-summary">
        <h3>Your Personal Insights</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <h4>Most Common Mood</h4>
            <p>{analyticsData?.moodData?.labels[0] || 'Not enough data'}</p>
            <small>When you seek food most often</small>
          </div>
          <div className="insight-item">
            <h4>Preferred Diet</h4>
            <p>{analyticsData?.dietData?.labels[0] || 'Not enough data'}</p>
            <small>Your most chosen dietary option</small>
          </div>
          <div className="insight-item">
            <h4>Top Cuisine</h4>
            <p>{analyticsData?.cuisineData?.labels[0] || 'Not enough data'}</p>
            <small>Your favorite cuisine style</small>
          </div>
          <div className="insight-item">
            <h4>Total Recommendations</h4>
            <p>{analyticsData?.moodData?.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0}</p>
            <small>Based on your choices</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;