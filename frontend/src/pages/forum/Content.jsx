import React from "react";

function Content() {
  return (
    <main className="content">
      <section className="post-feed">
        <div className="post">
          <div className="post-header">
            <img
              src="Assests/Post avatar.svg"
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-name">John Doe</div>
            <div className="post-time">2 hours ago</div>
            <div className="post-navigate-button">...</div>
          </div>
          <div className="post-body">
            <h1 className="post-title">Post title</h1>
            <p className="post-content">Post content</p>
          </div>
          <hr className="post-line" />
          <div className="post-footer">
            <button className="updown-button">
              <img
                src="Assests/Upvote.svg"
                className="post-action"
                alt="Upvote"
              />
              12
              <img
                src="Assests/Downvote.svg"
                className="post-reaction"
                alt="Downvote"
              />
            </button>
            <button className="comment-button">
              <img
                src="Assests/Comment Icon.svg"
                className="post-action"
                alt="Comment"
              />
              Comment
            </button>
            <button className="share-button">
              <img
                src="Assests/Share Icon.svg"
                className="post-action"
                alt="Share"
              />
              Share
            </button>
          </div>
          <hr className="post-line" />
          <div className="comment-section">
            <div className="show-more">Show more comments</div>
            {/* Comment List */}
            <div className="comments-list">
              <div className="comment">
                <div className="comment-header">
                  <img
                    src="Assests/Comment avatar.svg"
                    className="comment-avatar"
                    alt="Comment avatar"
                  />
                  <span className="comment-user-name">Jane Smith</span>
                  <span className="comment-time">1 hour ago</span>
                </div>
                <div className="comment-body">
                  This is a sample comment.
                </div>
                <div className="comment-footer">
                  <button className="comment-reply">
                    <img
                      src="Assests/Comment Icon.svg"
                      className="comment-action"
                      alt="Reply"
                    />
                    Reply
                  </button>
                  <button className="comment-like">
                    <img
                      src="Assests/Share Icon.svg"
                      className="comment-action"
                      alt="Share"
                    />
                    Share
                  </button>
                </div>
              </div>
              {/* Repeat for other comments */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Content;
