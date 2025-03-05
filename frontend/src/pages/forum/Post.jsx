import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';
import Prism from "prismjs";
import hljs from "highlight.js/lib/core"; 
import cpp from "highlight.js/lib/languages/cpp";
import "prismjs/themes/prism-okaidia.css"; 
import "highlight.js/styles/dark.css"; 
import "prismjs/components/prism-python"; 
import "prismjs/components/prism-javascript";
import "./PostGallery.css"; 


function Post({ post: initialPost, token, update }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext)
  const [post, setPost] = useState(initialPost);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(post.upvotes.length - post.downvotes.length)

  const [commentInput, setCommentInput] = useState('a');
  const [commentContent, setCommentContent] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const comments = post.comments;
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const sanitizedContent = DOMPurify.sanitize(post.content);
  const editorRef = useRef(null);
  const dropdownRef = useRef(null);
  const postRef = useRef(null);
  //Handle time display
  const timestamp = post.createdAt;
  const createdDate = new Date(timestamp);
  const now = new Date();
  const timeDiff = (now - createdDate); //in miliseconds

  useEffect(() => {
    const addButtons = () => {
      document.querySelectorAll("pre code").forEach((codeBlock, index) => {
        const pre = codeBlock.parentElement;
  
        if (pre.querySelector(".copy-button") || pre.querySelector(".download-button")) return;
  
        const langClass = codeBlock.className.match(/language-(\w+)/);
        const language = langClass ? langClass[1] : "txt";
        const fileExtension = getFileExtension(language);
        const defaultFileName = `snippet-${index + 1}.${fileExtension}`;
  
        const copyIconPath = "/src/pages/forum/assets/Copy.svg";
        const downloadIconPath = "/src/pages/forum/assets/Download.svg";
  
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button";
        copyButton.innerHTML = `
          <div style="display: flex; align-items: center; gap: 1px;">
            <img src="${copyIconPath}" alt="Copy" class="copy-icon" style="width: 16px; height: 16px; filter: invert(1);">
            <span class="copy-text">Copy</span>
          </div>`;
        Object.assign(copyButton.style, {
          position: "absolute",
          top: "5px",
          right: "100px",
          padding: "5px 10px",
          fontSize: "12px",
          border: "none",
          background: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          zIndex: "10",
        });
  
        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(codeBlock.innerText);
          copyButton.querySelector(".copy-text").innerText = "Copied!";
          setTimeout(() => {
            copyButton.querySelector(".copy-text").innerText = "Copy";
          }, 2000);
        });
  
        const downloadButton = document.createElement("button");
        downloadButton.className = "download-button";
        downloadButton.innerHTML = `
          <div style="display: flex; align-items: center; gap: 1px;">
            <img src="${downloadIconPath}" alt="Download" class="download-icon" style="width: 16px; height: 16px; filter: invert(1);">
            <span class="download-text">Download</span>
          </div>`;
        Object.assign(downloadButton.style, {
          position: "absolute",
          top: "5px",
          right: "5px",
          padding: "5px 10px",
          fontSize: "12px",
          border: "none",
          background: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          zIndex: "10",
        });
  
        downloadButton.addEventListener("click", () => {
          const fileName = prompt("Enter file name:", defaultFileName);
          if (!fileName) return; 
  
          const blob = new Blob([codeBlock.innerText], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
  
          downloadButton.querySelector(".download-text").innerText = "Downloaded!";
          setTimeout(() => {
            downloadButton.querySelector(".download-text").innerText = "Download";
          }, 2000);
        });
  
        pre.style.position = "relative";
        pre.appendChild(copyButton);
        pre.appendChild(downloadButton);
      });
    };
  
    addButtons();
  }, [post.content]);
  
  const getFileExtension = (language) => {
    const extensions = {
      javascript: "js",
      html: "html",
      css: "css",
      python: "py",
      java: "java",
      c: "c",
      cpp: "cpp",
      php: "php",
      ruby: "rb",
      swift: "swift",
      go: "go",
      rust: "rs",
      kotlin: "kt",
      ts: "ts",
      sql: "sql",
      bash: "sh",
    };
    return extensions[language] || "txt";
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
    }, [post.content]);
  let timeDisplay;
  if (timeDiff < 60 * 1000) {
    const seconds = Math.floor(timeDiff / 1000);
    timeDisplay = `${seconds} seconds ago`;
  } else if (timeDiff < 60 * 60 * 1000) {
    const minutes = Math.floor(timeDiff / (1000 * 60));
    timeDisplay = `${minutes} minutes ago`
  } else if (timeDiff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDisplay = `${hours} hours ago`
  } else {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    timeDisplay = `${days} days ago`
  }

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const [localComments, setLocalComments] = useState([]); // Temporary comments

  const handleAddComment = async () => {
    if (commentInput.trim()) {
      if (!isLoggedIn) {
        navigate('/auth/login');
      } else {
        const commentContent = editorRef.current?.getContent().trim();
        if (!commentContent) return; // Prevent empty comments
  
        const tempComment = {
          _id: `temp-${Date.now()}`, // Unique temporary ID
          content: commentContent,
          userDetails: {
            avatar: user.avatar, // Use current user's avatar
            fullName: user.fullName, // Use current user's name
          },
          createdAt: new Date().toISOString(),
        };
  
        setLocalComments((prev) => [...prev, tempComment]);
  
        try {
          const response = await axios.post(
            `http://localhost:3000/api/v1/forum/comment/${post._id}`,
            { content: commentContent, user: { id: user._id } },
            { headers: { Authorization: `Bearer ${token.accessToken}` } }
          );
  
          console.log(response);
        } catch (error) {
          console.error("Error adding comment:", error);
        }
  
        setCommentInput('');
        if (editorRef.current) {
          editorRef.current.setContent(''); // Ensure editor input clears
        }
      }
    }
  };
  
  
  const allComments = [...post.comments, ...localComments];
  
  const [activeReply, setActiveReply] = useState(null); 
  const toggleReplyEditor = (commentId) => {
    setActiveReply(activeReply === commentId ? null : commentId); 
  };

  const [localReplies, setLocalReplies] = useState({}); 

  const handleAddReply = async (commentId) => {
    const editorContent = editorRef.current[commentId]?.getContent();
    if (!editorContent.trim()) return;
  
    const tempReply = {
      _id: `temp-${Date.now()}`, 
      content: editorContent,
      userDetails: {
        avatar: user.avatar, 
        fullName: user.fullName, 
      },
      createdAt: new Date().toISOString(),
    };
  
    setLocalReplies((prev) => ({
      ...prev,
      [commentId]: [...(prev[commentId] || []), tempReply],
    }));
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/forum/reply/${commentId}`,
        { content: editorContent },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
  
      console.log("Reply posted:", response.data);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  
    editorRef.current[commentId]?.setContent("");
    setActiveReply(null);
  };
  


  const toggleCommentBox = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
  };

  useEffect(() => {
    const renderVote = () => {
      const upvote = post.upvotes;
      const userUpvote = upvote.find((voter) => voter.userId === user._id)
      if (userUpvote) {
        setIsUpvoted(true)
      }

      const downvote = post.downvotes;
      const userDownvote = downvote.find((voter) => voter.userId === user._id)
      if (userDownvote) {
        setIsDownvoted(true)
      }
    } 
    renderVote()
  }, [])

  const updateUpvote = async () => {
    try {
      console.log("update")
      const response = await axios.patch(`http://localhost:3000/api/v1/forum/vote/upvote/${post._id}`,
        { user: { id: user._id } },
        { headers: { "Authorization": `Bearer ${token.accessToken}` } })
      if (response) {
        const postUpdate = await fetchPosts();
        console.log(response, postUpdate)
      } else { console.log("no response at all") }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const getToken = await axios.post('http://localhost:3000/api/v1/token', { refreshToken: token.refreshToken })
        const newAccessToken = getToken.data.accessToken
        token.accessToken = newAccessToken;
        localStorage.setItem('token', JSON.stringify(token))

        await axios.patch(`http://localhost:3000/api/v1/forum/vote/upvote/${post._id}`,
          { user: { id: user._id } },
          { headers: { "Authorization": `Bearer ${newAccessToken}` } })
      }
    }
  }

  const updateDownvote = async () => {
    try {
      console.log("update")
      const response = await axios.patch(`http://localhost:3000/api/v1/forum/vote/downvote/${post._id}`, { user: { id: user._id } }, { headers: { "Authorization": `Bearer ${token.accessToken}` } })
      if (response) {
        const postUpdate = await fetchPosts();
        console.log(response, postUpdate)
      } else { console.log("no response at all") }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const getToken = await axios.post('http://localhost:3000/api/v1/token', { refreshToken: token.refreshToken })
        const newAccessToken = getToken.data.accessToken
        token.accessToken = newAccessToken;
        localStorage.setItem('token', JSON.stringify(token))

        await axios.patch(`http://localhost:3000/api/v1/forum/vote/downvote/${post._id}`,
          { user: { id: user._id } },
          { headers: { "Authorization": `Bearer ${newAccessToken}` } })
      }
    }
  }

  const handleUpvote = async () => {
    console.log("upvote")
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      if (isDownvoted) {
        setIsDownvoted(false);
        setVoteCount((count) => count + 1)
        updateDownvote();
      }
      if (!isUpvoted) {
        setIsUpvoted(!isUpvoted);
        setVoteCount((count) => !isUpvoted ? count + 1 : count)
        updateUpvote();
      } else {
        setIsUpvoted(!isUpvoted);
        setVoteCount((count) => isUpvoted ? count - 1 : count)
        updateUpvote();
      }
    }
  };

  const handleDownvote = async () => {
    console.log("downvote")
    if (!isLoggedIn) {
      navigate('/auth/login')
    } else {
      if (isUpvoted) {
        setIsUpvoted(false);
        setVoteCount((count) => count - 1)
        updateUpvote();
      }
      if (!isDownvoted) {
        setIsDownvoted(!isDownvoted);
        setVoteCount((count) => !isDownvoted ? count - 1 : count)
        updateDownvote();
      } else {
        setIsDownvoted(!isDownvoted);
        setVoteCount((count) => isDownvoted ? count + 1 : count)
        updateDownvote();
      }
    }
  };

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
  useEffect(() => {
    console.log(post._id); 
    if (user.savedPosts && Array.isArray(user.savedPosts)) {
      const isPostSaved = user.savedPosts.some(
        (savedPost) => savedPost._id.toString() === post._id.toString() 
      );
      setIsSaved(isPostSaved);
    }
  }, [post._id, user.savedPosts]);
  
  const handleSavePost = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/forum/save/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
  
      console.log(response.data); 
      if (response.status === 200) {
        setIsSaved(!isSaved);
      } else {
        console.error("Error updating save status:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving the post:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(null); 
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const renderDropdown = (index) => (
    <div
      ref={dropdownRef}
      className="post-navigate-dropdown"
      style={{ display: dropdownVisible === index ? "block" : "none" }}
    >
      <div className="dropdown-item" onClick={handleSavePost} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <img src={`/src/pages/forum/assets/${isSaved ? "unsave" : "save"}.svg`} alt="Save" width="14" height="14" />
        {isSaved ? "Unsave" : "Save"}
      </div>
      <hr className="post-navigate-line" />
      {post.userCreated._id === user._id ? (
        <div className="dropdown-item" onClick={handleDeletePost} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FF4B5C" }}>
          <img src="/src/pages/forum/assets/delete.svg" alt="Delete" width="14" height="14" />
          Delete
        </div>
      ) : (
        <div className="dropdown-item" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FF4B5C" }}>
          <img src="/src/pages/forum/assets/report.svg" alt="Report" width="14" height="14" />
          Report
        </div>
      )}
    </div>
  );
  
  const renderComments = () => (
    <div className="comments-list">
      {allComments.map((comment) => {
        const sanitizedContent = DOMPurify.sanitize(comment.content); 
        const isReplyEditorOpen = activeReply === comment._id;
        return (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                <img 
                  src={comment.userDetails.avatar} 
                  className="comment-avatar" 
                  alt="Avatar" 
                  style={{ width: '40px' }} 
                />
              </div>
              <span className="comment-user-name">{comment.userDetails.fullName}</span>
              {/* <span className="comment-time">{comment.time}</span> */}
            </div>
            <div 
              className="comment-body" 
              dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Use sanitized HTML content
            ></div>
            <div className="comment-footer">
            <button className="comment-reply"  onClick={() => {if (!isLoggedIn) {navigate('/auth/login'); } else {toggleReplyEditor(comment._id);}}}>
            <img 
                  src="/src/pages/forum/assets/Comment Icon.svg" 
                  className="comment-action" 
                  alt="Reply" 
                /> 
                Reply
              </button>
            </div>
            {isReplyEditorOpen && (
              <div className="create-comment-header">
                <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden' }}><img src={user.avatar} className="comment-avatar" alt="Avatar" style={{ width: '40px' }} /></div>
                <Editor
                  apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                  onInit={(_, editor) => {
                    editorRef.current[comment._id] = editor;
                  }}
                  init={{
                    height: 150,
                    width: 850,
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
                    placeholder: "Write your reply here...",
                    content_style: `
                      body { font-family:Helvetica,Arial,sans-serif; font-size:14px;color: white;}
                      .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                        color: grey;
                        opacity: 0.8;
                      }
                    `,
                  }}
                />
                <button
                  className="submit-comment"
                  onClick={() => handleAddReply(comment._id)}
                >
                  Post
                </button>
              </div>
            )}
              {localReplies[comment._id]?.map((reply) => (
                <div key={reply._id} className="reply temp-reply">
                  <div className="comment-header">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={reply.userDetails.avatar} alt="Avatar" className="comment-avatar" style={{ width: '40px' }} />
                    </div>
                    <span className="comment-user-name">{reply.userDetails.fullName}</span>
                  </div>
                  <div className="comment-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.content) }}></div>
                </div>
              ))}
            <hr className="post-line" style={{ marginTop: '10px' }} />
          </div>
        );
      })}
    </div>
  );

  const tags = post.tags;
  const [tag, setTags] = useState([]);
  const handleSubmit = () => {
    if (tags.length > 0) {
      const titles = tags.map((tag) => `#${tag.title}`);
      setTags(titles);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const handleFocus = () => {
    if (!isLoggedIn) {
      navigate("/auth/login");
    }
  };
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/forum/delete/${post._id}`, {
        headers: { "Authorization": `Bearer ${token.accessToken}` },
      });
  
      if (response.status === 200) {
        setIsDeleted(true); // Hide the post instead of removing it
      }
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!post || !post.images) return <div className="post-gallery-container"></div>;

  const images = post.images.slice(0, 5);
  const remainingCount = post.images.length - 5;

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
  const defaultAvatar = "https://res.cloudinary.com/cat-project/image/upload/v1735743336/coder-sign-icon-programmer-symbol-vector-2879989_ecvn23.webp";


  if (isDeleted) return null;
  return (
    <div className="post">
      <div className="post-header">
        <img src={post.userCreated ? post.userCreated.avatar : "/src/pages/forum/assets/Post avatar.svg"} alt="User Avatar" className="user-avatar" onClick={()=>{navigate(`/profile/${post.userCreated._id}`)}} style={{cursor:'pointer'}}/>
        <div className="user-name" onClick={()=>{navigate(`/profile/${post.userCreated._id}`)}} style={{cursor:'pointer'}}>{post.userCreated ? post.userCreated.fullName : "unknown"}</div>
        <div className="post-time" onMouseDown={() => { navigate(`/forum/${post._id}`) }} style={{cursor:'pointer'}}>{timeDisplay}</div>
        <div className="post-navigate-button" onClick={() => toggleDropdown(1)}>
          <span className="post-navigate-icon">...</span>
        </div>
        {renderDropdown(1)}
      </div>
      <div className="post-body">
        <h1 className="post-title" onMouseDown={() => { navigate(`/forum/${post._id}`) }} style={{cursor:'pointer'}}>{post.title}</h1>
        <p className="post-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }}></p>
        <div className="post-gallery-container">
        <div className={`post-gallery-grid-container ${getGridClass(images.length)}`}>
          {images.map((img, index) => (
            index === 4 && remainingCount > 0 ? (
              <div key={index} className="post-gallery-overlay-container" style={{ gridColumn: 'span 2' }} onClick={() => handleClick(index)}>
                <img src={img} alt={`img-${index}`} className="post-gallery-blurred-image" />
                <div className="post-gallery-overlay-text">+{remainingCount}</div>
              </div>
            ) : (
              <img
                key={index}
                src={img}
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
            <button className="post-gallery-nav-button post-gallery-left" onClick={() => setPhotoIndex((photoIndex - 1 + post.images.length) % post.images.length)}>◀</button>

            <img src={post.images[photoIndex]} alt="Enlarged" className="post-gallery-modal-image" />

            <button className="post-gallery-nav-button post-gallery-right" onClick={() => setPhotoIndex((photoIndex + 1) % post.images.length)}>▶</button>

            {/* <div className="post-gallery-index">{photoIndex + 1} / {post.images.length}</div> */}

            <div className="post-gallery-dots">
              {post.images.map((_, i) => (
                <span key={i} className={`dot ${i === photoIndex ? "active" : ""}`} onClick={() => setPhotoIndex(i)}></span>
              ))}
            </div>
          </div>
        )}
        </div>
        <div className="tag-box">
          {tag.map((tag, index) => (
            <div className="post-tags" key={index}>{tag}</div>
          ))}
        </div>
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
      {isCommentBoxVisible && (
        <div className="comment-section" style={{ padding: '10px' }}>
          {renderComments()}
          <div className="create-comment">
            <div className="create-comment-header">
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden' }}><img src={!isLoggedIn ? defaultAvatar : user.avatar} className="comment-avatar" alt="Avatar" style={{ width: '40px' }} /></div>
              <Editor
                apiKey={textEditorAPI}
                onInit={(_, editor) => (editorRef.current = editor)}
                value={commentInput}
                onEditorChange={(newContent) => setCommentInput(newContent)}
                onFocus={handleFocus}
                init={{
                  height: 150,
                  width: 800,
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
                  placeholder: "Write your comment here...",
                  content_style: `
                    body { font-family:Helvetica,Arial,sans-serif; font-size:14px;color: white;}
                    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                      color: grey;
                      opacity: 0.8;
                    }
                  `,
                }}
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
