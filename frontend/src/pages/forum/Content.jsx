import React, { useState } from 'react';

const Content = ({isCreatePostOpen, handleCreatePostToggle}) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(12);
  
  const [commentInput, setCommentInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [comments, setComments] = useState([
    { id: 1, userName: 'Jane Smith', time: '1 hour ago', content: 'This is a sample comment.', replies: [] },
    { id: 2, userName: 'Jane Smith', time: '1 hour ago', content: 'This is another sample comment.', replies: [] },
  ]);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  const handleUpvote = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
      setVoteCount(voteCount + 1);
    }
    setIsUpvoted(!isUpvoted);
    setVoteCount(isUpvoted ? voteCount - 1 : voteCount + 1);
  };

  const handleDownvote = () => {
    if (isUpvoted) {
      setIsUpvoted(false);
      setVoteCount(voteCount - 1);
    }
    setIsDownvoted(!isDownvoted);
    setVoteCount(isDownvoted ? voteCount + 1 : voteCount - 1);
  };

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments([
        ...comments,
        { id: comments.length + 1, userName: 'Current User', time: 'Just now', content: commentInput, replies: [] },
      ]);
      setCommentInput('');
    }
  };

  const toggleCommentBox = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
  };

  const renderVoteButtons = () => (
    <div className="updown-button">
      <img
        className="upvote"
        src={`/src/pages/forum/assets/Upvote${isUpvoted ? '-chosen' : ''}.svg`}
        alt="Upvote"
        onClick={handleUpvote}
        onMouseEnter={(e) => { if (!isUpvoted) e.target.src = '/src/pages/forum/assets/Upvote-hover.svg'; }}
        onMouseLeave={(e) => { if (!isUpvoted) e.target.src = '/src/pages/forum/assets/Upvote.svg'; }}
      />
      <span className="vote-count" style={{ color: isUpvoted ? '#FF4B5C' : isDownvoted ? '#42C8F5' : '' }}>
        {voteCount}
      </span>
      <img
        className="downvote"
        src={`/src/pages/forum/assets/Downvote${isDownvoted ? '-chosen' : ''}.svg`}
        alt="Downvote"
        onClick={handleDownvote}
        onMouseEnter={(e) => { if (!isDownvoted) e.target.src = '/src/pages/forum/assets/Downvote-hover.svg'; }}
        onMouseLeave={(e) => { if (!isDownvoted) e.target.src = '/src/pages/forum/assets/Downvote.svg'; }}
      />
    </div>
  );

  const renderDropdown = (index) => (
    <div
      className="post-navigate-dropdown"
      style={{ display: dropdownVisible === index ? 'block' : 'none' }}
    >
      <div className="dropdown-item" onClick={() => console.log('Post saved')}>Save</div>
      <hr className="post-navigate-line" />
      <div
        className="dropdown-item"
        style={{ color: '#FF4B5C' }}
        onClick={() => console.log('Post reported')}
      >
        Report
      </div>
    </div>
  );

  const renderComments = () => (
    <div className="comments-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" alt="Avatar" />
            <span className="comment-user-name">{comment.userName}</span>
            <span className="comment-time">{comment.time}</span>
          </div>
          <div className="comment-body">{comment.content}</div>
          <div className="comment-footer">
            <button className="comment-reply">
              <img src="/src/pages/forum/assets/Comment Icon.svg" className="comment-action" alt="Reply" /> Reply
            </button>
            <button className="comment-like">
              <img src="/src/pages/forum/assets/Share Icon.svg" className="comment-action" alt="Share" /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="content">
      {isCreatePostOpen && (
        <div className="create-post-modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', transform: 'translateX(0)' }}>
          <div className="modal-container" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px' }}>
            <div className="modal-header">
              <img src="/src/pages/forum/assets/Post avatar.svg" alt="User Avatar" className="create-avatar" />
              <div className="create-user-name">John Doe</div>
              <button className="close-button" onClick={handleCreatePostToggle}>X</button>
            </div>
            <div className="modal-body">
              <textarea placeholder="What's on your mind?" rows="4" className="modal-textarea" />
              <div className="visibility-options">
                <label htmlFor="visibility">Who can see this post?</label>
                <select id="visibility" className="visibility-dropdown">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <button className="submit-button" onClick={handleCreatePostToggle}>Post</button>
            </div>
          </div>
        </div>
      )}

      <section className="post-feed" style={{ minHeight: '100vh' }}>
        <div className="post">
          <div className="post-header">
            <img src="/src/pages/forum/assets/Post avatar.svg" alt="User Avatar" className="user-avatar" />
            <div className="user-name">John Doe</div>
            <div className="post-time">2 hours ago</div>
            <div className="post-navigate-button" onClick={() => toggleDropdown(1)}>
              <span className="post-navigate-icon">...</span>
            </div>
            {renderDropdown(1)}
          </div>
          <div className="post-body">
            <h1 className="post-title">Post title</h1>
            <p className="post-content">Post content</p>
          </div>
          <hr className="post-line" />
          <div className="post-footer">
            {renderVoteButtons()}
            <button className="comment-button" onClick={toggleCommentBox}>
              <img src="/src/pages/forum/assets/Comment Icon.svg" className="post-action" alt="Comment" /> Comment
            </button>
            <button className="share-button">
              <img src="/src/pages/forum/assets/Share Icon.svg" className="post-action" alt="Share" /> Share
            </button>
          </div>
          <hr className="post-line" />
          {isCommentBoxVisible && (
            <div className="comment-section" style={{ padding: '10px' }}>
              {renderComments()}
              <div className="create-comment">
                <div className="create-comment-header">
                  <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" alt="Avatar" />
                  <textarea
                    className="create-comment-input"
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={handleCommentInput}
                    style={{ height: 'auto', maxHeight: '200px' }}
                  />
                  <button className="submit-comment" onClick={handleAddComment}>Post</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Content;
