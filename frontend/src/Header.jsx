import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authentication/AuthProvider";

function Header({token, isAuth}) {
    const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const linkRefs = useRef([])

    const navigate = useNavigate();

    useEffect(() => {
        linkRefs.current.forEach((link, index) => {
            if (link) {
                if (hoveredIndex === index) {
                    link.style.textDecorationColor = 'white';
                    link.style.textUnderlineOffset = '20px';
                    link.style.textDecorationThickness = '2px';
                } else {
                    link.style.textDecorationColor = 'transparent';
                    link.style.textUnderlineOffset = '0px';
                    link.style.textDecorationThickness = '0';
                }
            }
        });
    }, [hoveredIndex]);

    const navbar = [{ sect: "About", link: "/" }, { sect: "Forum", link: "/forum?page=1&limit=10" }, { sect: "Live Code", link: "/" }];

    const [dropdown, setDropdown] = useState(false)

    const toggleDropdown = ()=>{
        setDropdown(!dropdown);
    }

    const logout = async () => {
        try {
            const refreshToken = token.refreshToken;
            await axios.delete('http://localhost:3000/api/v1/auth/logout', {data: {refreshToken: refreshToken}}) //axios.delete is treated different
            setIsLoggedIn(false)
            localStorage.removeItem('token')
        } catch (error) {
            console.error('logout failed', error)
        }
    }

    return (
        <div className="header">
            <div style={{display:'flex', flexDirection: 'row'}}>
                <img src="/src/assets/logo.svg" alt="" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                <div className="navbar">
                    {navbar.map((obj, index) => (
                        <div ref={el => linkRefs.current[index] = el}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => navigate(obj.link)}>
                            {obj.sect}
                        </div>
                    ))}
                </div>
            </div>
            <div className='login' style={{position:'relative', display: isAuth? 'none': 'block'}}>
                {
                    !isLoggedIn ? (<div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <div className="login-button" onClick={() => { navigate('/auth/login') }}>Login</div>
                        <div className="signup-button" onClick={() => { navigate('/auth/signup') }}>Join us</div>
                    </div>) : (
                        <div style={{ position: 'absolute', top: '-25px', right: '20px' }}>
                            <div className='logged-in' onClick={toggleDropdown}>
                                <div className="avatar"><img src={user.avatar} alt="" /></div>
                                <div className='username'>{user.fullName}</div>
                            </div>
                            <div className="action" style={{ height: dropdown ? '100px' : '0' }}>
                                <div className="container">
                                    <div className="to-profile" onClick={() => { navigate(`/profile/${user._id}`) }}>Profile</div>
                                    <div className="logout" onClick={logout}>Logout</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Header;