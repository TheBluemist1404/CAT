import copyIconPath from "/forum/Copy.svg";
import  downloadIconPath from "/forum/Download.svg";
import upvoteChosen from '/forum/Upvote-chosen.svg'
import upvote from '/forum/Upvote-chosen.svg'
import upvoteHover from "/forum/Upvote-hover.svg"
import downvoteChosen from '/forum/Downvote-chosen.svg'
import downvote from '/forum/Downvote-chosen.svg'
import downvoteHover from "/forum/Downvote-hover.svg"
import save from "/forum/save.svg"
import unsave from "/forum/unsave.svg"
import deleteSvg from "/forum/delete.svg"
import report from "/forum/report.svg"
import commentSvg from "/forum/Comment Icon.svg"
import postAvatar from "/forum/Post avatar.svg"
import share from "/forum/Share Icon.svg"


import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import Prism from "prismjs";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import "prismjs/themes/prism-okaidia.css";
import "highlight.js/styles/dark.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import DOMPurify from "dompurify";

function Detail({ token }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, fetch } = useContext(AuthContext);
  const [post, setPost] = useState();

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(
    post ? post.upvotes.length - post.downvotes.length : 0
  );

  const [commentInput, setCommentInput] = useState("a");
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const editorRef = useRef(null);

  const { id } = useParams();
  const fetchData = async () => {
    const data = await fetch(token, axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/detail/${id}`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    ))
    
    if (data) {
      setPost(data);
      const upvote = data.upvotes;
      const userUpvote = upvote.find((voter) => voter.userId === user._id);
      if (userUpvote) {
        setIsUpvoted(true);
      }

      const downvote = data.downvotes;
      const userDownvote = downvote.find(
        (voter) => voter.userId === user._id
      );
      if (userDownvote) {
        setIsDownvoted(true);
      }
      setVoteCount(upvote.length - downvote.length);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login");
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const addButtons = () => {
      document.querySelectorAll("pre code").forEach((codeBlock, index) => {
        const pre = codeBlock.parentElement;

        if (
          pre.querySelector(".copy-button") ||
          pre.querySelector(".download-button")
        )
          return;

        const langClass = codeBlock.className.match(/language-(\w+)/);
        const language = langClass ? langClass[1] : "txt";
        const fileExtension = getFileExtension(language);
        const defaultFileName = `snippet-${index + 1}.${fileExtension}`;

        

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

          downloadButton.querySelector(".download-text").innerText =
            "Downloaded!";
          setTimeout(() => {
            downloadButton.querySelector(".download-text").innerText =
              "Download";
          }, 2000);
        });

        pre.style.position = "relative";
        pre.appendChild(copyButton);
        pre.appendChild(downloadButton);
      });
    };

    addButtons();
  }, [post ? post.content : ""]);

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
  }, [post ? post.content : ""]);

  const sanitizedContent = DOMPurify.sanitize(post ? post.content : "");
  //Handle time display
  const timestamp = post ? post.createdAt : new Date();
  const createdDate = new Date(timestamp);
  const now = new Date();
  const timeDiff = now - createdDate; //in miliseconds

  let timeDisplay;
  if (timeDiff < 60 * 1000) {
    const seconds = Math.floor(timeDiff / 1000);
    timeDisplay = `${seconds} seconds ago`;
  } else if (timeDiff < 60 * 60 * 1000) {
    const minutes = Math.floor(timeDiff / (1000 * 60));
    timeDisplay = `${minutes} minutes ago`;
  } else if (timeDiff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDisplay = `${hours} hours ago`;
  } else {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    timeDisplay = `${days} days ago`;
  }

  const toggleDropdown = (index) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const handleCommentInput = (e) => {
    setCommentInput(e.target.value);
  };

  const handleAddComment = async () => {
    if (commentInput.trim()) {
      if (!isLoggedIn) {
        navigate("/auth/login");
      } else {
        const commentContent = editorRef.current?.getContent();
        const data = await fetch(token, axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/comment/${post._id}`,
          { content: commentContent, user: { id: user._id } },
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        ))
        if (editorRef.current) editorRef.current.setContent("");

        // Refetch the post data to get the updated comments
        fetchData(); // This triggers the re-render
        setCommentInput("");
      }
    }
  };

  const [activeReply, setActiveReply] = useState(null); // Track which comment's reply editor is open
  // Function to handle showing the reply editor
  const toggleReplyEditor = (commentId) => {
    setActiveReply(activeReply === commentId ? null : commentId); // Toggle reply editor for the comment
  };

  // Handle adding a reply to a comment
  const handleAddReply = async (commentId) => {
    const editorContent = editorRef.current[commentId]?.getContent();
    if (!editorContent.trim()) return;

    const data = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/reply/${commentId}`,
      { content: editorContent },
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );

    editorRef.current[commentId]?.setContent("");
    setActiveReply(null);

    fetchData();
  };

  const updateUpvote = async () => {
    const data = await fetch(token, axios.patch(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/vote/upvote/${post._id}`,
      { user: { id: user._id } },
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    ))
    if (data) {
      await fetchPosts();
    } 
  };

  const updateDownvote = async () => {
    const data = await fetch(token, axios.patch(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/vote/downvote/${post._id}`,
      { user: { id: user._id } },
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    ))
    if (data) {
      await fetchPosts();
    } 
  };

  const handleUpvote = async () => {
    console.log("upvote");
    if (!isLoggedIn) {
      navigate("/auth/login");
    } else {
      if (isDownvoted) {
        setIsDownvoted(false);
        setVoteCount((count) => count + 1);
        updateDownvote();
      }
      if (!isUpvoted) {
        setIsUpvoted(!isUpvoted);
        setVoteCount((count) => (!isUpvoted ? count + 1 : count));
        updateUpvote();
      } else {
        setIsUpvoted(!isUpvoted);
        setVoteCount((count) => (isUpvoted ? count - 1 : count));
        updateUpvote();
      }
    }
  };

  const handleDownvote = async () => {
    console.log("downvote");
    if (!isLoggedIn) {
      navigate("/auth/login");
    } else {
      if (isUpvoted) {
        setIsUpvoted(false);
        setVoteCount((count) => count - 1);
        updateUpvote();
      }
      if (!isDownvoted) {
        setIsDownvoted(!isDownvoted);
        setVoteCount((count) => (!isDownvoted ? count - 1 : count));
        updateDownvote();
      } else {
        setIsDownvoted(!isDownvoted);
        setVoteCount((count) => (isDownvoted ? count + 1 : count));
        updateDownvote();
      }
    }
  };

  const renderVoteButtons = () => (
    <div className="updown-button">
      <img
        className="upvote"
        src={isUpvoted? upvoteChosen: upvote}
        alt="Upvote"
        onClick={handleUpvote}
        onMouseEnter={(e) => {
          if (!isUpvoted)
            e.target.src = {upvoteHover};
        }} //mouseEnter is actually better than mouseOver here, research for more info
        onMouseLeave={(e) => {
          if (!isUpvoted) e.target.src = {upvote};
        }}
      />
      <span
        className="vote-count"
        style={{ color: isUpvoted ? "#FF4B5C" : isDownvoted ? "#42C8F5" : "" }}
      >
        {voteCount}
      </span>
      <img
        className="downvote"
        src={isDownvoted ? downvoteChosen: downvote}
        alt="Downvote"
        onClick={handleDownvote}
        onMouseEnter={(e) => {
          if (!isDownvoted)
            e.target.src = {downvoteHover};
        }}
        onMouseLeave={(e) => {
          if (!isDownvoted)
            e.target.src = {downvote};
        }}
      />
    </div>
  );

  useEffect(() => {
    // Ensure post is defined before proceeding
    if (!post || !post._id) {
      console.error("Post is undefined or missing _id.");
      return;
    }

    console.log(post._id); // Debugging post._id value

    if (user.savedPosts && Array.isArray(user.savedPosts)) {
      const isPostSaved = user.savedPosts.some(
        (savedPost) => savedPost._id.toString() === post._id.toString() // Updated comparison
      );
      setIsSaved(isPostSaved);
    }
  }, [post, user.savedPosts]); // Make sure post is also included in the dependencies

  const handleSavePost = async () => {
    // Ensure post is defined before making the API call
    if (!post || !post._id) {
      console.error("Post is undefined, can't save the post.");
      return;
    }

    const data = await fetch(token, axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/save/${post._id}`,
      {},
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    ))

    if (data) {
      setIsSaved(!isSaved); // Toggle the save status
    } else {
      console.error("Error updating save status:", response.data.message);
    }
  };

  const handleDeletePost = async () => {
    const data = await axios.delete(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/forum/delete/${post._id}`,
      {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }
    );
    if (data) {
      navigate(`/forum`);
    }
  };

  const renderDropdown = (index) => (
    <div
      className="post-navigate-dropdown"
      style={{ display: dropdownVisible === index ? "block" : "none" }}
    >
      <div className="dropdown-item" onClick={handleSavePost}>
        <img
          src={isSaved ? save: unsave}
          alt="Save"
          style={{ width: 16, height: 16, marginRight: 8 }}
        />
        {isSaved ? "Unsave" : "Save"}
      </div>
      <hr className="post-navigate-line" />
      {post?.userCreated._id === user._id ? (
        <div
          className="dropdown-item"
          style={{ color: "#FF4B5C" }}
          onClick={handleDeletePost}
        >
          <img
            src={deleteSvg}
            alt="Delete"
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          Delete
        </div>
      ) : (
        <div className="dropdown-item" style={{ color: "#FF4B5C" }}>
          <img
            src={report}
            alt="Report"
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          Report
        </div>
      )}
    </div>
  );

  //Render comments ---------------------------
  const comments = post ? post.comments : [];
  const sortComments = [...comments].reverse();
  const renderComments = () => (
    <div className="comments-list">
      {sortComments.map((comment) => {
        const sanitizedContent = DOMPurify.sanitize(comment.content); // Sanitize the comment content
        const isReplyEditorOpen = activeReply === comment._id;
        return (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={comment.userDetails.avatar}
                  className="comment-avatar"
                  alt="Avatar"
                  style={{ width: "40px" }}
                />
              </div>
              <span className="comment-user-name">
                {comment.userDetails.fullName}
              </span>
              {/* <span className="comment-time">{comment.time}</span> */}
            </div>
            <div
              className="comment-body"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Use sanitized HTML content
            ></div>
            <div className="comment-footer">
              <button
                className="comment-reply"
                onClick={() => toggleReplyEditor(comment._id)}
              >
                <img
                  src={commentSvg}
                  className="comment-action"
                  alt="Reply"
                />
                Reply
              </button>
            </div>
            {isReplyEditorOpen && (
              <div className="create-comment-header">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={user.avatar}
                    className="comment-avatar"
                    alt="Avatar"
                    style={{ width: "40px" }}
                  />
                </div>
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

            {/* Render Replies */}
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply">
                  <div className="comment-header">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={reply.userDetails.avatar}
                        alt="Avatar"
                        className="comment-avatar"
                        style={{ width: "40px" }}
                      />
                    </div>
                    <span className="comment-user-name">
                      {reply.userDetails.fullName}
                    </span>
                  </div>
                  <div
                    className="comment-body"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(reply.content),
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <hr className="post-line" style={{ marginTop: "10px" }} />
          </div>
        );
      })}
    </div>
  );

  const [tag, setTags] = useState([]);

  const handleSubmit = () => {
    const tags = post ? post.tags : [];
    if (tags.length > 0) {
      const titles = tags.map((tag) => `#${tag.title}`);
      setTags(titles);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [post]);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!post || !post.images)
    return <div className="post-gallery-container"></div>;

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

  const screenHeight = window.innerHeight;

  const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  {if (post && post._id) return (
    <section
      className="detail-post-box"
      style={{ minHeight: `${screenHeight}px` }}
    >
      <div className="post">
        <div className="post-header">
          <img
            src={
              post
                ? post.userCreated.avatar
                : postAvatar
            }
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-name">
            {post ? post.userCreated.fullName : "unknown"}
          </div>
          <div className="post-time">{timeDisplay}</div>
          <div
            className="post-navigate-button"
            onClick={() => toggleDropdown(1)}
          >
            <span className="post-navigate-icon">...</span>
          </div>
          {renderDropdown(1)}
        </div>
        <div className="post-body">
          <h1
            className="post-title"
            onMouseDown={() => {
              navigate(`/forum/${post._id}`);
            }}
          >
            {post ? post.title : ""}
          </h1>
          <p
            className="post-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          ></p>
          <div className="post-gallery-container">
            <div
              className={`post-gallery-grid-container ${getGridClass(
                images.length
              )}`}
            >
              {images.map((img, index) =>
                index === 4 && remainingCount > 0 ? (
                  <div
                    key={index}
                    className="post-gallery-overlay-container"
                    style={{ gridColumn: "span 2" }}
                    onClick={() => handleClick(index)}
                  >
                    <img
                      src={img}
                      alt={`img-${index}`}
                      className="post-gallery-blurred-image"
                    />
                    <div className="post-gallery-overlay-text">
                      +{remainingCount}
                    </div>
                  </div>
                ) : (
                  <img
                    key={index}
                    src={img}
                    alt={`img-${index}`}
                    onClick={() => handleClick(index)}
                    className="post-gallery-image"
                    style={index === 4 ? { gridColumn: "span 2" } : {}}
                  />
                )
              )}
            </div>

            {isOpen && (
              <div className="post-gallery-modal">
                <button
                  className="post-gallery-close-button"
                  onClick={() => setIsOpen(false)}
                >
                  ✖
                </button>
                <button
                  className="post-gallery-nav-button post-gallery-left"
                  onClick={() =>
                    setPhotoIndex(
                      (photoIndex - 1 + post.images.length) % post.images.length
                    )
                  }
                >
                  ◀
                </button>

                <img
                  src={post.images[photoIndex]}
                  alt="Enlarged"
                  className="post-gallery-modal-image"
                />

                <button
                  className="post-gallery-nav-button post-gallery-right"
                  onClick={() =>
                    setPhotoIndex((photoIndex + 1) % post.images.length)
                  }
                >
                  ▶
                </button>

                {/* <div className="post-gallery-index">{photoIndex + 1} / {post.images.length}</div> */}

                <div className="post-gallery-dots">
                  {post.images.map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${i === photoIndex ? "active" : ""}`}
                      onClick={() => setPhotoIndex(i)}
                    ></span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="tag-box">
            {tag.map((tag, index) => (
              <div className="post-tags" key={index}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <hr className="post-line" />
        <div className="post-footer">
          {renderVoteButtons()}
          <button className="comment-button">
            <img
              src={commentSvg}
              className="post-action"
              alt="Comment"
            />{" "}
            Comment
          </button>
          <button className="share-button">
            <img
              src={share}
              className="post-action"
              alt="Share"
            />{" "}
            Share
          </button>
        </div>
        <hr className="post-line" />
        <div className="create-comment">
          <div className="create-comment-header">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <img
                src={user.avatar}
                className="comment-avatar"
                alt="Avatar"
                style={{ width: "40px" }}
              />
            </div>
            <Editor
              apiKey={textEditorAPI}
              onInit={(_, editor) => (editorRef.current = editor)}
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
            <button className="submit-comment" onClick={handleAddComment}>
              Post
            </button>
          </div>
        </div>
        <div className="comment-section-detail" style={{ padding: "10px" }}>
          {renderComments()}
        </div>
      </div>
    </section>
  );}
}

export default Detail;
