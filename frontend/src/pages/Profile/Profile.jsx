import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';

import "./profile.scss"
import Header from "../../Header";


const Profile = ({token}) => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])

    const id = useParams(); //we actually access profile through params
    console.log(id.id, user._id)
    if (id.id === user._id) { //This will return a profile page that can be edited by user (profile owner)
        return (
            <div className="profile" style={{position: 'relative'}}>
                <div style={{zIndex: 2, position: 'relative'}}><Header token={token} isAuth={false}/></div>

                <div style={{zIndex: 1, position: 'relative'}}>
                    <div className='image' >
                        <div className="profile-avatar"><img src={user.avatar} alt="" /></div>
                        <h1 className='profile-username'>{user.fullName}</h1>
                    </div>
                    <div className='box'>
                        <div className='text'>
                            <span>150</span>
                            <span>posts</span>
                        </div>
                        <div className='text'>
                            <span>15h</span>
                            <span>coding</span>
                        </div>
                        <div className='text'>
                            <span>150</span>
                            <span>Followers</span>
                        </div>
                    </div>
                    <div className='tabs'>
                        <button type='submit' className='p'>post</button>
                        <button type='submit' className='i'>image</button>
                        <button type='submit' className='v'>video</button>
                    </div>
                    <div className='main'>
                        <div className='bio'>
                            <h1>Bio</h1>
                        </div>
                        <div className='about'>
                            <h1>About</h1>
                        </div>
                    </div>
                    <div className='main2'>
                        <div className='post'>
                            <h1>Posts</h1>
                        </div>
                    </div>
                </div>
                <Routes>
                    <Route path='post' element={<></>} />
                    <Route path='media' element={<></>} />
                    <Route path='saved' element={<></>} />
                </Routes>
            </div>
        );
    } else {
        //Profile view by other user
        return (
            <div>Hmm, lets wait until Tuong build this page for you to view</div>
        )
    }
};

export default Profile;