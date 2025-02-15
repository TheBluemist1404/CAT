import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';

function Post({ post, token, update }) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext)

  const defaultAvatar = "https://res.cloudinary.com/cat-project/image/upload/v1735743336/coder-sign-icon-programmer-symbol-vector-2879989_ecvn23.webp";

  return (
    <div className="post" onClick={()=>{navigate(`/profile/${post._id}`)}} style={{cursor:'pointer'}}>
      <div className="post-header">
        <img src={post.avatar ? post.avatar : defaultAvatar} alt="User Avatar" className="user-avatar" />
        <div className="user-name">{post.fullName}</div>
      </div>
      <div className="post-body">
        <h1 className="post-title">{post.title}</h1>
      </div>
      <hr className="post-line" />
      <div className="post-footer">
        <button className="share-button">
        </button>
      </div>
      <hr className="post-line" />
    </div>
  )
}

export default Post
