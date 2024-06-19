import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, json } from 'react-router-dom';
import ArticleCard from './components/ArticleCard';
import Pagination from './components/Pagination';
import DetailPage from './components/DetailPage';
import CurrentsAPIClient from './components/CurrentAPIClient';
import './App.css';
import HomeIcon from '@mui/icons-material/Home';

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

  const API_KEY = 'UnggGKgONF374aT8S6FudtEfpSHt6u7dKZYqGONX_upqgRIH';
  const ARTICLES_PER_PAGE = 30;
  let client = new CurrentsAPIClient(API_KEY);

  const fetchArticles = async (page, query, category) => {
    setLoading(true);
    setError(null);
    
    if (!query && !category) {
      let res = await client.fetchLatestNews(page);
      if(res.status){
        setNews(res.data);
      }else{
        setError(res.data);
        setNews({news:[]});
        console.log(res.data);
      }
    } else if (category||category!=='') {
      let res = await client.fetchArticlesByCategory(category,page);
      if(res.status){
        setNews(res.data);
      }else{
        setError(res.data);
        setNews({news:[]});
        console.log(res.data);
      }
    }else if(query||query!==''){
      let res = await client.fetchArticlesByQuery(query,page);
      if(res.status){
        setNews(res.data);
      }else{
        setError("Api error "+JSON.stringify(res));
        setNews({news:[]});
        console.log(res);
      }
    }
  };

  function setNews(data) {
    setArticles(data.news);
    setTotalResults(data.news.length); // Currents API does not provide total results, so using length of current batch
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles(currentPage, searchQuery, category);
  }, [currentPage, category]);

  useEffect(() => {
    fetchArticles(1, '', '');
  }, []);

  const totalPages = Math.ceil(totalResults / ARTICLES_PER_PAGE);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchArticles(1, searchQuery, category);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
    fetchArticles(1, searchQuery, event.target.value);
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
          <a href='/'><HomeIcon fontSize="large" /></a>
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
              path="/*"
              element={
                <>
                  <div className="articles">
                    {(showFavorites ? favorites : articles).map((article) => (
                      <ArticleCard
                        key={article.id}
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
