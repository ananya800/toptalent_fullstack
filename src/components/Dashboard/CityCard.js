import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { formatTemperature, getWeatherIconUrl } from '../../utils/helpers';
import './CityCard.css';

function CityCard({ cityName, weatherData, loading }) {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector(state => state.settings.temperatureUnit);
  const isFavorite = useSelector(state => state.favorites.cities.includes(cityName));

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite(cityName));
  };

  if (loading) {
    return (
      <div className="city-card loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <Link to={`/city/${cityName}`} className="city-card">
      <button 
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        onClick={handleToggleFavorite}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <div className="city-header">
        <h3>{weatherData.name}</h3>
        <p className="country">{weatherData.sys.country}</p>
      </div>

      <div className="weather-icon">
        <img 
          src={getWeatherIconUrl(weatherData.weather[0].icon)} 
          alt={weatherData.weather[0].description}
        />
      </div>

      <div className="temperature">
        {formatTemperature(weatherData.main.temp, temperatureUnit)}
      </div>

      <div className="weather-description">
        {weatherData.weather[0].description}
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">
            {formatTemperature(weatherData.main.feels_like, temperatureUnit)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{Math.round(weatherData.wind.speed)} m/s</span>
        </div>
      </div>
    </Link>
  );
}

export default CityCard;
