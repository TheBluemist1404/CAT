import React from 'react';

const Sidebar = ({ openCreatePostModal }) => {
  return (
    <aside className="sidebar">
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assets/Home Icon.svg" alt="Home" />
        </div>
        Home
      </button>
      <button className="sidebar-button" onClick={openCreatePostModal}>
        <div className="sidebar-icon">
          <img src="Assets/All posts Icon.svg" alt="All Posts" />
        </div>
        All Posts
      </button>
      <hr className="line" />
      <button className="create-post-button" style={{ backgroundColor: '#FF4B5C' }}>
        <div className="sidebar-icon">
          <img src="Assets/Create Icon.svg" alt="Create" />
        </div>
        Create Post
      </button>
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assets/Tags Icon.svg" alt="Tags" />
        </div>
        Tags
      </button>
      <hr className="line" />
      <button className="sidebar-button-noicon">About C.A.T</button>
      <button className="sidebar-button-noicon">Contact Us</button>
    </aside>
  );
};

export default Sidebar;
