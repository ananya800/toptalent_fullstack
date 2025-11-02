import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentWeather, getForecast } from '../../services/weatherAPI';
import { getCachedData, setCachedData } from '../../services/cache';

// Async thunk to fetch current weather
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (cityName, { rejectWithValue }) => {
    try {
      // Check cache first
      const cacheKey = `weather_${cityName}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Fetch from API
      const data = await getCurrentWeather(cityName);
      
      // Cache the data for 60 seconds
      setCachedData(cacheKey, data, 60000);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch forecast
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (cityName, { rejectWithValue }) => {
    try {
      const cacheKey = `forecast_${cityName}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const data = await getForecast(cityName);
      setCachedData(cacheKey, data, 60000);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Refresh weather data for all favorite cities
export const refreshWeatherData = createAsyncThunk(
  'weather/refresh',
  async (cities, { dispatch }) => {
    const promises = cities.map(city => dispatch(fetchCurrentWeather(city)));
    await Promise.all(promises);
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: {},
    forecasts: {},
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Current weather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        const cityName = action.payload.name;
        state.currentWeather[cityName] = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        const cityName = action.payload.city.name;
        state.forecasts[cityName] = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
