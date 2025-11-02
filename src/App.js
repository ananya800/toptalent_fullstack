import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Dashboard/Dashboard';
import DetailedView from './components/DetailedView/DetailedView';
import Settings from './components/Settings/Settings';
import LoginButton from './components/Auth/LoginButton';
import { refreshWeatherData } from './redux/slices/weatherSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.cities);
  const location = useLocation();

  // Auto-refresh weather data every 5 hours
  useEffect(() => {
    const interval = setInterval(() => {
      if (favorites.length > 0) {
        dispatch(refreshWeatherData(favorites));
      }
    }, 5 * 60 * 60 * 1000); // 5 hours in milliseconds

    return () => clearInterval(interval);
  }, [dispatch, favorites]);

  const showControls = location.pathname === '/';

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🌤️ Weather Analytics Dashboard</h1>
          <div className="header-actions">
            {showControls && (
              <Link to="/settings" className="nav-link">
                ⚙️ Settings
              </Link>
            )}
            <LoginButton />
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/city/:cityName" element={<DetailedView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Weather Analytics Dashboard © 2025 | Student Assignment Project</p>
        <p>Data provided by OpenWeatherMap API</p>
      </footer>
    </div>
  );
}

export default App;
