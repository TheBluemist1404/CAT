import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Pagination from './Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import './forum.scss';

const Forum = ({ token, render }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const getPageFromURL = () => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('page')) || 1;
  };

  const [currentPage, setCurrentPage] = useState(getPageFromURL);

  useEffect(() => {
    const page = getPageFromURL();
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [location.search]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      navigate(`?page=${page}&limit=10`);
    }
  };

  const handleCreatePostToggle = () => {
    setIsCreatePostOpen(!isCreatePostOpen);
  };

  return (
    <div className="forum">
      <Header />
      <div className="main-layout">
        <Sidebar handleCreatePostToggle={handleCreatePostToggle} token={token} />
        <Content
          isCreatePostOpen={isCreatePostOpen}
          handleCreatePostToggle={handleCreatePostToggle}
          token={token}
          currentPage={currentPage}
          setTotalPages={setTotalPages}
          render={render}
        />
      </div>
      {render === "forum" ? (<Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />): (<></>)}
    </div>
  );
};

export default Forum;
