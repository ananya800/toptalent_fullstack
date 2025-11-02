import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage
const loadFavoritesFromStorage = () => {
  try {
    const saved = localStorage.getItem('favoriteCities');
    return saved ? JSON.parse(saved) : ['New York', 'London', 'Tokyo'];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return ['New York', 'London', 'Tokyo'];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (cities) => {
  try {
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    cities: loadFavoritesFromStorage(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!state.cities.includes(city)) {
        state.cities.push(city);
        saveFavoritesToStorage(state.cities);
      }
    },
    removeFavorite: (state, action) => {
      const city = action.payload;
      state.cities = state.cities.filter(c => c !== city);
      saveFavoritesToStorage(state.cities);
    },
    toggleFavorite: (state, action) => {
      const city = action.payload;
      const index = state.cities.indexOf(city);
      if (index >= 0) {
        state.cities.splice(index, 1);
      } else {
        state.cities.push(city);
      }
      saveFavoritesToStorage(state.cities);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
