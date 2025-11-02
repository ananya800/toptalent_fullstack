import { createSlice } from '@reduxjs/toolkit';

// Load settings from localStorage
const loadSettingsFromStorage = () => {
  try {
    const saved = localStorage.getItem('weatherSettings');
    return saved ? JSON.parse(saved) : { temperatureUnit: 'celsius' };
  } catch (error) {
    return { temperatureUnit: 'celsius' };
  }
};

// Save settings to localStorage
const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettingsFromStorage(),
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      saveSettingsToStorage(state);
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      saveSettingsToStorage(state);
    },
  },
});

export const { setTemperatureUnit, toggleTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
