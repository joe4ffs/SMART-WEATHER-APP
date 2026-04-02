import styles from "../styles/theme";

function SearchBar({ inputVal, handleInput, getWeather, getUserLocation, suggestions, setSuggestions, error, accent }) {
  return (
    <div style={{ animation:"fadeUp .6s .15s ease both", position:"relative", display:"inline-block" }}>
      <div style={styles.searchWrap}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={styles.searchIconLeft}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search any city..."
            value={inputVal}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && getWeather(inputVal)}
          />
          {suggestions.length > 0 && (
            <div style={styles.dropdown}>
              {suggestions.map((place, i) => (
                <div
                  key={i}
                  className="suggest"
                  style={styles.suggestionItem}
                  onClick={() => { getWeather(place.display_name); setSuggestions([]); }}
                >
                  <span style={{ marginRight:8, opacity:0.5 }}>📍</span>
                  {place.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          style={{ ...styles.btnPrimary, background:accent }}
          onClick={() => getWeather(inputVal)}
        >
          Search
        </button>
        <button style={styles.btnIcon} onClick={getUserLocation} title="Use my location">
          📍
        </button>
      </div>
      {error && <div style={styles.errorMsg}>⚠️ {error}</div>}
    </div>
  );
}

export default SearchBar;