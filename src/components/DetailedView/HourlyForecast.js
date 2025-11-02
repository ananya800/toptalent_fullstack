import React from 'react';
import { formatTime, formatTemperature, getWeatherIconUrl } from '../../utils/helpers';
import './HourlyForecast.css';

function HourlyForecast({ forecastData, temperatureUnit }) {
  if (!forecastData || !forecastData.list) {
    return <div>No forecast data available</div>;
  }

  // Get next 24 hours (8 time slots of 3 hours each)
  const hourlyData = forecastData.list.slice(0, 8);

  return (
    <div className="hourly-forecast-container">
      <div className="hourly-scroll">
        {hourlyData.map((item, index) => (
          <div key={index} className="hourly-item">
            <div className="hourly-time">
              {formatTime(item.dt)}
            </div>
            <img
              src={getWeatherIconUrl(item.weather[0].icon)}
              alt={item.weather[0].description}
              className="hourly-icon"
            />
            <div className="hourly-temp">
              {formatTemperature(item.main.temp, temperatureUnit)}
            </div>
            <div className="hourly-description">
              {item.weather[0].main}
            </div>
            <div className="hourly-details">
              <div className="hourly-detail-item">
                <span>💧</span>
                <span>{item.main.humidity}%</span>
              </div>
              <div className="hourly-detail-item">
                <span>💨</span>
                <span>{Math.round(item.wind.speed)} m/s</span>
              </div>
              {item.rain && (
                <div className="hourly-detail-item">
                  <span>🌧️</span>
                  <span>{item.rain['3h']} mm</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
