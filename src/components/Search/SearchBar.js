import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentWeather } from '../../redux/slices/weatherSlice';
import { addFavorite } from '../../redux/slices/favoritesSlice';
import { searchCities } from '../../services/weatherAPI';
import './SearchBar.css';

function SearchBar() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await searchCities(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectCity = (cityName) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(addFavorite(cityName));
    dispatch(fetchCurrentWeather(cityName));
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {loading && <span className="loading-indicator">⏳</span>}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city) => (
            <div
              key={city.id}
              className="suggestion-item"
              onClick={() => handleSelectCity(city.name)}
            >
              <div className="suggestion-name">
                {city.name}, {city.sys.country}
              </div>
              <div className="suggestion-temp">
                {Math.round(city.main.temp)}°C
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="suggestions-dropdown">
          <div className="no-results">No cities found</div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
