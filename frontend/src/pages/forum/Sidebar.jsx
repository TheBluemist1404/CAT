import React from "react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assests/Home Icon.svg" alt="Home" />
        </div>
        <div>Home</div>
      </button>
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assests/All posts Icon.svg" alt="All Posts" />
        </div>
        <div>All Posts</div>
      </button>
      <hr className="line" />
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assests/Create Icon.svg" alt="Create Post" />
        </div>
        <div>Create Post</div>
      </button>
      <button className="sidebar-button">
        <div className="sidebar-icon">
          <img src="Assests/Tags Icon.svg" alt="Tags" />
        </div>
        <div>Tags</div>
      </button>
      <hr className="line" />
      <button className="sidebar-button-noicon">About C.A.T</button>
      <button className="sidebar-button-noicon">Contact Us</button>
    </aside>
  );
}

export default Sidebar;
