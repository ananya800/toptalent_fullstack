import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecast } from '../../redux/slices/weatherSlice';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { formatTemperature, getWeatherIconUrl, getWindDirection } from '../../utils/helpers';
import ForecastChart from './ForecastChart';
import HourlyForecast from './HourlyForecast';
import './DetailedView.css';

function DetailedView() {
  const { cityName } = useParams();
  const dispatch = useDispatch();
  const weatherData = useSelector(state => state.weather.currentWeather[cityName]);
  const forecastData = useSelector(state => state.weather.forecasts[cityName]);
  const temperatureUnit = useSelector(state => state.settings.temperatureUnit);
  const isFavorite = useSelector(state => state.favorites.cities.includes(cityName));
  const loading = useSelector(state => state.weather.loading);

  useEffect(() => {
    dispatch(fetchCurrentWeather(cityName));
    dispatch(fetchForecast(cityName));
  }, [dispatch, cityName]);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(cityName));
  };

  if (loading && !weatherData) {
    return (
      <div className="detailed-view">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="detailed-view">
        <div className="error-container">
          <h2>City not found</h2>
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-view">
      <div className="detailed-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <button 
          className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
      </div>

      <div className="city-overview">
        <div className="overview-left">
          <h1>{weatherData.name}, {weatherData.sys.country}</h1>
          <div className="current-weather">
            <img 
              src={getWeatherIconUrl(weatherData.weather[0].icon)} 
              alt={weatherData.weather[0].description}
              className="large-weather-icon"
            />
            <div className="current-temp">
              {formatTemperature(weatherData.main.temp, temperatureUnit)}
            </div>
          </div>
          <p className="weather-description-large">
            {weatherData.weather[0].description}
          </p>
          <p className="feels-like">
            Feels like {formatTemperature(weatherData.main.feels_like, temperatureUnit)}
          </p>
        </div>

        <div className="overview-right">
          <div className="detail-grid">
            <div className="detail-box">
              <span className="detail-icon">🌡️</span>
              <span className="detail-label">High / Low</span>
              <span className="detail-value">
                {formatTemperature(weatherData.main.temp_max, temperatureUnit)} / {' '}
                {formatTemperature(weatherData.main.temp_min, temperatureUnit)}
              </span>
            </div>

            <div className="detail-box">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weatherData.main.humidity}%</span>
            </div>

            <div className="detail-box">
              <span className="detail-icon">💨</span>
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">
                {Math.round(weatherData.wind.speed)} m/s {getWindDirection(weatherData.wind.deg)}
              </span>
            </div>

            <div className="detail-box">
              <span className="detail-icon">🎚️</span>
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>

            <div className="detail-box">
              <span className="detail-icon">👁️</span>
              <span className="detail-label">Visibility</span>
              <span className="detail-value">
                {weatherData.visibility ? `${(weatherData.visibility / 1000).toFixed(1)} km` : 'N/A'}
              </span>
            </div>

            <div className="detail-box">
              <span className="detail-icon">☁️</span>
              <span className="detail-label">Cloudiness</span>
              <span className="detail-value">{weatherData.clouds.all}%</span>
            </div>
          </div>
        </div>
      </div>

      {forecastData && (
        <>
          <div className="forecast-section">
            <h2>📈 Temperature Trends</h2>
            <ForecastChart forecastData={forecastData} temperatureUnit={temperatureUnit} />
          </div>

          <div className="hourly-section">
            <h2>🕐 Hourly Forecast</h2>
            <HourlyForecast forecastData={forecastData} temperatureUnit={temperatureUnit} />
          </div>
        </>
      )}

      <div className="sun-times">
        <div className="sun-time">
          <span className="sun-icon">🌅</span>
          <span className="sun-label">Sunrise</span>
          <span className="sun-value">
            {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="sun-time">
          <span className="sun-icon">🌇</span>
          <span className="sun-label">Sunset</span>
          <span className="sun-value">
            {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailedView;
