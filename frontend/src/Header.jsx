import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authentication/AuthProvider";

function Header({token, isAuth}) {
    const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [avatar, setAvatar] = useState()
    const [username, setUsername] = useState("...")
    useEffect(()=>{
        if (user) {
            setAvatar(user?.avatar)
            if (user.fullName) {
                if (user.fullName.length <15) {
                    setUsername(user.fullName)
                } else {
                    setUsername(user.fullName.substr(0, 10))
                }
            }
        }
    },[user])
    
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

    const navbar = [{ sect: "About", link: "/" }, { sect: "Forum", link: "/forum?page=1&limit=10" }, { sect: "Live Code", link: "/live-code" }];

    const [dropdown, setDropdown] = useState(false)

    const toggleDropdown = ()=>{
        setDropdown(!dropdown);
    }

    const logout = async () => {
        try {
            await axios.delete('http://localhost:3000/api/v1/auth/logout', {data: {refreshToken: token.refreshToken}}) //axios.delete is treated different
            setIsLoggedIn(false)
            localStorage.removeItem('token')
        } catch (error) {
            console.error('logout failed', error)
        }
    }

    return (
        <div className="header">
            <img src="/src/assets/logo.svg" alt="" onClick={() => navigate('/')} style={{ cursor: 'pointer', width: "60px", height: "60px", marginLeft: "30px", transform: "translateY(5px)" }} />
            <div className="navbar">
                {navbar.map((obj, index) => (
                    <div key={index} ref={el => linkRefs.current[index] = el}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => navigate(obj.link)}>
                        {obj.sect}
                     </div>
                ))}
            </div>
            <div className='login' style={{position:'relative', opacity: isAuth? 0: 1, minWidth: '180px'}}>
                {
                    !isLoggedIn ? (<div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <div className="login-button" onClick={() => { navigate('/auth/login') }}>Login</div>
                        <div className="signup-button" onClick={() => { navigate('/auth/signup') }}>Join us</div>
                    </div>) : (
                        <div style={{ position: 'absolute', top: '-20px', right: '-10px' }}>
                            <div className='logged-in' onClick={toggleDropdown}>
                                <div className="avatar"><img src={avatar} alt="" /></div>
                                <div className='username'>{username}</div>
                            </div>
                            <div className="action" style={{ height: dropdown ? '100px' : '0' }}>
                                <div className="container">
                                    <div className="to-profile" onClick={() => { navigate(`/profile/${user._id}`) }}>Profile</div>
                                    <div className="logout" onClick={logout} style={{color: "var(--highlight-red)"}}>Logout</div>
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