import { useMemo, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { movies } from './data/movies.js';

function Header() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">Cine<span>Scope</span></Link>
      <nav><Link to="/">Discover</Link><a href="#about">About</a></nav>
    </header>
  );
}

function MovieCard({ movie }) {
  return (
    <Link className="movie-card" to={`/movie/${movie.id}`}>
      <div className="poster-wrap">
        <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy"
          onError={(event) => { event.currentTarget.src = 'https://placehold.co/400x600/202638/ffffff?text=No+Poster'; }} />
        <span className="rating">★ {movie.rating}</span>
      </div>
      <div className="card-info">
        <h3>{movie.title}</h3>
        <p>{movie.year} <span>•</span> {movie.genre}</p>
      </div>
    </Link>
  );
}

function Home() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('popular');
  const genres = ['All', ...new Set(movies.map((movie) => movie.genre))];

  const filteredMovies = useMemo(() => {
    let result = movies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre === 'All' || movie.genre === genre)
    );
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === 'year') result = [...result].sort((a, b) => b.year - a.year);
    return result;
  }, [search, genre, sort]);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">YOUR NEXT FAVORITE FILM</p>
          <h1>Find a movie<br /><span>worth watching.</span></h1>
          <p className="hero-copy">Explore movies, discover new genres, and find the details that matter.</p>
          <a className="primary-btn" href="#discover">Explore movies</a>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-circle"></div><div className="art-ticket">CINEMA<br />NIGHT</div></div>
      </section>

      <main id="discover" className="content">
        <div className="section-heading">
          <div><p className="eyebrow">THE COLLECTION</p><h2>Discover movies</h2></div>
          <span className="result-count">{filteredMovies.length} titles</span>
        </div>
        <div className="controls">
          <label className="search-box">
            <span>⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search movies..." />
          </label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre">
            {genres.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort movies">
            <option value="popular">Sort: Featured</option>
            <option value="rating">Highest rated</option>
            <option value="year">Newest first</option>
          </select>
        </div>
        {filteredMovies.length ? (
          <div className="movie-grid">{filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
        ) : (
          <div className="empty"><h3>No movies found</h3><p>Try another title or choose a different genre.</p><button onClick={() => { setSearch(''); setGenre('All'); }}>Clear filters</button></div>
        )}
      </main>
      <footer id="about"><span className="brand">Cine<span>Scope</span></span><p>Discover stories worth remembering.</p></footer>
    </>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((item) => item.id === Number(id));

  if (!movie) return <main className="not-found"><h2>Movie not found</h2><button onClick={() => navigate('/')}>Back to movies</button></main>;

  return (
    <main className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to movies</button>
      <section className="detail-card">
        <img className="detail-poster" src={movie.poster} alt={`${movie.title} poster`}
          onError={(event) => { event.currentTarget.src = 'https://placehold.co/400x600/202638/ffffff?text=No+Poster'; }} />
        <div className="detail-copy">
          <p className="eyebrow">{movie.genre} · {movie.year}</p>
          <h1>{movie.title}</h1>
          <div className="detail-rating">★ {movie.rating} <span>/ 10</span></div>
          <p className="plot">{movie.plot}</p>
          <div className="meta"><div><small>DIRECTOR</small><strong>{movie.director}</strong></div><div><small>RUNTIME</small><strong>{movie.runtime}</strong></div><div><small>LANGUAGE</small><strong>{movie.language}</strong></div></div>
          <div className="cast"><small>CAST</small><p>{movie.cast}</p></div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/movie/:id" element={<MovieDetails />} /><Route path="*" element={<Home />} /></Routes></>;
}