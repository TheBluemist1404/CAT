import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';

import "./profile.scss"
import Header from "../../Header";


const Profile = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])

    const id = useParams(); //we actually access profile through params
    if (id.id === user._id) { //This will return a profile page that can be edited by user (profile owner)
        return (
            <div className="profile">
                <div className='header'>
                    <Header />
                </div>
                <form action="action_page.php" method="post">
                    <div className='image' >
                        <div className="avatar"><img src={user.avatar} alt="" /></div>
                        <h1 className='username'>{user.fullName}</h1>
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
                </form>
                <Routes>
                    <Route path='post' element={<></>}/>
                    <Route path='media' element={<></>}/>
                    <Route path='saved' element={<></>}/>
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