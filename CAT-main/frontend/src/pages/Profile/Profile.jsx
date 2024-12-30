import './profile.scss'
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';

const Profile = ()=> {
    const navigate = useNavigate();
    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => { 
        if (!isLoggedIn) { 
            navigate('/auth/login', { replace: true }); 
        } 
    }, [navigate, isLoggedIn])
    
    return(
        <div className="profile">
            Hello
        </div>
    );
};

export default Profile;