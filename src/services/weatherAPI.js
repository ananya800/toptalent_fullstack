import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Log API key status (for debugging)
if (!process.env.REACT_APP_WEATHER_API_KEY || process.env.REACT_APP_WEATHER_API_KEY === 'demo_key') {
  console.error('❌ Weather API key not configured! Check your .env file');
} else {
  console.log('✅ Weather API key loaded successfully');
}

// Rate limiting
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 1000; // 1 second between calls

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < MIN_CALL_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall));
  }
  lastCallTime = Date.now();
};

// Get current weather for a city
export const getCurrentWeather = async (cityName) => {
  await waitForRateLimit();
  
  try {
    console.log(`Fetching weather for ${cityName}...`);
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
      },
    });
    console.log(`✅ Weather data received for ${cityName}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching weather for ${cityName}:`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('🔑 Invalid API key! Common reasons:');
      console.error('   1. API key not activated yet (can take 1-2 hours for new keys)');
      console.error('   2. Invalid API key');
      console.error('   3. Need to generate a new key at: https://home.openweathermap.org/api_keys');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};

// Get 5-day forecast (3-hour intervals)
export const getForecast = async (cityName) => {
  await waitForRateLimit();
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
  }
};

// Search cities (autocomplete)
export const searchCities = async (query) => {
  await waitForRateLimit();
  
  try {
    const response = await axios.get(`${BASE_URL}/find`, {
      params: {
        q: query,
        appid: API_KEY,
        type: 'like',
        cnt: 10,
      },
    });
    return response.data.list;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};
