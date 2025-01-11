import React from 'react';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ handleCreatePostToggle }) => {
  const navigate = useNavigate();
  const jumpToBottom = () => {
    document.documentElement.scrollTop = document.body.scrollHeight; 
  };
  const handleContactUsClick = () => {
    navigate('/');
    setTimeout(() => {
      jumpToBottom(); 
    }, 100); 
  };
  const forumHome = () => {navigate('/forum?page=1&limit=10');};
  const Home = () => {navigate('/');};
  const About = () => {navigate('/');};

  return (
    <aside className="sidebar">
      <button className="sidebar-button" onClick={Home} style={{cursor:'pointer'}}>
        <div className="sidebar-icon">
          <img src="/src/pages/forum/assets/Home Icon.svg" alt="Home" />
        </div>
        <div>
          Home
        </div>
      </button>
      <button className="sidebar-button"  onClick={forumHome} style={{cursor:'pointer'}}>
        <div className="sidebar-icon">
          <img src="/src/pages/forum/assets/All posts Icon.svg" alt="All Posts"/>
        </div>
        <div>
          All Posts
        </div>
      </button>
      <hr className="line" />
      <button className="create-post-button" style={{ backgroundColor: '#FF4B5C' }} onClick={handleCreatePostToggle}>
        <div className="sidebar-icon">
          <img src="/src/pages/forum/assets/Create Icon.svg" alt="Create Post" />
        </div>
        <div>
          Create Post
        </div>
      </button>
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="/src/pages/forum/assets/Tags Icon.svg" alt="Tags" />
        </div>
        <div>
          Tags
        </div>
      </button>
      <hr className="line" />
      <button className="sidebar-button-noicon" onClick={Home} style={{cursor:'pointer'}}>
        <div>
          About C.A.T
        </div>
      </button>
      <button className="sidebar-button-noicon" onClick={handleContactUsClick} style={{ cursor: 'pointer' }}>
        <div>
          Contact Us
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
