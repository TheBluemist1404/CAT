import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from "../../authentication/AuthProvider";
import Post from './Post';
import Detail from './Detail_post';

const Content = ({ isCreatePostOpen, handleCreatePostToggle, token, currentPage, setTotalPages, render }) => {
  const { isLoggedIn, user } = useContext(AuthContext)

  const [postFeed, setPostFeed] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [error, setError] = useState('');

  const editorRef = useRef(null);

  const fetchPosts = async (page) => {
    setPostFeed(null)
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/forum?offset=${offset}&limit=${limit}`);
      const posts = response.data[0].posts
      setPostFeed(posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/forum/tags");
      setTags(response.data); // response.data contains all tag objects
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const toggleTagSelection = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };


  const createPost = async () => {
    if (title.trim() === '') {
      setError('Need title to create post');
      return;
    }

    const content = editorRef.current?.getContent();

    setError(''); 

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/forum/create',
        {
          title,
          content,
          userCreated: user._id,
          status: visibility,
          tags: selectedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            Type: 'multipart/form-data',
          },
        }
      );

      setTitle('');
      if (editorRef.current) editorRef.current.setContent('');
      setSelectedTags([]);
      setVisibility('public');
      handleCreatePostToggle();
      fetchPosts(currentPage);
    } catch (error) {
      console.error('Failed to create post:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
    fetchTags();
  }, [currentPage]);

  const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  return (
    <main className="content">
      <div style={{width: '100%'}}>
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
                {error && (<div className="title-error" style={{ color: "red", fontSize: "16px", }}>{error}</div>)}
                <Editor
                  apiKey={textEditorAPI}
                  onInit={(_, editor) => (editorRef.current = editor)}
                  initialValue="<p>Write your content here...</p>"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table code help wordcount",
                      "image",
                    ],
                    toolbar:
                      "undo redo | link image | code | formatselect | bold italic underline forecolor backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
                <div className="tags-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: 10 }}>
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      className={`tag-box ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                      onClick={() => toggleTagSelection(tag._id)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "5px",
                        backgroundColor: selectedTags.includes(tag._id) ? "#FF4B5C" : "#2B2B3B",
                        color: "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      #{tag.title}
                    </div>
                  ))}
                </div>
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
        {postFeed && postFeed.map((post, index) => (
            <Post key={index} post={post} token={token} update={fetchPosts} />
          ))}
        </section>
      </div>

    </main>
  );
};

export default Content;