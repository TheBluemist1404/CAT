import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from "../../authentication/AuthProvider";
import Post from './Post';

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
      setTags(response.data); 
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const toggleTagSelection = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Upload");
      return;
    }
  }

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const createPost = async () => {
    if (title.trim() === '') {
      setError('Need title to create post');
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editorRef.current?.getContent());
    formData.append("userCreated", user._id);
    formData.append("status", visibility);
    selectedTags.forEach(tag => formData.append("tags", tag));
  
    if (image) {
      formData.append("images", image); 
    }
  
    setError('');
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/forum/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setTitle('');
      if (editorRef.current) editorRef.current.setContent('');
      setSelectedTags([]);
      setVisibility('public');
      setImage(null);
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
  
  const [fileName, setFileName] = useState("");

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set file name to display
      handleImageChange(event); // Call the parent function if needed
    }
  };
  
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
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table code help wordcount",
                    ],
                    toolbar:
                      "undo redo | code | formatselect | bold italic underline forecolor backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help",
                    placeholder: "Write your content here...",
                    content_style: `
                      body { font-family:Helvetica,Arial,sans-serif; font-size:14px;color: white;}
                      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                        color: grey;
                        opacity: 0.8;
                      }
                    `,
                  }}
                />

                <div style={{ textAlign: "center" }}>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImgChange}
                    style={{ display: "none" }}
                  />

                  <label 
                    htmlFor="fileInput" 
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      backgroundColor: "#2B2B3B",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "bold",
                      textAlign: "center",
                      border: "1px solid #FFFFFF",
                    }}
                  >
                    Upload Image
                  </label>

                  {fileName && (
                    <p style={{ marginTop: "10px", color: "#FFFFFF", fontSize: "14px" }}>
                      Selected: {fileName}
                    </p>
                  )}
                </div>

                <div className="tags-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: 10 }}>
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      className={`tag-suggestion ${selectedTags.includes(tag._id) ? "selected" : ""}`}
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