import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import Pagination from './Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import './forum.scss';
import axios from 'axios';
import Detail from './Detail_post';
import Search from './SearchResults';

const Forum = ({ token, render }) => {
  const { isLoggedIn, fetch } = useContext(AuthContext);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchTotalPosts = async () => {
    const data = await fetch(token, axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/forum?offset=0&limit=0`));
    const posts = data[0].metadata[0].total;
    setTotalPages(Math.floor(posts / 10) + 1);
  };

  useEffect(() => {
    fetchTotalPosts();
  }, []);


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
    if (!isLoggedIn) {
      navigate('/auth/login');
    } else {
      setIsCreatePostOpen(!isCreatePostOpen);
    }
  };

  return (
    <div>
      {render === "forum" || render === "search" ? (<div className="forum">
        <Header token={token}/>
        <div className="main-layout">
          <Sidebar handleCreatePostToggle={handleCreatePostToggle} token={token} />
          {render === "forum" ? (
              <Content
                isCreatePostOpen={isCreatePostOpen}
                handleCreatePostToggle={handleCreatePostToggle}
                token={token}
                currentPage={currentPage}
                render={render}
              />
            ) : (
              <Search token={token} />
            )}
        </div>
        {render === "forum" ? (<Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />) : (<></>)}
      </div>) : (<div className="forum">
        <Header />
        <div className="main-layout">
          <Sidebar handleCreatePostToggle={handleCreatePostToggle} token={token} />
          <div className='content'>
            <Detail token={token} />
          </div>
        </div>
        {render === "forum" ? (<Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />) : (<></>)}
      </div>)}
    </div>
  );
};

export default Forum;