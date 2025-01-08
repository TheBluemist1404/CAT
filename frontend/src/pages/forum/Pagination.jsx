const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...') {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button
        className="page-button prev"
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        &laquo; Prev
      </button>
      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          className={`page-number ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      <button
        className="page-button next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
