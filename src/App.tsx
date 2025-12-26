import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [suggested, setSuggested] = useState<any[]>([]);

  // 🔥 1. Map weather → movie genre
  function getGenreForWeather(code: number, temp: number) {
    if (code >= 0 && code <= 3) return "adventure";
    if (code >= 45 && code <= 48) return "mystery";
    if (code >= 51 && code <= 67) return "romance";
    if (code >= 71 && code <= 77) return "fantasy";
    if (temp >= 30) return "action";
    if (temp <= 5) return "family";
    return "drama";
  }

  // -----------------------------------------------------
  // Helper: Fetch ALL movies (handles pagination)
  // -----------------------------------------------------
  async function fetchAllMoviesByGenre(genre: string) {
    let allMovies: any[] = [];
    let page = 1;

    while (true) {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=thewdb&s=${genre}&page=${page}`
      );
      const data = await res.json();

      if (!data.Search) break;

      allMovies = [...allMovies, ...data.Search];
      page++;

      if (page > 10) break;
    }

    return allMovies;
  }

  // -----------------------------------------------------
  // Fetch weather & suggested movies on load
  // -----------------------------------------------------
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (pos) => {
  //       const { latitude, longitude } = pos.coords;
  //       const weatherRes = await fetch(
  //         `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  //       );
  //       const weatherData = await weatherRes.json();
  //       const weatherCode = weatherData.current_weather.weathercode;
  //       const temperature = weatherData.current_weather.temperature;
  //       const genre = getGenreForWeather(weatherCode, temperature);
  //       const allMovies = await fetchAllMoviesByGenre(genre);
  //       setSuggested(allMovies);
  //     },
  //     async () => {
  //       const allMovies = await fetchAllMoviesByGenre("popular");
  //       setSuggested(allMovies);
  //     }
  //   );
  // }, []);

  //=========================
  // FOR TESTING THE WEATHER FOR EACH GENRE
  //=========================

  // Adventure (sunny/clear, weatherCode 2, temp 20)
  // useEffect(() => {
  //   const weatherCode = 2;
  //   const temperature = 20;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Adventure movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Mystery (foggy, weatherCode 46, temp 10)
  // useEffect(() => {
  //   const weatherCode = 46;
  //   const temperature = 10;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Mystery movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Romance (drizzle/rain, weatherCode 55, temp 15)
  // useEffect(() => {
  //   const weatherCode = 55;
  //   const temperature = 15;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Romance movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Fantasy (snow, weatherCode 72, temp 0)
  // useEffect(() => {
  //   const weatherCode = 72;
  //   const temperature = 0;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Fantasy movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Action (very hot, temp >= 30, weatherCode 1)
  // useEffect(() => {
  //   const weatherCode = 1;
  //   const temperature = 35;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Action movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Family (very cold, temp <= 5, weatherCode 3)
  // useEffect(() => {
  //   const weatherCode = 3;
  //   const temperature = 0;
  //   const genre = getGenreForWeather(weatherCode, temperature);
  //   fetchAllMoviesByGenre(genre).then(allMovies => {
  //     console.log("Family movies:", allMovies);
  //     setSuggested(allMovies);
  //   });
  // }, []);

  // Drama (default, weatherCode 20, temp 15)
  useEffect(() => {
    const weatherCode = 20;
    const temperature = 15;
    const genre = getGenreForWeather(weatherCode, temperature);
    fetchAllMoviesByGenre(genre).then(allMovies => {
      console.log("Drama movies:", allMovies);
      setSuggested(allMovies);
    });
  }, []);


  // -----------------------------------------------------
  // SEARCH FUNCTION
  // -----------------------------------------------------
  const handleSearch = async () => {
    if (!query) return;

    let allMovies: any[] = [];
    let page = 1;

    while (true) {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=thewdb&s=${query}&page=${page}`
      );
      const data = await response.json();

      if (!data.Search) break;

      allMovies = [...allMovies, ...data.Search];
      page++;

      if (page > 10) break;
    }

    setMovies(allMovies);
  };

  const renderCard = (movie: any) => (
    <div
      key={movie.imdbID}
      className="movie-card"
      onClick={() =>
        window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank")
      }
    >
      <div className="movie-card-inner">
        {/* Poster area ALWAYS rendered */}
        {movie.Poster !== "N/A" ? (
          <img src={movie.Poster} alt={movie.Title} />
        ) : (
          <div className="poster-placeholder">
            <span>No Image</span>
          </div>
        )}

        <div className="movie-info">
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <h1>Movie Search App 🎬</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {movies.length === 0 && suggested.length > 0 && (
        <>
          <h2>Suggested for you 🍿</h2>
          <div className="movies-grid">
            {suggested.map(renderCard)}
          </div>
        </>
      )}

      {movies.length > 0 && (
        <div className="movies-grid">
          {movies.map(renderCard)}
        </div>
      )}
    </div>
  );
}

export default App;
