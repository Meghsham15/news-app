import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article, isFavorite, toggleFavorite }) => {
  const { title, description, url, urlToImage } = article;

  return (
    <div className="article-card">
      {urlToImage && <img src={urlToImage} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
      <button className={isFavorite ? 'remove-fav' : 'add-fav'} onClick={() => toggleFavorite(article)}>
        {isFavorite ? 'Remove ♥' : 'Add ♥'}
      </button>
      <Link to={`/article/${encodeURIComponent(url)}`}>
        <a>Read more</a>
      </Link>
    </div>
  );
};

export default ArticleCard;
