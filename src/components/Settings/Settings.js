import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleTemperatureUnit } from '../../redux/slices/settingsSlice';
import './Settings.css';

function Settings() {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector(state => state.settings.temperatureUnit);

  const handleToggleUnit = () => {
    dispatch(toggleTemperatureUnit());
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <Link to="/" className="back-button">← Back to Dashboard</Link>
          <h2>⚙️ Settings</h2>
          <p className="settings-subtitle">Customize your weather dashboard experience</p>
        </div>

        <div className="settings-section">
          <h3>Temperature Unit</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Temperature Display</label>
              <p className="setting-description">
                Choose how you want temperatures to be displayed
              </p>
            </div>
            <div className="toggle-container">
              <button
                className={`unit-button ${temperatureUnit === 'celsius' ? 'active' : ''}`}
                onClick={() => temperatureUnit !== 'celsius' && handleToggleUnit()}
              >
                °C Celsius
              </button>
              <button
                className={`unit-button ${temperatureUnit === 'fahrenheit' ? 'active' : ''}`}
                onClick={() => temperatureUnit !== 'fahrenheit' && handleToggleUnit()}
              >
                °F Fahrenheit
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="about-content">
            <p><strong>Weather Analytics Dashboard</strong></p>
            <p>Version 1.0.0</p>
            <p>Student Assignment Project - November 2025</p>
            <p style={{ marginTop: '1rem' }}>
              This application provides real-time weather data, forecasts, and 
              interactive visualizations for cities around the world.
            </p>
            <div className="tech-stack">
              <p><strong>Built with:</strong></p>
              <ul>
                <li>React 18</li>
                <li>Redux Toolkit</li>
                <li>Recharts</li>
                <li>OpenWeatherMap API</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Data & Privacy</h3>
          <div className="privacy-content">
            <p>
              • Weather data is cached for 60 seconds to reduce API calls<br/>
              • Favorites and preferences are stored locally in your browser<br/>
              • No personal data is collected or transmitted<br/>
              • All data is fetched securely from OpenWeatherMap API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
