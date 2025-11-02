import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather } from '../../redux/slices/weatherSlice';
import CityCard from './CityCard';
import SearchBar from '../Search/SearchBar';
import './Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.cities);
  const weatherData = useSelector(state => state.weather.currentWeather);
  const loading = useSelector(state => state.weather.loading);
  const error = useSelector(state => state.weather.error);

  // Fetch weather data for favorite cities on mount
  useEffect(() => {
    favorites.forEach(city => {
      dispatch(fetchCurrentWeather(city));
    });
  }, [dispatch, favorites]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>My Weather Dashboard</h2>
          <p className="subtitle">Track weather conditions for your favorite cities</p>
        </div>
      </div>

      <SearchBar />

      {error && (
        <div className="error-banner">
          <strong>⚠️ API Key Issue</strong>
          <p>{error}</p>
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.9)', borderRadius: '4px' }}>
            <strong>How to fix:</strong>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>Go to <a href="https://home.openweathermap.org/api_keys" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>OpenWeatherMap API Keys</a></li>
              <li>Check if your key is <strong>Active</strong> (new keys take 1-2 hours to activate)</li>
              <li>If needed, generate a new API key</li>
              <li>Update the <code>.env</code> file with your key</li>
              <li>Restart the app: Stop (Ctrl+C) and run <code>npm start</code></li>
            </ol>
          </div>
        </div>
      )}

      <div className="city-grid">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <p>No favorite cities yet!</p>
            <p>Use the search bar above to add your first city.</p>
          </div>
        ) : (
          favorites.map(city => (
            <CityCard
              key={city}
              cityName={city}
              weatherData={weatherData[city]}
              loading={loading && !weatherData[city]}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
