import './profile.scss'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import axios from "axios";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
import "./profile.scss"
import Header from "../../Header";
import DOMPurify from "dompurify";

const Profile = ({ token, post}) => {

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
    const [avatar, setAvatar] = useState(user?.avatar || '');

    const handleAddSchool = async () => {
        if (newSchool.trim() !== "") {
            const updatedSchools = [...schools, newSchool];
            setSchools(updatedSchools); 
            setNewSchool(""); 
            
            
    
            try {

                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        schools: updatedSchools,
                        user: { id: user._id },
                        fullName: user.fullName,
                        companies,
                        description,
                        avatar: user.avatar,
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
        

            try {
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        companies: updatedCompanies,
                        user: { id: user._id },
                        fullName: user.fullName,
                        schools,
                        description,
                        avatar: user.avatar,
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


    // const toggleInput1 = () => {
    //     setShowInput1(prevState => !prevState);
    // };
    // const toggleInput2 = () => {
    //     setShowInput2(prevState => !prevState);
    // };
    // const [text, setText] = useState('');




    // const [dropdown, setDropdown] = useState(false)

    // const toggleDropdown = () => {
    //     setDropdown((prevState) => !prevState);
    // };

    const [description, setDescription] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editMode, setEditMode] = useState(false);


    const handleEditorChange = (content) => {
        const sanitizedContent = DOMPurify.sanitize(content);
        setNewDescription(sanitizedContent);
    };
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
                        companies,
                        avatar: user.avatar,
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


    const handlePostClick = (postId) => {
        navigate(`/forum/${postId}`);
    };
    const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const handleSvgClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        setPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
        setIsVisible(!isVisible);
    };

  const handleClose = () => {
    setIsVisible(false);
  };
  const handleRemoveSchool = async () => {
    if (schools.length >= 1) {
        
        const indexToRemove = schools.length - 1;


            const updatedSchools = schools.filter((_, index) => index !== indexToRemove);
            setSchools(updatedSchools);
            try {
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        schools: updatedSchools,
                        user: { id: user._id },
                        fullName: user.fullName,
                        companies,
                        description,
                        avatar: user.avatar,
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token.accessToken}`,
                        },
                    }
                );


                if (response.status === 200) {
                    console.log("School removed successfully");
                }
            } catch (err) {
                console.error("Error removing school:", err.response?.data?.message || err.message);
            }
        };
    };

  const handleRemoveCompany = async () => {
    if (companies.length >= 1) {
        
        const indexToRemove = companies.length - 1;


            const updatedCompany = companies.filter((_, index) => index !== indexToRemove);
            setCompanies(updatedCompany);
            try {
                const response = await axios.patch(
                    `http://localhost:3000/api/v1/profile/edit/${user._id}`,
                    {
                        companies: updatedCompany,
                        user: { id: user._id },
                        fullName: user.fullName,
                        schools,
                        description,
                        avatar: user.avatar,
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token.accessToken}`,
                        },
                    }
                );


                if (response.status === 200) {
                    console.log("Company removed successfully");
                }
            } catch (err) {
                console.error("Error removing company:", err.response?.data?.message || err.message);
            }
        };
    };
    const [showModal, setShowModal] = useState(false);
    const [showAvatarChange, setShowAvatarChange] = useState(false);
    const [showDeleteButtons, setShowDeleteButtons] = useState(false);
    const id = useParams();
    console.log(id.id, user._id)


    //update avatar
    
    const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Hiển thị preview ảnh
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh để tải lên!");
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", selectedFile); // Thêm file vào formData
    formData.append("fullName", user.fullName);
    formData.append("description", description);
    formData.append("schools", JSON.stringify(schools));
    formData.append("companies", JSON.stringify(companies));
  
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/profile/edit/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Cập nhật avatar thành công!");
      
        const updatedAvatar = response.data.avatar; // URL mới từ backend
        setUser((prevUser) => ({
          ...prevUser,
          avatar: updatedAvatar,
        }));
        setPreview(updatedAvatar); // Hiển thị preview mới
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error.response?.data?.message || error.message);
    }
  };
  
    //update avatar

    if (id.id === user._id) {
        return (
            <div className="profile" style={{ position: 'relative' }}>
                <div style={{ zIndex: 2, position: 'relative' }}><Header token={token} isAuth={false} /></div>

                <div style={{ zIndex: 1, position: 'relative' }}>
                    <div className='image' >
                
                        <div className="profile-avatar">
                            <img className='ava' src={user.avatar} alt="" />
                            <img className='cam' src="/src/assets/camera.svg" onClick={() => setShowAvatarChange(true)} alt="" width={30} height={30} style={{ position: "absolute", bottom: "5px", left: "90px", zIndex: 1000 }} />
                        </div>
                        {showAvatarChange && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: "50%",
              height: "80%",
              borderRadius: "16px",
              textAlign: "center",
              display: "block"
            }}
            className='detail'
          >
            <h1 style={{ color: "#FFFFFFA3",marginTop:"10px"}}>Editing Details</h1>
            <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cập Nhật Avatar</h2>

      {/* Button chọn ảnh */}
      <input
        type="file"
        accept="image/*"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* <label htmlFor="file-input">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Chọn Ảnh
        </button>
      </label> */}

      {/* Hiển thị preview ảnh */}
      {preview && (
        <div className="mt-4">
          <img src={preview} width={100} height={100}  alt="Avatar Preview" className="w-32 h-32 object-cover rounded-full" />
        </div>
      )}

      {/* Button tải lên */}
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
      >
        Tải lên Avatar
      </button>
    </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid gray",marginTop:"10px"}}>
            <div style={{ color: "#4b5563" }}>Update information</div>
            <button
              onClick={() => setShowAvatarChange(false)}
              style={{
                
                padding: "10px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Đóng
            </button>
            </div>
          </div>
        </div>
      )}


                        <h1 className='profile-username'>{user.fullName}</h1>
                        <div className='social'>
                            <img src="/src/assets/facebook.svg" alt="" width={30} height={30} />
                            <img src="/src/assets/github.svg" alt="" width={30} height={30} />
                            <img src="/src/assets/twitter.svg" alt="" width={30} height={30} />
                        </div>
                        <div className="box" style={{ top: '85%' }}>
                            <div className="box-item">
                                <span className="number">{user.posts.length}</span>
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
                            <button type='button' className={`p ${view === "posts" ? "active" : ""}`} onClick={() => setView("posts")}>Posts</button>
                            <button type='button' className={`i ${view === "Media" ? "active" : ""}`} onClick={() => setView("Media")}>Media</button>
                            <button type='button' className={`v ${view === 'Saved' ? 'active' : ''}`} onClick={() => setView("Saved")}>Saved</button>
                        </div>
                        <div>
                            <div className="settings" onClick={handleSvgClick} style={{ marginRight: "20px" }}>
                                <img src="/src/assets/setting.svg" alt="" width={30} height={30} />
                            </div>

                            {isVisible && (
                                <div className='bb'
                                    style={{
                                        position: "absolute",
                                        top: position.top - 150,
                                        left: position.left - 200,
                                        padding: "10px",
                                        zIndex: 1000,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <button onClick={() => alert("settings!")} className='b' >Settings</button>
                                    <button onClick={() => alert("adjusts!")} className='b'>Adjusts</button>
                                    <button onClick={handleClose} className='b'>Close</button>
                                </div>
                            )}

                        </div>
                    </div>
                    {view ==="posts"&&(
                    <div className='main'>
                        <div className='bio' >
                            <h1 style={{ margin: "20px" }}>Bio</h1>
                            <div style={{marginLeft:'30px'}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ cursor: "pointer" }}>
                                <img src="/src/assets/school.svg" alt="" width={30} height={30}/>
                            </div>
                            {schools.length > 0 && (
            <div style={{ marginLeft: "10px" }}>
                <div>{schools.length === 1 && schools[0]}</div>

                <div>{schools[schools.length-2]}</div>
                
            </div>
        )}
    </div>
    {schools.length > 1 && (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
                marginLeft: "40px"
            }}
        >
            {schools[schools.length-1]}
            
        </div>
    )}
                            {showSchoolInput && (
                             <div style={{display: 'flex', alignItems: 'center', marginLeft: "10px",marginTop:"15px" }}>
                            <input
                            type="text"
                            className='input'
                            value={newSchool}
                            onChange={(e) => setNewSchool(e.target.value)}
                            placeholder="type..."
                            />
                            <div tabindex="0" class="plusButton" onClick={handleAddSchool}>
                                        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <g mask="url(#mask0_21_345)">
                                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                            </g>
                                        </svg>
                            </div>
                            </div>
                            )}
                            {showDeleteButtons &&(
                <button onClick={() => handleRemoveSchool(schools[0])} style={{ 
                    marginLeft: '10px', 
                    backgroundColor: 'black', 
                    color: 'white', 
                    border: '1px solid white', 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}>Delete</button>)}
                            </div>
                            {/* companies */}
                            <div style={{marginLeft:'30px',marginTop:'10px',marginBottom:'20px'}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div  style={{ cursor: "pointer" }}>
                                        <img src="/src/assets/company.svg" alt="" width={30} height={30} />
                                    </div>
                                    {companies.length > 0 && (
                                        <div style={{ marginLeft: "10px" }}>
                                            <div>{companies.length === 1 && companies[0]}</div>
                                            <div>{companies[companies.length-2]}</div>
                                        </div>
                                    )}
                                </div>
                                {companies.length > 1 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            marginTop: "10px",
                                            marginLeft: "40px"
                                        }}
                                    >
                                        {companies[companies.length-1]}
                                        
                                    </div>
                                )}
                                {showCompanyInput  && (
                                    
                                    <div style={{ display: 'flex', alignItems: 'center',marginLeft: "10px",marginTop:"15px" }}>
                                        <input
                                            type="text"
                                            className='input'
                                            value={newCompany}
                                            onChange={(e) => setNewCompany(e.target.value)}
                                            placeholder="type..."
                                        />
                                        
                                        <div tabindex="0" class="plusButton" onClick={handleAddCompany}>
                                        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <g mask="url(#mask0_21_345)">
                                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                            </g>
                                        </svg>
                                        </div>
                                        
                                    </div>
                                )}
                                {showDeleteButtons &&(
                                            <button onClick={() => handleRemoveCompany(companies[0])} style={{ 
                                                marginLeft: '10px', 
                                                backgroundColor: 'black', 
                                                color: 'white', 
                                                border: '1px solid white', 
                                                padding: '8px 12px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer' 
                                              }}>Delete</button>)}
                            </div>

                                <button className='editbut' onClick={() => setShowModal(true)}>
                                    Edit personal details 
                                </button>
                                {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: "50%",
              height: "80%",
              borderRadius: "16px",
              textAlign: "center",
              display: "block"
            }}
            className='detail'
          >
            <h1 style={{ color: "#FFFFFFA3",marginTop:"10px"}}>Editing Details</h1>
            <h2 style={{ color: "#FFFFFFA3",marginLeft: "20px",textAlign: "left"  }}>Company</h2>
            <div style={{ display: 'flex', alignItems: 'center',marginLeft: "20px",marginTop:"15px" }}>
                                        <div tabindex="0" class="plusButton" onClick={handleAddCompany}>
                                        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <g mask="url(#mask0_21_345)">
                                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                            </g>
                                        </svg>
                                        </div>
                                        <input
                                            type="text"
                                            className='input'
                                            value={newCompany}
                                            onChange={(e) => setNewCompany(e.target.value)}
                                            placeholder="type..."
                                        />
                                        <button className='back' onClick={() => handleRemoveCompany(companies[0])}>
                                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" fill="white"></path></svg>
                                        
                                        </button>
                                        
                                        
                                    </div>
                                    <div style={{ color: "#4b5563",marginLeft: "20px",textAlign: "left"  }}>{`{${companies.join(', ')}}`}</div>


            <h2 style={{ color: "#FFFFFFA3",marginLeft: "20px",textAlign: "left",marginTop:"20px"  }}>School</h2>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: "20px",marginTop:"15px" }}>
            <div tabindex="0" class="plusButton" onClick={handleAddSchool}>
                                        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <g mask="url(#mask0_21_345)">
                                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                                            </g>
                                        </svg>
                            </div>
                            <input
                            type="text"
                            className='input'
                            value={newSchool}
                            onChange={(e) => setNewSchool(e.target.value)}
                            placeholder="type..."
                            />
                            <button className='back' onClick={() => handleRemoveSchool(schools[0])}>
                                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" fill="white"></path></svg>
                                        
                                        </button>
                            </div>
                            <div style={{ color: "#4b5563",marginLeft: "20px",textAlign: "left"  }}>{`{${schools.join(', ')}}`}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid gray",marginTop:"10px"}}>
            <div style={{ color: "#4b5563" }}>Update information</div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                
                padding: "10px 20px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Đóng
            </button>
            </div>
          </div>
        </div>
      )}


                            </div>
                            <div className='about' >
                                <div style={{ margin: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                        <h1 style={{ margin: "0 20px 0 0" }}>About</h1>
                                        <div
                                            onClick={() => { setEditMode(true); setNewDescription(description); }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img src="/src/assets/pen.svg" alt="Edit" width={15} height={15} />
                                        </div>
                                    </div>

                                    {editMode ? (
                                        <div >
                                            <div dangerouslySetInnerHTML={{ __html: newDescription }} />

                                            <Editor
                                                apiKey={textEditorAPI} // Thay bằng API Key của bạn nếu cần
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
                
                
            />
                                    <div style={{ marginTop: "10px" }}>
                                        <button onClick={handleUpdateDescription} style={{ 
                                                marginLeft: '10px', 
                                                backgroundColor: 'black', 
                                                color: 'white', 
                                                border: '1px solid white', 
                                                padding: '8px 12px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer' 
                                              }}>Save</button>
                                        <button
                                            onClick={() =>{ setEditMode(false);setNewDescription("");}}
                                            style={{ 
                                                marginLeft: '10px', 
                                                backgroundColor: 'black', 
                                                color: 'white', 
                                                border: '1px solid white', 
                                                padding: '8px 12px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer' 
                                              }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: description }}
                                    
                                >
                                    
                                </div>
                            )}
                        </div>
    
                        </div>
                        <div className='im'>
                            <h1 style={{ margin: "20px" }}>Image</h1>
                            <div className="flex-container">
                            {Array.from({ length: 9 }).map((_, index) => (
                            <div className="flex-item" key={index}>
                            {index + 1}
                            </div>
                            ))}
                            </div>
                            <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cập Nhật Avatar</h2>

      {/* Button chọn ảnh */}
      <input
        type="file"
        accept="image/*"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
      />
      <label htmlFor="file-input">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Chọn Ảnh
        </button>
      </label>

      {/* Hiển thị preview ảnh */}
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Avatar Preview" className="w-32 h-32 object-cover rounded-full" />
        </div>
      )}

      {/* Button tải lên */}
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
      >
        Tải lên Avatar
      </button>
    </div>

                        </div>
                        <div className='Post'>
                            <h1 style={{ margin: "20px" }}>Posts</h1>
                            
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
                            {/* <div className='badge'>
                                hello
                        </div> */}
                        </div>)}
                    {view === "Saved" && (
                        <div className='mainS'>
                            <div className="posts-container" style={{ backgroundColor: "#333333" }}>
                                {user.savedPosts.slice().reverse().map((post, index) => {
                                    const date = new Date(post.createdAt);
                                    const formattedDate = `${date.getDate()} ${date.toLocaleString('en', { month: 'long' })}, ${date.getFullYear()}`;
                                    return (
                                        <div className='spost'>
                                            <div className='post-card' key={index} style={{ backgroundColor: "#000000" }}>
                                                <div className='post-icon-title'>
                                                    <img src="/src/assets/save.svg" alt="" width={30} height={30} />
                                                    <div className='post-title' key={post._id} onClick={() => handlePostClick(post._id)}>{post.title}</div>
                                                </div>

                                                <div className='post-date'>{formattedDate}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
