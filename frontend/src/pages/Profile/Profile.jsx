import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import axios from "axios";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import style của Quill
import { Editor } from "@tinymce/tinymce-react";
import "./profile.scss"
import Header from "../../Header";
import DOMPurify from "dompurify";

const Profile = ({token,post}) => {
    
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
    const [showSchoolInput, setShowSchoolInput] = useState(false); 
    const [showCompanyInput, setShowCompanyInput] = useState(false);
    
    
    const handleAddSchool = async () => {
        if (newSchool.trim() !== "") {
            const updatedSchools = [...schools, newSchool];
            setSchools(updatedSchools); 
            setNewSchool(""); 
            setShowSchoolInput(false);
            
    
            try {
                
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        schools: updatedSchools,
                        user: { id: user._id },
                        fullName: user.fullName,
                        companies,
                        description,
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

    const [companies, setCompanies] = useState([]);
const [newCompany, setNewCompany] = useState("");


const handleAddCompany = async () => {
    if (newCompany.trim() !== "") {
        const updatedCompanies = [...companies, newCompany];
        setCompanies(updatedCompanies); 
        setNewCompany(""); 
        setShowCompanyInput(false);

        try {
            const response = await axios.patch(
                `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                {
                    companies: updatedCompanies,
                    user: { id: user._id },
                    fullName: user.fullName,
                    schools,
                    description,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                if (Array.isArray(response.data.companies)) {
                    setCompanies(response.data.companies);
                }
            }
        } catch (err) {
            console.error("Error:", err.response?.data?.message || err.message);
        }
    }
};

useEffect(() => {
    const fetchCompanies = async () => {
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
            if (response.status === 200 && Array.isArray(response.data.companies)) {
                setCompanies(response.data.companies); 
            }
        } catch (err) {
            console.error("Error fetching companies:", err.response?.data?.message || err.message);
        }
    };

    fetchCompanies();
}, [user, token]); 
    
    
    const toggleInput1 = () => {
        setShowInput1(prevState => !prevState); 
      };
      const toggleInput2 = () => {
        setShowInput2(prevState => !prevState); 
      };
      const [text, setText] = useState(''); 

      
     
      
      const [dropdown, setDropdown] = useState(false)

      const toggleDropdown = () => {
        setDropdown((prevState) => !prevState); 
    };
     
    const [description, setDescription] = useState(""); 
    const [newDescription, setNewDescription] = useState(""); 
    const [editMode, setEditMode] = useState(false); 

    
    const handleUpdateDescription = async () => {
        if (newDescription.trim() !== "") {
            try {
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        description: newDescription,
                        user: { id: user._id },
                    fullName: user.fullName,
                    schools,
                    companies
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setDescription(response.data.description || newDescription); 
                    setEditMode(false); 
                    setNewDescription(""); 
                }
            } catch (err) {
                console.error("Error updating description:", err.response?.data?.message || err.message);
            }
        }
    };

    
    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/profile/detail/${user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (response.status === 200 && response.data.description) {
                    setDescription(response.data.description); 
                }
            } catch (err) {
                console.error("Error fetching description:", err.response?.data?.message || err.message);
            }
        };

        fetchDescription();
    }, [user, token]);
    
    const modules = {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'align': [] }],
          ['link'],
          [{ 'color': [] }, { 'background': [] }],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
      };
      const handlePostClick = (postId) => {
        navigate(`/forum/${postId}`);
      };
      const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
      const handleEditorChange = (content) => {
        const sanitizedContent = DOMPurify.sanitize(content); // Làm sạch nội dung
        setNewDescription(sanitizedContent); // Lưu vào state
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
                            {/* school */}
                            <div style={{marginLeft:'10px',marginTop:'10px'}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={() =>setShowSchoolInput(!showSchoolInput) } style={{ cursor: "pointer" }}>
                                <img src="/src/assets/school.svg" alt="" width={30} height={30}/>
                            </div>
                            {schools.length > 0 && (
                            <div style={{ marginLeft: "10px" }}>
                            {schools[schools.length - 1]} 
                            </div>
                            )}
                            </div >
                            {showSchoolInput && (
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
                            {/* companies */}
                            <div style={{marginLeft:'10px',marginTop:'10px'}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div onClick={()=>setShowCompanyInput(!showCompanyInput)} style={{ cursor: "pointer" }}>
                                        <img src="/src/assets/company.svg" alt="" width={30} height={30} />
                                    </div>
                                    {companies.length > 0 && (
                                        <div style={{ marginLeft: "10px" }}>
                                            {companies[companies.length - 1]}
                                        </div>
                                    )}
                                </div>
                                {showCompanyInput  && (
                                    <div style={{ marginLeft: "10px" }}>
                                        <input
                                            type="text"
                                            className='input'
                                            value={newCompany}
                                            onChange={(e) => setNewCompany(e.target.value)}
                                            placeholder="type..."
                                        />
                                        <button onClick={handleAddCompany}>+</button>
                                    </div>
                                )}
                            </div>


                        </div>
                        <div className='about' >
                        <div style={{ margin: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <h1 style={{ margin: "0 20px 0 0" }}>About</h1>
                            <div
                                onClick={() => setEditMode(true)} 
                                style={{ cursor: "pointer" }}
                            >
                                <img src="/src/assets/pen.svg" alt="Edit" width={15} height={15} />
                            </div>
                        </div>

                            {editMode ? (
                                <div>
                                    <Editor
                apiKey = {textEditorAPI} // Thay bằng API Key của bạn nếu cần
                value={newDescription}
                onEditorChange={handleEditorChange}
                
                init={{
                    height: 300,
                    menubar: true,
                      plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic underline forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
            />
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "5px",
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
                                    <div style={{ marginTop: "10px" }}>
                                        <button onClick={handleUpdateDescription}>Save</button>
                                        <button
                                            onClick={() =>{ setEditMode(false);setNewDescription("");}}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        maxWidth: "900px",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        marginTop: "5px",
                                    }}
                                >
                                    {description || "No description available. Click the edit button to add one!"}
                                </div>
                            )}
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
                                        <div className='post-title' key={post._id} onClick={() => handlePostClick(post._id)}>{post.title}</div>
                                    </div>
                                
                                <div className='post-date'>{formattedDate}</div> 
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
