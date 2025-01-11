import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../authentication/AuthProvider";
import Post from './Post';
import Detail from './Detail_post';


const Content = ({ isCreatePostOpen, handleCreatePostToggle, token, currentPage, setTotalPages, render }) => {
  const { isLoggedIn, user } = useContext(AuthContext)

  const [postFeed, setPostFeed] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [error, setError] = useState('');

  const fetchPosts = async (page) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/forum?offset=${offset}&limit=${limit}`);
      const posts = response.data[0].posts
      console.log(posts)
      setPostFeed(posts);
      setTotalPages(posts.length);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const createPost = async () => {
    if (title.trim() === '') {
      setError('Need title to create post');
      return;
    }

    setError(''); 
    
    const extractedTags = tags
    .split(' ')
    .filter(tag => tag.startsWith('#'))
    .map(tag => tag.slice(1));

    try {
      // console.log("Creating post with:", { title, content, visibility });
      // console.log("Token:", token);

      // const objectID = token;

      const response = await axios.post(
        'http://localhost:3000/api/v1/forum/create',
        {
          title,
          content,
          userCreated: user._id,
          status: visibility,
          tags: extractedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      // console.log('Post created:', response.data);

      setTitle('');
      setContent('');
      setTags('');
      setVisibility('public');
      handleCreatePostToggle();
      fetchPosts(currentPage);
    } catch (error) {
      console.error('Failed to create post:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <main className="content">
      {render === "forum" ? (<div style={{width: '100%'}}>
        {isCreatePostOpen && (
          <div className="create-post-modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', transform: 'translateX(0)' }}>
            <div className="modal-container" style={{ backgroundColor: '#1E1E2F', padding: '20px', borderRadius: '10px', width: '1000px' }}>
              <div className="modal-header">
                <img src={user.avatar} alt="User Avatar" className="create-avatar" />
                <div className="create-user-name">{user.fullName}</div>
                <button className="close-button" onClick={handleCreatePostToggle}>X</button>
              </div>
              <div className="modal-body">
                <textarea placeholder="Title" rows="1" className="modal-textarea-title" style={{ marginBottom: 10 }} value={title} onChange={(e) => setTitle(e.target.value)} />
                {error && <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</div>}
                <textarea placeholder="What's on your mind?" rows="4" className="modal-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
                <textarea placeholder="Tags Ex: #ObjectID (cannot fetch tags in db yet)" className="modal-textarea-tags" style={{ marginTop: 10 }} onChange={(e) => setTags(e.target.value)} />
                <div className="visibility-options">
                  <label htmlFor="visibility">Who can see this post?</label>
                  <select id="visibility" className="visibility-dropdown" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <button className="submit-button" onClick={createPost}>Post</button>
              </div>
            </div>
          </div>
        )}
        <section className="post-feed" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {postFeed.map((post, index) => (
            <Post key={index} post={post} token={token} update={fetchPosts} />
          ))}
        </section>
      </div>): (<Detail/>)}

    </main>
  );
};

export default Content;