import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = ({ articles }) => {
  const { id } = useParams();
  const article = articles.find((article) => article.id === id);

  if (!article) {
    return <p>Article not found</p>;
  }

  const { title, description, author, url, image, published } = article;

  return (
    <div className="detail-page">
      <h2>{title}</h2>
      {image && <img src={image} alt={title} />}
      <p>{description}</p>
      {/* { && <p>{content}</p>} */}
      <h3>Published At: </h3>
      <p className='detail-head'>{new Date(published).toLocaleString()}</p>
      <h3>Author: </h3>
      <p className='detail-head'>{author}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read the full article
      </a>
    </div>
  );
};

export default DetailPage;
