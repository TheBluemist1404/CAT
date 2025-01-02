import React from 'react';

const Pagination = () => {
  return (
    <div className="pagination">
      <button className="page-button prev">&laquo; Prev</button>
      <span className="page-number">1</span>
      <span className="page-number">2</span>
      <span className="page-number">3</span>
      <span className="page-number">4</span>
      <button className="page-button next">Next &raquo;</button>
    </div>
  );
};

export default Pagination;