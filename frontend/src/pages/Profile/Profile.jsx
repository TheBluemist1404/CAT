import './profile.scss'
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';

import "./profile.scss"
import Header from "../../Header";


const Profile = ()=> {
    const navigate = useNavigate();
    const {isLoggedIn, setIsLoggedIn, user, setUser} = useContext(AuthContext);

    useEffect(() => { 
        if (!isLoggedIn) { 
            navigate('/auth/login', { replace: true }); 
        } 
    }, [navigate, isLoggedIn])
    
    return(
        <div className="profile">
            <div className='header'>
                <Header/>
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
        </div>
    );
};

export default Profile;