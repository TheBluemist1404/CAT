import { Editor } from "@tinymce/tinymce-react";
import axios from 'axios';
import React, { useEffect, useState, useContext, useRef,Suspense } from 'react';
import { AuthContext } from "../../authentication/AuthProvider";
import Prism from "prismjs";
import hljs from "highlight.js/lib/core"; 
import cpp from "highlight.js/lib/languages/cpp";
import "prismjs/themes/prism.css"; 
import "highlight.js/styles/monokai-sublime.css"; 
import "prismjs/components/prism-python"; 
import "prismjs/components/prism-javascript";

const Post = React.lazy(() => import('./Post'));


const Content = ({ isCreatePostOpen, handleCreatePostToggle, token, currentPage, setTotalPages, render }) => {
  const { isLoggedIn, user } = useContext(AuthContext)

  const [postFeed, setPostFeed] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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

  const [images, setImages] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };
  
  const createPost = async () => {
    if (title.trim() === '') {
      setError('Need title to create post');
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editorRef.current?.getContent());
    formData.append("status", visibility);
    selectedTags.forEach(tag => formData.append("tags", tag));
  
    images.forEach(image => formData.append("images", image));
  
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
      setImages([]); 
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

  const [previewPost, setPreviewPost] = useState(null); // New State for Preview

  const handlePreview = () => {
    setPreviewPost({
      title,
      content: editorRef.current?.getContent(),
      userCreated: user,
      images: images.map(file => URL.createObjectURL(file)),
      tags: selectedTags.map(tagId => tags.find(tag => tag._id === tagId)?.title),
    });
  };

const [isPreviewOpen, setIsPreviewOpen] = useState(false);
const [previewContent, setPreviewContent] = useState({
  title: "",
  content: "",
  images: [],
});

// Function to open preview
const handlePreviewClick = () => {
  if (title.trim() === '') {
    setError('Need title to preview post');
    return;
  }

  setPreviewContent({
    title,
    content: editorRef.current?.getContent() || "",
    images,
  });
  setIsPreviewOpen(true);
};

hljs.registerLanguage("cpp", cpp); 

useEffect(() => {
  Prism.highlightAll(); 

  document.querySelectorAll("pre code.language-cpp").forEach((block) => {
    block.classList.remove("language-cpp"); 
    block.classList.add("cpp"); 
    block.removeAttribute("data-highlighted"); 
    hljs.highlightElement(block); 
  });
}, [previewContent.content]);

// Function to close preview
const closePreview = () => {
  setIsPreviewOpen(false);
};

const [isOpen, setIsOpen] = useState(false);
const [photoIndex, setPhotoIndex] = useState(0);

if (!previewContent.images) return <div className="post-gallery-container"></div>;

const imageset = previewContent.images.slice(0, 5);
const remainingCount = previewContent.images.length - 5;

const handleClick = (index) => {
  setPhotoIndex(index);
  setIsOpen(true);
};

const getGridClass = (count) => {
  if (count === 1) return "post-gallery-grid-1";
  if (count === 2) return "post-gallery-grid-2";
  if (count === 3) return "post-gallery-grid-3";
  if (count === 4) return "post-gallery-grid-4";
  return "post-gallery-grid-5plus";
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
                    selector: 'textarea',
                    plugins: [
                      "advlist autolink lists link image charmap preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table code help wordcount",
                      "codesample",
                      "code",
                    ],
                    toolbar:
                      "undo redo| code | formatselect | bold italic underline forecolor backcolor | codesample | \
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
                    multiple
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

                  <button
                    style={{
                      marginLeft: "10px",
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
                    onClick={() => setIsImagePreviewOpen(true)} // Open Image Preview Modal
                    disabled={images.length === 0} // Disable if no images
                  >
                    Preview Images
                  </button>


                  <button
                      style={{
                      marginLeft: "10px",
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
                      border: "1px solid #FFFFFF",}}
                      onClick={handlePreviewClick}
                  >
                    Preview Post
                  </button>

                  {images.length > 0 && (
                    <p style={{ marginTop: "10px", color: "#FFFFFF", fontSize: "14px" }}>
                      Selected: {images.slice(-3).map(file => file.name).join(", ")}
                      {images.length > 3 ? ` +${images.length - 3}` : ""}
                    </p>
                  )}
                </div>

                {isImagePreviewOpen && (
                  <div 
                    className="preview-modal"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 9999,
                    }}
                  >
                    <div 
                      className="modal-container"
                      style={{
                        backgroundColor: "#282A36",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "500px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                      }}
                    >
                      <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2>Preview Images</h2>
                        <button className="close-button" onClick={() => setIsImagePreviewOpen(false)}>X</button>
                      </div>

                      <div className="image-list">
                        {images.map((image, index) => (
                          <div 
                            key={index} 
                            className="image-item" 
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px",
                              borderBottom: "1px solid #444",
                              color: "white",
                            }}
                          >
                            <span>{image.name}</span>
                            <button 
                              style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                padding: "5px 10px",
                              }}
                              onClick={() => {
                                setImages(images.filter((_, i) => i !== index));
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

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
                {isPreviewOpen && (
                  <div 
                    className="preview-modal"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 9999,
                    }}
                  >
                    <div 
                      className="modal-container"
                      style={{
                        backgroundColor: "#282A36",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "800px",
                        maxHeight: "80vh",   
                      }}
                    >
                      <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2>Preview Post</h2>
                        <button className="close-button" onClick={closePreview}>X</button>
                      </div>
                      
                      <div className="post" style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}> 
                        <h1 className="post-title">{previewContent.title}</h1>
                        <p className="post-content" dangerouslySetInnerHTML={{ __html: previewContent.content }}></p>
                        <div className="post-gallery-container">
                          <div className={`post-gallery-grid-container ${getGridClass(images.length)}`}>
                            {imageset.map((img, index) => (
                              index === 4 && remainingCount > 0 ? (
                                <div key={index} className="post-gallery-overlay-container" style={{ gridColumn: 'span 2' }} onClick={() => handleClick(index)}>
                                  <img src={URL.createObjectURL(img)} alt={`img-${index}`} className="post-gallery-blurred-image" />
                                  <div className="post-gallery-overlay-text">+{remainingCount}</div>
                                </div>
                              ) : (
                                <img
                                  key={index}
                                  src={URL.createObjectURL(img)}
                                  alt={`img-${index}`}
                                  onClick={() => handleClick(index)}
                                  className="post-gallery-image"
                                  style={index === 4 ? { gridColumn: 'span 2' } : {}}
                                  loading="lazy"
                                />
                              )
                            ))}
                          </div>

                          {isOpen && (
                            <div className="post-gallery-modal">
                              <button className="post-gallery-close-button" onClick={() => setIsOpen(false)}>✖</button>
                              <button className="post-gallery-nav-button post-gallery-left" onClick={() => setPhotoIndex((photoIndex - 1 + previewContent.images.length) % previewContent.images.length)}>◀</button>

                              <img src={URL.createObjectURL(previewContent.images[photoIndex])} alt="Enlarged" className="post-gallery-modal-image" />

                              <button className="post-gallery-nav-button post-gallery-right" onClick={() => setPhotoIndex((photoIndex + 1) % previewContent.images.length)}>▶</button>

                              {/* <div className="post-gallery-index">{photoIndex + 1} / {post.images.length}</div> */}

                              <div className="post-gallery-dots">
                                {previewContent.images.map((_, i) => (
                                  <span key={i} className={`dot ${i === photoIndex ? "active" : ""}`} onClick={() => setPhotoIndex(i)}></span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>                   
                      </div>
                    </div>
                  </div>
                )}

                
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
          {postFeed && (
            <Suspense fallback={<div>Loading posts...</div>}>
              {postFeed.map((post, index) => (
                <Post key={index} post={post} token={token} update={fetchPosts} />
              ))}
            </Suspense>
          )}
        </section>
      </div>

    </main>
  );
};

export default Content;