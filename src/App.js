import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ArticleCard from './components/ArticleCard';
import Pagination from './components/Pagination';
import DetailPage from './components/DetailPage';
import './App.css';
import HomeIcon from '@mui/icons-material/Home';
import debounce from 'lodash.debounce';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const API_KEY = 'ccb8eacce3c74fe9897c7b7dbf7018b7';
  const ARTICLES_PER_PAGE = 10;

  const fetchArticles = useCallback(
    async (page, query, category) => {
      setLoading(true);
      setError(null);

      let url = `https://newsapi.org/v2/everything?q=${query}&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${API_KEY}`;
      if (!query && !category) {
        url = `https://newsapi.org/v2/everything?q=latest&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${API_KEY}`;
      } else if (category) {
        url = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${ARTICLES_PER_PAGE}&page=${page}&apiKey=${API_KEY}`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 429) {
            setError('Too many requests. Please try again later.');
          } else {
            throw new Error(`Failed to fetch articles: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setArticles(data.articles);
          setTotalResults(data.totalResults);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
        setLoading(false);
      }
    },
    [API_KEY]
  );

  useEffect(() => {
    fetchArticles(currentPage, searchQuery, category);
  }, [currentPage, fetchArticles, searchQuery, category]);

  useEffect(() => {
    fetchArticles(1, '', '');
  }, [fetchArticles]);

  const totalPages = Math.ceil(totalResults / ARTICLES_PER_PAGE);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const debouncedFetchArticles = useCallback(
    debounce((page, query, category) => {
      fetchArticles(page, query, category);
    }, 500),
    [fetchArticles]
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    debouncedFetchArticles(1, searchQuery, category);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
    debouncedFetchArticles(1, searchQuery, event.target.value);
  };

  const toggleFavorite = (article) => {
    const updatedFavorites = favorites.some((fav) => fav.url === article.url)
      ? favorites.filter((fav) => fav.url !== article.url)
      : [...favorites, article];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <Router>
      <div className="app">
        <h1>Latest News</h1>
        <form className='search' onSubmit={handleSearchSubmit}>
        <a href='/'><HomeIcon fontSize="large"/></a>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for news..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="controls">
          <div className="categories">
            <label htmlFor="category-select">Choose a category:</label>
            <select id="category-select" value={category} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="general">General</option>
              <option value="stock">Stock</option>
              <option value="games">Games</option>
              <option value="travel">Travel</option>
            </select>
          </div>
          <Link to={`/`}>
          <button className='fav-button' onClick={handleShowFavorites}>
            {showFavorites ? 'Show All Articles' : 'Show Favorites'}
          </button>
          </Link>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="articles">
                    {(showFavorites ? favorites : articles).map((article) => (
                      <ArticleCard
                        key={article.url}
                        article={article}
                        isFavorite={favorites.some((fav) => fav.url === article.url)}
                        toggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                  {!showFavorites && (
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              }
            />
            <Route path="/article/:id" element={<DetailPage articles={articles} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
