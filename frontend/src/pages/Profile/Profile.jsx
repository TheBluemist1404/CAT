import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import axios from "axios";


import "./profile.scss"
import Header from "../../Header";


const Profile = ({token, post}) => {
    
    const navigate = useNavigate();
    const { isLoggedIn, user } = useContext(AuthContext);
    
    console.log(user.post);
    

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login', { replace: true });
        }
    }, [navigate, isLoggedIn])
    
    const [view, setView] = useState("posts");
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState("");
    const [showInput1, setShowInput1] = useState(false);
    const [showInput2, setShowInput2] = useState(false);

    
    
    const handleAddSchool = async () => {
        if (newSchool.trim() !== "") {
            const updatedSchools = [...schools, newSchool];
            setSchools(updatedSchools); 
            setNewSchool(""); 
            setShowInput1(false);
            setShowInput2(false);
    
            try {
                
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        content: updatedSchools,
                        user: { id: user._id },
                        fullName: user.fullName,
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token.accessToken}`,
                        },
                    }
                );
    
                if (response.status === 200) {
                    
                    if (Array.isArray(response.data.schools)) {
                        setSchools(response.data.schools);
                    }
                }
            } catch (err) {
                console.error("Error:", err.response?.data?.message || err.message);
            }
        }
    };
    
    
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/profile/detail/${user._id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token.accessToken}`, 
                        },
                    }
                );
                console.log(response.data);
                if (response.status === 200 && Array.isArray(response.data.schools)) {
                    setSchools(response.data.schools); 
                }
            } catch (err) {
                console.error("Error fetching schools:", err.response?.data?.message || err.message);
            }
        };
    
        fetchSchools();
    }, [user, token]); 
    
    
    const toggleInput1 = () => {
        setShowInput1(prevState => !prevState); 
      };
      const toggleInput2 = () => {
        setShowInput2(prevState => !prevState); 
      };
      const [text, setText] = useState(''); 

      const handleChange = (event) => {
        setText(event.target.value); 
      };
     
      
      const [dropdown, setDropdown] = useState(false)

      const toggleDropdown = () => {
        setDropdown((prevState) => !prevState); 
    };
     
    
    
    const id = useParams(); 
    console.log(id.id, user._id)
    
    if (id.id === user._id) { 
        return (
            <div className="profile" style={{position: 'relative'}}>
                <div style={{zIndex: 2, position: 'relative'}}><Header token={token} isAuth={false}/></div>

                <div style={{zIndex: 1, position: 'relative'}}>
                    <div className='image' >
                        <div className="profile-avatar"><img src={user.avatar} alt="" /></div>
                        <h1 className='profile-username'>{user.fullName}</h1>
                        <div className='social'>
                        <img src="/src/assets/facebook.svg" alt="" width={30} height={30}/>
                        <img src="/src/assets/github.svg" alt="" width={30} height={30}/>
                        <img src="/src/assets/twitter.svg" alt="" width={30} height={30}/>
                        </div>
                        <div className="box" style={{top: '85%'}}>
                            <div className="box-item">
                                <span className="number">150</span>
                                <span className="label">Posts</span>
                            </div>
                            <div className="divider"></div>
                            <div className="box-item">
                                <span className="number">15h</span>
                                <span className="label">Coding</span>
                            </div>
                            <div className="divider"></div>
                            <div className="box-item">
                                <span className="number">150</span>
                                <span className="label">Followers</span>
                            </div>
                        </div>

                    </div>
                    
                    <div className='tabs'>
                        <div>
                        <button type='button' className='p' onClick={() =>setView("posts")}>Posts</button>
                        <button type='button' className='i' onClick={() =>setView("images")}>Images</button>
                        <button type='button' className='v' onClick={() =>setView("videos")}>Videos</button>
                        </div>
                        <div>
                        <div className="settings" onClick={toggleDropdown} style={{ marginRight: "20px" }}>
                            <img src="/src/assets/setting.svg" alt="" width={30} height={30} />
                        </div>

                        {dropdown && (
                            <div className="option">
                                <div className="set">Settings</div>
                                <div className="adjusts">Adjust</div>
                                <div className="close" onClick={toggleDropdown}>Close</div>
                            </div>
                        )}

                        </div>
                    </div>
                    {view ==="posts"&&(
                    <div className='main'>
                        <div className='bio'>
                            <h1>Bio</h1>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={(toggleInput1) } style={{ cursor: "pointer" }}>
                                <img src="/src/assets/school.svg" alt="" width={30} height={30}/>
                            </div>
                            {schools.length > 0 && (
                            <div style={{ marginLeft: "10px" }}>
                            {schools[schools.length - 1]} 
                            </div>
                            )}
                            </div >
                            {showInput1 && (
                             <div style={{ marginLeft: "10px" }}>
                            <input
                            type="text"
                            className='input'
                            value={newSchool}
                            onChange={(e) => setNewSchool(e.target.value)}
                            placeholder="type..."
                            />
                            <button onClick={handleAddSchool} >+</button>

                            
                            </div>
                            )}
                        </div>
                        <div className='about' >
                            <div style={{display: "flex", alignItems: "center", marginBottom: "10px", }}>
                            <h1 style={{ margin: "0 20px 0 0" }}>About</h1>
                            
                            <div onClick={(toggleInput2) } style={{ cursor: "pointer" }}>
                                <img src="/src/assets/pen.svg" alt="" width={15} height={15}/>
                            </div>
                            </div>
                            {showInput2 && (
                            <textarea
                            className='input'
                            style={{ margin: "0", padding: "5px" }}
                            value={text} 
                            onChange={handleChange} 
                            placeholder="type here ..."
                            rows="10"
                            cols="50"
                            />)}
                            
                            <div style={{ width: "100%", maxWidth: "900px", wordWrap: "break-word", overflowWrap: "break-word", marginTop: "5px" }} >
                            {text }
                            </div>
                        </div>
                        <div className='im'>
                            <h1>Image</h1>
                            <div className="flex-container">
                            {Array.from({ length: 9 }).map((_, index) => (
                            <div className="flex-item" key={index}>
                            {index + 1}
                            </div>
                            ))}
                            </div>
                        </div>
                        <div className='Post'>
                            <h1>Posts</h1>
                            
                            <div>
                            
                            <div className="posts-container">
                            {user.posts.slice().reverse().map((post, index) => {
    
                                const date = new Date(post.createdAt);
                                const formattedDate = `${date.getDate()} ${date.toLocaleString('en', { month: 'long' })}, ${date.getFullYear()}`;

                                return (
                                <div className='post-card' key={index}>
                                    <div className='post-icon-title'>
                                        <img src="/src/assets/qa.svg" alt="" width={30} height={30} />
                                        <div className='post-title'>{post.title}</div>
                                    </div>
                                
                                <div className='post-date'>{formattedDate}</div> {/* Hiển thị ngày đã chuyển đổi */}
                                </div>
                                );
                                })}
                            </div>
                            </div>
                        </div>
                    </div>)}
                    
                    
                </div>
                <Routes>
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
