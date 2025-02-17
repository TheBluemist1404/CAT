import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import Header from "../../Header";

import ProfileAvatar from './ProfileAvatar';
import ProfileTab from './ProfileTab';
import ProfileMain from './ProfileMain';
import ProfileSavedPost from './ProfileSavedPost';

const Profile = ({ token }) => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);

    const [view, setView] = useState("posts");

    console.log(user.post);
    const { id } = useParams();

    useEffect(() => {
        function fetchProfile() {
            if (id) {
                fetch(`http://localhost:3000/api/v1/profile/detail/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        setProfileData(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error fetching profile:', error);
                        setLoading(false);
                    });
            }
        }

        fetchProfile()
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])

    return (
        <div className="profile" style={{ position: 'relative' }}>
            <div style={{ zIndex: 2, position: 'relative' }}><Header token={token} isAuth={false} /></div>

            <div style={{ zIndex: 1, position: 'relative' }}>
                <ProfileAvatar user={user}  />
                <ProfileTab view={view} setView={setView}/>
                
                {view === "posts" && <ProfileMain user={user} token={token} />}
                {view === "Saved" && <ProfileSavedPost user={user}  />}

            </div>
        </div>
    );
};

export default Profile;
