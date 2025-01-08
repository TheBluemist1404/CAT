import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Post from './Post';
import { useEffect, useState } from 'react';

const Content = ({ isCreatePostOpen, handleCreatePostToggle, page, token }) => {
  const [postFeed, setPostFeed] = useState([])
  //get query
  const location = useLocation();

  const getQueryParams = (search) => {
    const Params = new URLSearchParams(search);
    const page = parseInt(Params.get('page'));
    const limit = parseInt(Params.get('limit'));
    const offset = (page - 1) * limit
    return { offset, limit }
  }

  const queryParams = getQueryParams(location.search);

  const fetchPosts = async () => {
    {
      try {
        const posts = await axios.get(`http://localhost:3000/api/v1/forum?offset=${queryParams.offset}&limit=${queryParams.limit}`)
        if (posts){
          setPostFeed(posts.data)
        } else {
          console.log("not posts")
        }
      } catch (error) {
        console.error("fetch posts failed", error)
      }
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [])

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

      <section className="post-feed" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '50px'}}>
        {postFeed.map((post, index) => (
          <Post post={post} token={token} update={fetchPosts}/>
        ))}
      </section>
    </main>
  );
};

export default Content;
