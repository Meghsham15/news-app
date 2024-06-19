import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article, isFavorite, toggleFavorite }) => {
  const { id, title, description, url, image } = article;

  return (
    <div className="article-card">
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
      <button className={isFavorite ? 'remove-fav' : 'add-fav'} onClick={() => toggleFavorite(article)}>
        {isFavorite ? 'Remove ♥' : 'Add ♥'}
      </button>
      <Link to={`/article/${encodeURIComponent(id)}`}>
        Read more
      </Link>
    </div>
  );
};

export default ArticleCard;
