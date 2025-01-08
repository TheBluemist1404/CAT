import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import React, { useState } from 'react';


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
    
    const [view, setView] = useState("posts");
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState("");
    const [showInput1, setShowInput1] = useState(false);
    const [showInput2, setShowInput2] = useState(false);
    const handleAddSchool = () => {
    if (newSchool.trim() !== "") {
      setSchools([...schools, newSchool]);
      setNewSchool(""); 
      setShowInput(false);
    }
    };
    
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
                    </div>
                    <div className='box' style={{top:'43%'}}>
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
                        <button type='button' className='p' onClick={() =>setView("posts")}>post</button>
                        <button type='button' className='i' onClick={() =>setView("images")}>Image</button>
                        <button type='button' className='v' onClick={() =>setView("videos")}>video</button>
                    </div>
                    {view ==="posts"&&(
                    <div className='main'>
                        <div className='bio'>
                            <h1>Bio</h1>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={(toggleInput1) } style={{ cursor: "pointer" }}>
                                <img src="/src/assets/school.svg" alt="" width={50} height={50}/>
                            </div>
                            {schools.length > 0 && (
                            <div style={{ marginLeft: "10px" }}>
                            {schools[schools.length - 1]} {/* Hiển thị trường học cuối cùng */}
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
                            placeholder="Nhập tên trường học"
                            />
                            <button onClick={handleAddSchool} >+</button>
                            </div>
                            )}
                        </div>
                        <div className='about' >
                            <div style={{display: "flex", alignItems: "center", marginBottom: "10px", }}>
                            <h1 style={{ margin: "0 20px 0 0" }}>About</h1>
                            
                            <div onClick={(toggleInput2) } style={{ cursor: "pointer" }}>
                                <img src="/src/assets/school.svg" alt="" width={30} height={30}/>
                            </div>
                            </div>
                            {showInput2 && (
                            <textarea
                            className='input'
                            style={{ margin: "0", padding: "5px" }}
                            value={text} 
                            onChange={handleChange} 
                            placeholder="Nhập nội dung ở đây..."
                            rows="10"
                            cols="50"
                            />)}
                            
                            <div style={{ width: "100%", maxWidth: "300px", wordWrap: "break-word", overflowWrap: "break-word", marginTop: "5px" }} >
                            {text || "Chưa có nội dung"}
                            </div>
                        </div>
                        <div className='im'>
                            <h1>Image</h1>
                        </div>
                        <div className='Post'>
                            <h1>Posts</h1>
                        </div>
                    </div>)}
                    
                    
                </div>
                <Routes>
                    <Route path='post' element={<></>} />
                    <Route path='media' element={<></>} />
                    <Route path='saved' element={<></>} />
                    <Route path='/image' element={<Image/>}/>
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
