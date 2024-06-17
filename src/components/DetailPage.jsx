import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = ({ articles }) => {
  const { id } = useParams();
  const article = articles.find((article) => article.url === id);

//   useEffect(()=>{
//     console.log(article.description);
//     console.log(article.content);
//   },[]);

  if (!article) {
    return <p>Article not found</p>;
  }

  const { title, description, content, url, urlToImage, publishedAt, source } = article;

  return (
    <div className="detail-page">
      <h2>{title}</h2>
      {urlToImage && <img src={urlToImage} alt={title} />}
      <p>{description}</p>
      {content && <p>{content}</p>}
      <h3>Published At: </h3>
      <p className='detail-head'>{new Date(publishedAt).toLocaleString()}</p>
      <h3>Source: </h3>
      <p className='detail-head'>{source.name}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read the full article
      </a>
    </div>
  );
};

export default DetailPage;
