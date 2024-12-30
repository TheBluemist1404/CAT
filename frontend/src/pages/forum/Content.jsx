import {React,useState} from "react";

function Content() {
  const [comments, setComments] = useState([
    { userName: 'Jane Smith', content: 'This is a sample comment.', time: '1 hour ago' },
    { userName: 'John Doe', content: 'Another comment example.', time: '2 hours ago' },
  ]);
  return (
    <main className="content">      
      <section className="post-feed">
        <div className="post">
          <div className="post-header">
            <img src="Assets/Post avatar.svg" alt="User Avatar" className="user-avatar" />
            <div className="user-name">John Doe</div>
            <div className="post-time">2 hours ago</div>
          </div>
          <div className="post-body">
            <h1 className="post-title">Post title</h1>
            <p className="post-content">Post content</p>
          </div>
          <div className="post-footer">
            <button className="comment-button">Comment</button>
          </div>
          <div className="comment-section">
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <img src="Assets/Comment avatar.svg" className="comment-avatar" />
                    <span className="comment-user-name">{comment.userName}</span>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                  <div className="comment-body">{comment.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Content;
