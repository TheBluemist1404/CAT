import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import Header from "../../Header";
import axios from 'axios';

import ProfileAvatar from './ProfileAvatar';
import ProfileTab from './ProfileTab';
import ProfileMain from './ProfileMain';
import ProfileMedia from './ProfileMedia';
import ProfileSavedPost from './ProfileSavedPost';

const Profile = ({offset = 0, limit = 999, token }) => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);

    const [view, setView] = useState("posts");

    
    const { id } = useParams();
    console.log(id);
    const [profileData, setProfileData] = useState(null);
    useEffect(() => {
        async function fetchProfile() {
            if (!id) return;
            console.log("Fetching profile for ID:", id);
    
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/profile/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
    
                console.log("Fetched profile data:", response.data); // ✅ Kiểm tra dữ liệu trả về
                setProfileData(response.data);
    
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data?.message || error.message);
            }
        }
    
        fetchProfile();
    }, [id]);
    useEffect(() => {
        console.log("Profile data:", profileData);
      }, [profileData]); 
    

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])
    
    //fetch post
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!profileData?._id) return;
    
        async function fetchPosts() {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/forum`, {
                    params: { offset, limit },
                    headers: {
                        Authorization: `Bearer ${token?.accessToken}`
                    }
                });
    
                console.log("Fetched posts:", response.data);
    
                
                const filteredPosts = response.data[0]?.posts.filter(post => post.userCreated._id === profileData._id) || [];
    
                setPosts(filteredPosts); 
            } catch (err) {
                console.error("Error fetching posts:", err.response?.data?.message || err.message);
            }
        }
    
        fetchPosts();
    }, [profileData, offset, limit, token]);

    return (
        <div className="profile" style={{ position: 'relative' }}>
            <div style={{ zIndex: 2, position: 'relative' }}><Header token={token} isAuth={false} /></div>

            <div style={{ zIndex: 1, position: 'relative' }}>
                <ProfileAvatar user={user} profileData={profileData} id={id} token={token}  />
                <ProfileTab view={view} setView={setView} user={user} profileData={profileData} id={id}/>
                
                {view === "posts" && <ProfileMain user={user} profileData={profileData} token={token} id={id} posts={posts}  />}
                {view === "Media" && <ProfileMedia user={user} profileData={profileData} token={token} id={id} posts={posts} />}
                {view === "Saved" && <ProfileSavedPost user={user} profileData={profileData} id={id} />}

            </div>
        </div>
    );
};

export default Profile;
