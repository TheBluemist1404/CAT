import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import Header from "../../Header";
import axios from 'axios';

import ProfileAvatar from './ProfileAvatar';
import ProfileTab from './ProfileTab';
import ProfileMain from './ProfileMain';
import ProfileSavedPost from './ProfileSavedPost';

const Profile = ({ token }) => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);

    const [view, setView] = useState("posts");

    
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
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
    }, []);
    useEffect(() => {
        console.log("Profile data:", profileData);
      }, [profileData]); 
    

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])

    return (
        <div className="profile" style={{ position: 'relative' }}>
            <div style={{ zIndex: 2, position: 'relative' }}><Header token={token} isAuth={false} /></div>

            <div style={{ zIndex: 1, position: 'relative' }}>
                <ProfileAvatar user={user} profileData={profileData} id={id}  />
                <ProfileTab view={view} setView={setView}/>
                
                {view === "posts" && <ProfileMain user={user} profileData={profileData} token={token} id={id} />}
                {view === "Saved" && <ProfileSavedPost user={user} profileData={profileData} id={id} />}

            </div>
        </div>
    );
};

export default Profile;
