import React from 'react';
// import './Pagination.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = [];
  const maxPagesToShow = 5;
  const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

  let startPage, endPage;
  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= halfMaxPagesToShow) {
    startPage = 1;
    endPage = maxPagesToShow;
  } else if (currentPage + halfMaxPagesToShow >= totalPages) {
    startPage = totalPages - maxPagesToShow + 1;
    endPage = totalPages;
  } else {
    startPage = currentPage - halfMaxPagesToShow;
    endPage = currentPage + halfMaxPagesToShow;
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        First
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={currentPage === page ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
