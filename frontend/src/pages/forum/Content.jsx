import { useEffect } from 'react';

const Content = () => {
  useEffect(() => {
    const upvoteButton = document.querySelector('.updown-button .upvote');
    const downvoteButton = document.querySelector('.updown-button .downvote');
    const voteCount = document.querySelector('.updown-button .vote-count');

    // SVG image paths with uppercase first letter
    const upvoteImage = '/src/pages/forum/assets/Upvote.svg';
    const upvoteHoverImage = '/src/pages/forum/assets/Upvote-hover.svg';
    const upvoteChosenImage = '/src/pages/forum/assets/Upvote-chosen.svg';

    const downvoteImage = '/src/pages/forum/assets/Downvote.svg';
    const downvoteHoverImage = '/src/pages/forum/assets/Downvote-hover.svg';
    const downvoteChosenImage = '/src/pages/forum/assets/Downvote-chosen.svg';

    // Colors for vote count based on vote selection
    const upvoteColor = '#FF4B5C'; // Upvote color
    const downvoteColor = '#42C8F5'; // Downvote color

    let isUpvoted = false;
    let isDownvoted = false;

    function handleUpvote() {
      if (isDownvoted) {
        downvoteButton.src = downvoteImage;
        isDownvoted = false;
        voteCount.style.color = ''; // Reset color when both are neutral
      }

      if (isUpvoted) {
        upvoteButton.src = upvoteImage;
        isUpvoted = false;
        voteCount.style.color = ''; // Reset color when unselected
      } else {
        upvoteButton.src = upvoteChosenImage;
        isUpvoted = true;
        voteCount.style.color = upvoteColor; // Change color to upvote color
      }
    }

    function handleDownvote() {
      if (isUpvoted) {
        upvoteButton.src = upvoteImage;
        isUpvoted = false;
        voteCount.style.color = ''; // Reset color when both are neutral
      }

      if (isDownvoted) {
        downvoteButton.src = downvoteImage;
        isDownvoted = false;
        voteCount.style.color = ''; // Reset color when unselected
      } else {
        downvoteButton.src = downvoteChosenImage;
        isDownvoted = true;
        voteCount.style.color = downvoteColor; // Change color to downvote color
      }
    }

    upvoteButton.addEventListener('click', handleUpvote);
    downvoteButton.addEventListener('click', handleDownvote);

    upvoteButton.addEventListener('mouseover', function () {
      if (!isUpvoted) {
        upvoteButton.src = upvoteHoverImage;
      }
    });

    upvoteButton.addEventListener('mouseout', function () {
      if (!isUpvoted) {
        upvoteButton.src = upvoteImage;
      }
    });

    downvoteButton.addEventListener('mouseover', function () {
      if (!isDownvoted) {
        downvoteButton.src = downvoteHoverImage;
      }
    });

    downvoteButton.addEventListener('mouseout', function () {
      if (!isDownvoted) {
        downvoteButton.src = downvoteImage;
      }
    });

    document.querySelector('.create-post-button').addEventListener('click', function () {
      document.getElementById('createPostBackdrop').style.display = 'block';
      document.getElementById('createPostModal').style.display = 'block';
    });

    document.querySelector('.close-button').addEventListener('click', function () {
      document.getElementById('createPostBackdrop').style.display = 'none';
      document.getElementById('createPostModal').style.display = 'none';
    });

    document.querySelector('.submit-button').addEventListener('click', function () {
      document.getElementById('createPostBackdrop').style.display = 'none';
      document.getElementById('createPostModal').style.display = 'none';
    });

    const commentButton = document.querySelector('.comment-button');
    const createComment = document.querySelector('.create-comment');
    const createCommentInput = document.querySelector('.create-comment-input');

    // Show the create comment area when the "Comment" button is clicked
    commentButton.addEventListener('click', () => {
      // Toggle the visibility of the create comment area
      createComment.style.display = 'flex';
    });

    // Dynamically adjust the height of the textarea as the user types
    createCommentInput.addEventListener('input', () => {
      createCommentInput.style.height = 'auto'; // Reset height to auto to calculate the new height
      createCommentInput.style.height = Math.min(createCommentInput.scrollHeight, 200) + 'px'; // Max height of 200px
    });

    // Get all reply buttons
    const replyButtons = document.querySelectorAll('.comment-reply');

    // Add event listener to each reply button
    replyButtons.forEach(button => {
      button.addEventListener('click', function () {
        const comment = button.closest('.comment');
        const replySection = comment.querySelector('.create-comment'); // the reply input section

        // Toggle the visibility of the create-reply section
        replySection.style.display = replySection.style.display === 'none' || replySection.style.display === '' ? 'block' : 'none';

        // Check if it's a reply to a reply
        const isReplyToReply = comment.classList.contains('reply');

        // Adjust the margin-left for replies (0px for comment replies, 50px for reply replies)
        replySection.style.marginLeft = isReplyToReply ? '50px' : '0px';
      });
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
        const dropdowns = document.querySelectorAll('.post-navigate-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
  
        if (event.target.classList.contains('dropdown-item')) {
            const action = event.target.textContent;
            if (action === 'Save') {
                console.log('Post saved');
            } else if (action === 'Report') {
                console.log('Post reported');
            }
  
            dropdowns.forEach(menu => {
                menu.style.display = 'none';
            });
        }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
        document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    document.querySelectorAll('.post-navigate-button').forEach(button => {
        button.addEventListener('click', function(event) {
            document.querySelectorAll('.post-navigate-dropdown').forEach(menu => {
                if (menu !== button.nextElementSibling) {
                    menu.style.display = 'none';
                }
            });
            const dropdownMenu = button.nextElementSibling;
            if (dropdownMenu) {
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    dropdownMenu.style.display = 'block';
                }
            }
            event.stopPropagation();
        });
    });
  }, []);
  

  return (
    <main className="content">
      <div id="createPostBackdrop" className="create-post-backdrop"></div>

      <div id="createPostModal" className="create-post-modal">
        <div className="modal-header">
          <img src="/src/pages/forum/assets/Post avatar.svg" alt="User Avatar" className="create-avatar" />
          <div className="create-user-name">John Doe</div>
          <div className="create-time">2 hours ago</div>
          <button className="close-button">X</button>
        </div>
        <div className="modal-body">
          <textarea placeholder="What's on your mind?" rows="4" className="modal-textarea"></textarea>
          <div className="visibility-options">
            <label htmlFor="visibility">Who can see this post?</label>
            <select id="visibility" className="visibility-dropdown">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button className="submit-button">Post</button>
        </div>
      </div>

      <section className="post-feed">
        <div className="post">
          <div className="post-header">
            <img src="/src/pages/forum/assets/Post avatar.svg" alt="User Avatar" className="user-avatar" />
            <div className="user-name">John Doe</div>
            <div className="post-time">2 hours ago</div>
            <div className="post-navigate-button">
              <span className="post-navigate-icon">...</span>
            </div>
            <div className="post-navigate-dropdown">
              <div className="dropdown-item">Save</div>
              <hr className="post-navigate-line" />
              <div className="dropdown-item" style={{ color: '#FF4B5C' }}>Report</div>
            </div>
          </div>
          <div className="post-body">
            <h1 className="post-title">Post title</h1>
            <p className="post-content">Post content</p>
          </div>
          <hr className="post-line" />
          <div className="post-footer">
            <div className="updown-button">
              <img className="upvote" src="/src/pages/forum/assets/Upvote.svg" alt="Upvote"/>
              <span className="vote-count">12</span>
              <img className="downvote" src="/src/pages/forum/assets/Downvote.svg" alt="Downvote" />
            </div>
            <button className="comment-button"><img src="/src/pages/forum/assets/Comment Icon.svg" className="post-action" />Comment</button>
            <button className="share-button"><img src="/src/pages/forum/assets/Share Icon.svg" className="post-action" /> Share</button>
          </div>
          <hr className="post-line" />
          <div className="comment-section">
            <div className="show-more">Show more comments</div>
            {/* Comment List */}
            <div className="comments-list">
              <div className="comment">
                <div className="comment-header">
                  <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" />
                  <span className="comment-user-name">Jane Smith</span>
                  <span className="comment-time">1 hour ago</span>
                </div>
                <div className="comment-body">
                  This is a sample comment.
                </div>
                <div className="comment-footer">
                  <button className="comment-reply"><img src="/src/pages/forum/assets/Comment Icon.svg" className="comment-action" />Reply</button>
                  <button className="comment-like"><img src="/src/pages/forum/assets/Share Icon.svg" className="comment-action" />Share</button>
                </div>
              </div>
              <div className="reply">
                <div className="comment-header">
                  <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" />
                  <span className="comment-user-name">Jane Smith</span>
                  <span className="comment-time">1 hour ago</span>
                </div>
                <div className="comment-body">
                  This is a sample comment.
                </div>
                <div className="comment-footer">
                  <button className="comment-reply"><img src="/src/pages/forum/assets/Comment Icon.svg" className="comment-action" />Reply</button>
                  <button className="comment-like"><img src="/src/pages/forum/assets/Share Icon.svg" className="comment-action" />Share</button>
                </div>
              </div>
              <div className="comment">
                <div className="comment-header">
                  <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" />
                  <span className="comment-user-name">Jane Smith</span>
                  <span className="comment-time">1 hour ago</span>
                </div>
                <div className="comment-body">
                  This is a sample comment.
                </div>
                <div className="comment-footer">
                  <button className="comment-reply"><img src="/src/pages/forum/assets/Comment Icon.svg" className="comment-action" />Reply</button>
                  <button className="comment-like"><img src="/src/pages/forum/assets/Share Icon.svg" className="comment-action" />Share</button>
                </div>
              </div>
            </div>
            <div className="create-comment" style={{ display: 'none' }}>
              <div className="create-comment-header">
                <img src="/src/pages/forum/assets/Comment avatar.svg" className="comment-avatar" />
                <textarea className="create-comment-input" placeholder="Write a comment..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Content;



