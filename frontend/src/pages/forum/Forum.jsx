import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Pagination from "./Pagination";
import "./style.scss";

function Forum() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCreatePostModal = () => {
    setIsModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="forum">
      <Header  />
      <Sidebar openCreatePostModal={openCreatePostModal} />
      <Content />
      <Pagination />

      {isModalOpen && (
        <div id="createPostBackdrop" className="create-post-backdrop" onClick={closeCreatePostModal}></div>
      )}
      {isModalOpen && <div id="createPostModal" className="create-post-modal">
        <div className="modal-header">
          <img src="Assets/Post avatar.svg" alt="User Avatar" className="create-avatar" />
          <div className="create-user-name">John Doe</div>
          <div className="create-time">2 hours ago</div>
          <button className="close-button" onClick={closeCreatePostModal}>X</button>
        </div>
        <div className="modal-body">
          <textarea placeholder="What's on your mind?" rows="4" className="modal-textarea"></textarea>
          <div className="visibility-options">
            <label htmlFor="visibility">Who can see this post?</label>
            <select id="visibility" className="visibility-dropdown">
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <button className="submit-button">Post</button>
        </div>
      </div>}
    </div>
  );
}

export default Forum;
