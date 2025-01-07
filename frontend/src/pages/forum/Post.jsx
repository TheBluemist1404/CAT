import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import { useNavigate } from 'react-router-dom'

function Post({ post, token, update }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext)
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

  const handleUpvote = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      if (isDownvoted) {
        setIsDownvoted(false);
        setVoteCount(voteCount + 1);
      }
      setIsUpvoted(!isUpvoted);
      setVoteCount(isUpvoted ? voteCount - 1 : voteCount + 1);
      try {
        const vote = await axios.patch(`http://localhost:3000/api/v1/forum/vote/upvote/${post._id}`, { user: { id: user._id } }, { headers: { "Authorization": `Bearer ${token.accessToken}` } })
        update();
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleDownvote = async () => {
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      if (isUpvoted) {
        setIsUpvoted(false);
        setVoteCount(voteCount - 1);
      }
      setIsDownvoted(!isDownvoted);
      setVoteCount(isDownvoted ? voteCount + 1 : voteCount - 1);
      try {
        const vote = await axios.patch(`http://localhost:3000/api/v1/forum/vote/downvote/${post._id}`, { user: { id: user._id } }, { headers: { "Authorization": `Bearer ${token.accessToken}` } })
        update();
      } catch (error) {
        console.log(error)
      }
    }
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
      //...comment is spread operator, research for more info
      setCommentInput('');
    }
  };
  //Also note that we should retrive comments from db, and add comment should make update to db, as well as cause rerender, not adding it manually to fe like this

  const toggleCommentBox = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
  };
  //Hmm, actually I actually think the comment box should appear with the comments

  const renderVoteButtons = () => (
    <div className="updown-button">
      <img
        className="upvote"
        src={`/src/pages/forum/assets/Upvote${isUpvoted ? '-chosen' : ''}.svg`}
        alt="Upvote"
        onClick={handleUpvote}
        onMouseEnter={(e) => { if (!isUpvoted) e.target.src = '/src/pages/forum/assets/Upvote-hover.svg'; }} //mouseEnter is actually better than mouseOver here, research for more info
        onMouseLeave={(e) => { if (!isUpvoted) e.target.src = '/src/pages/forum/assets/Upvote.svg'; }}
      />
      <span className="vote-count" style={{ color: isUpvoted ? '#FF4B5C' : isDownvoted ? '#42C8F5' : '' }}>
        {post.upvotes.length - post.downvotes.length}
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
      <div className="dropdown-item" onClick={() => console.log('Post saved')}>Save</div> {/*Placeholder, but replace with some api call later */}
      <hr className="post-navigate-line" />
      <div
        className="dropdown-item"
        style={{ color: '#FF4B5C' }}
        onClick={() => console.log('Post reported')} //Placeholder, just ignore it
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
    <div className="post">
      <div className="post-header">
        <img src={post.userCreated ? post.userCreated.avatar : "/src/pages/forum/assets/Post avatar.svg"} alt="User Avatar" className="user-avatar" />
        <div className="user-name">{post.userCreated ? post.userCreated.fullName : "unknown"}</div>
        <div className="post-time">{post.createdAt}</div>
        <div className="post-navigate-button" onClick={() => toggleDropdown(1)}>
          <span className="post-navigate-icon">...</span>
        </div>
        {renderDropdown(1)}
      </div>
      <div className="post-body">
        <h1 className="post-title">{post.title}</h1>
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
  )
}

export default Post