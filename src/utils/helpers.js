// Convert temperature between Celsius and Fahrenheit
export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') {
    return (temp * 9/5) + 32;
  }
  return temp;
};

// Format temperature with unit
export const formatTemperature = (temp, unit) => {
  const converted = convertTemperature(temp, unit);
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(converted)}${symbol}`;
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Format date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Group forecast data by day
export const groupForecastByDay = (forecastList) => {
  const grouped = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(item);
  });
  
  return grouped;
};

// Get daily forecast summary (max/min temp, most common weather)
export const getDailySummary = (dayItems) => {
  const temps = dayItems.map(item => item.main.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  
  // Get most common weather condition
  const weatherCounts = {};
  dayItems.forEach(item => {
    const condition = item.weather[0].main;
    weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
  });
  
  const mostCommonWeather = Object.keys(weatherCounts).reduce((a, b) => 
    weatherCounts[a] > weatherCounts[b] ? a : b
  );
  
  // Get icon for the most common weather
  const weatherItem = dayItems.find(item => item.weather[0].main === mostCommonWeather);
  
  return {
    maxTemp,
    minTemp,
    weather: mostCommonWeather,
    icon: weatherItem.weather[0].icon,
    timestamp: dayItems[0].dt,
  };
};

// Calculate wind direction from degrees
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
