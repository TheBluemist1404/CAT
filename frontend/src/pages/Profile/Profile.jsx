import "./profile.scss";
import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import Header from "../../Header";
import axios from "axios";

import ProfileAvatar from "./ProfileAvatar";
import ProfileTab from "./ProfileTab";
import ProfileMain from "./ProfileMain";
import ProfileMedia from "./ProfileMedia";
import ProfileSavedPost from "./ProfileSavedPost";

const Profile = ({ offset = 0, limit = 999, token }) => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, fetch } = useContext(AuthContext);

  const [view, setView] = useState("posts");

  const { id } = useParams();
  const [isPrivate, setIsPrivate] = useState(false);

  const [profileData, setProfileData] = useState({});

  

  useEffect(() => {
    if (!id) return;

    async function getData() {
        const data = await fetch(token,
            axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/profile/detail/${id}`, {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            })
          );
          
        setProfileData(data)
    }

    getData();
  }, [id]);

//   useEffect(() => {
//     console.log("Profile data:", profileData);
//   }, [profileData]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, isLoggedIn]);

  //fetch post
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!profileData?._id) return;

    async function fetchPosts() {
        const data = await fetch(token, axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/forum`, {
            params: { offset, limit },
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }))
          const filteredPosts =
          data[0]?.posts.filter(
            (post) => post.userCreated._id === profileData._id
          ) || [];

        setPosts(filteredPosts);
    }

    fetchPosts();
  }, [profileData, offset, limit, token]);

  return (
    <div className="profile" style={{ position: "relative" }}>
      <Header token={token} isAuth={false} />

      <div style={{ zIndex: 1, position: "relative" }}>
        <ProfileAvatar
          user={user}
          profileData={profileData}
          id={id}
          token={token}
        />
        <ProfileTab
          view={view}
          setView={setView}
          user={user}
          profileData={profileData}
          id={id}
          token={token}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
        />

        {view === "posts" && (
          <ProfileMain
            user={user}
            profileData={profileData}
            token={token}
            id={id}
            posts={posts}
            isPrivate={isPrivate}
            setView={setView}
          />
        )}
        {view === "Media" && (
          <ProfileMedia
            user={user}
            profileData={profileData}
            token={token}
            id={id}
            posts={posts}
            isPrivate={isPrivate}
          />
        )}
        {view === "Saved" && (
          <ProfileSavedPost user={user} profileData={profileData} id={id} />
        )}
      </div>
    </div>
  );
};

export default Profile;
