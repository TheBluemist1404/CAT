import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";


function ProfileMain({ user, token, profileData, id ,posts,isPrivate,setView}) {
  // edit school and company modal
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  

  const handleCancelClick = () => {
    setShowConfirm(false);
    setShowModal(false);
  };
  const SaveDescription = () => {
    handleUpdateDescription();
    setShowConfirm(true);
  };
  // School
  const [schools, setSchools] = useState([]); 
  const [unsavedSchools, setUnsavedSchools] = useState([]); 
  const [newSchool, setNewSchool] = useState("");


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

  const handleAddSchool = () => {
    if (newSchool.trim() === "") return;
  
    if ([...schools, ...unsavedSchools].length >= 2) {
      alert("The limit for schools is 2. Please delete one and enter again.");
      return;
    }
  
    setUnsavedSchools([...unsavedSchools, newSchool]); 
    setNewSchool(""); 
  };
  
  const handleRemoveSchool = (index) => {
    if (index < schools.length) {
      const updatedSchools = schools.filter((_, i) => i !== index);
      setSchools(updatedSchools);
    } else {
      const newIndex = index - schools.length;
      setUnsavedSchools(unsavedSchools.filter((_, i) => i !== newIndex));
    }
  };
  
  
  // ---------------------------

  // Company
  const [companies, setCompanies] = useState([]); 
  const [unsavedCompanies, setUnsavedCompanies] = useState([]); 
  const [newCompany, setNewCompany] = useState("");


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

  const handleAddCompany = () => {
    if (newCompany.trim() === "") return;
    if ([...companies, ...unsavedCompanies].length >= 3) {
      alert("The limit for companies is 3. Please delete one and enter again.");
      return;
    }
  
    setUnsavedCompanies([...unsavedCompanies, newCompany]);
    setNewCompany("");
  };
  
  const handleRemoveCompany = (index) => {
    if (index < companies.length) {
      const updatedCompanies = companies.filter((_, i) => i !== index);
      setCompanies(updatedCompanies);
    } else {
      const newIndex = index - companies.length;
      setUnsavedCompanies(unsavedCompanies.filter((_, i) => i !== newIndex));
    }
  };
  

  const handleSave = async () => {
    const updatedSchools = [...schools, ...unsavedSchools];
    const updatedCompanies = [...companies, ...unsavedCompanies];
  
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/profile/edit/${user._id}`,
        {
          schools: updatedSchools,
          companies: updatedCompanies,
          user: { id: user._id },
          fullName: user.fullName,
          description: user.description,
          avatar: user.avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setSchools(response.data.schools || []);
        setUnsavedSchools([]);
        setCompanies(response.data.companies || []);
        setUnsavedCompanies([]);
        alert("Profile saved successfully!");
      }
    } catch (err) {
      console.error("Error saving profile:", err.response?.data?.message || err.message);
    }
  };
  const handleYesClick = async () => {
    await handleSave(); 
    window.location.reload(); 
  };
  
  
  // -------------------------------

  // Description
  const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;


  const [description, setDescription] = useState("");
  const [unsavedDescription, setUnsavedDescription] = useState(""); 
  const [newDescription, setNewDescription] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [showConfirm1, setShowConfirm1] = useState(false);

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

  const handleEditorChange = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    setNewDescription(sanitizedContent);
  };
  const handleUpdateDescription = (e) => {
    setUnsavedDescription(e.target.value);
  };
  
  const handleSaveDescription = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/profile/edit/${user._id}`,
        {
          description: newDescription, 
          schools,
          companies,
          user: { id: user._id },
          fullName: user.fullName,
          avatar: user.avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setDescription(response.data.description || unsavedDescription);
        setUnsavedDescription(""); 
      }
    } catch (err) {
      console.error("Error saving description:", err.response?.data?.message || err.message);
    }
  };
  const handleYesClick1 = async () => {
    await handleSaveDescription(); 
    window.location.reload(); 
  };

  // --------------------------

  // Post
  const navigate = useNavigate()
  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };

  //----------------------------
  //Image
  const [previewImage, setPreviewImage] = useState(null);
  
  const information = id === user._id ? user : profileData;
  //--------------
  const check = id !== user._id && profileData.isPrivate;
  
  return (
    
    <div >
      {check ? (
      <div style={{ padding: "50px", display: "flex", justifyContent: "center", alignItems: "center",height:"100%" }}>
        <p>This profile is private!</p>
      </div>
      
      ) : (
        <div className='main'>
      <div className="left">
      <div className='bio' >
        <h1 style={{ margin: "20px" }}>Bio</h1>
        <div style={{ marginLeft: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ cursor: "pointer" }}>
              <img src="/src/assets/school.svg" alt="" width={30} height={30} />
            </div>
            {information?.schools?.length > 0 && (
              <div style={{ marginLeft: "10px" }}>
                <div>{information?.schools?.length === 1 && user.schools[0]}</div>

                <div>{information?.schools[information?.schools?.length - 2]}</div>

              </div>
            )}
          </div>
          {information?.schools?.length > 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
                marginLeft: "40px"
              }}
            >
              {information?.schools[information?.schools?.length - 1]}

            </div>
          )}
        </div>
        {/* companies */}
        <div style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ cursor: "pointer" }}>
              <img src="/src/assets/company.svg" alt="" width={30} height={30} />
            </div>
            {information?.companies?.length > 0 && (
              <div style={{ marginLeft: "10px" }}>
                <div>{information?.companies?.length === 1 && information?.companies[0]}</div>
                <div>{information?.companies[information?.companies?.length - 2]}</div>
              </div>
            )}
          </div>
          {(information?.companies ?? []).length > 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "10px",
                marginLeft: "40px"
              }}
            >
              {information?.companies[information?.companies?.length - 1]}

            </div>
          )}
        </div>
        { id === user._id && (
          <button className='editbut' onClick={() => setShowModal(true)}>
            Edit personal details
          </button>
        )}
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
                display: "block",
                overflowY: "auto", 
                maxHeight: "80vh", 
                backgroundColor: "#333", 
                padding: "20px",
              }}
              className='detail'
            >
              <h1 style={{ color: "#FFFFFF", marginTop: "10px" }}>Editing Details</h1>
              
              {/*schools*/}
              <h2 style={{ color: "#FFFFFF", marginLeft: "20px", textAlign: "left", marginTop: "20px" }}>School</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px", marginTop: "15px" }}>
                <div tabIndex="0" className="plusButton" onClick={handleAddSchool}>
                  <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
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

              </div>

              {[...schools, ...unsavedSchools].map((school, index) => (
                <div key={index} className="school-item" style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginLeft: "20px",
                  height: "30px",
                  position: "relative"
                }}>
                  <div style={{
                    fontSize: "16px",
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {school}
                  </div>
                  <button onClick={() => handleRemoveSchool(index)} className="delete-button">
                    x
                  </button>
                </div>
              ))}

              <style>
                {`
        .school-item {
            position: relative;
        }
        .delete-button {
            margin-left: 10px;
            color: red;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            height: 24px;
            width: 24px;
            display: none; 
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
            
        }
        .school-item:hover .delete-button {
            display: flex; 
        }
    `}
              </style>
              {/*companies*/}
              <h2 style={{ color: "#FFFFFF", marginLeft: "20px", textAlign: "left" }}>Company</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px", marginTop: "15px" }}>
                <div tabIndex="0" className="plusButton" onClick={handleAddCompany}>
                  <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
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

              </div>

              {[...companies, ...unsavedCompanies].map((company, index) => (
                <div key={index} className="company-item" style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginLeft: "20px",
                  height: "30px",
                  position: "relative"
                }}>
                  <div style={{
                    fontSize: "16px",
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {company}
                  </div>
                  <button onClick={() => handleRemoveCompany(index)} className="delete-button">
                    x
                  </button>
                </div>
              ))}


              <style>
                {`
        .company-item {
            position: relative;
        }
        .delete-button {
            margin-left: 10px;
            color: red;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            height: 24px;
            width: 24px;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
        }
        .company-item:hover .delete-button {
            display: flex;
        }
    `}
              </style>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid gray", borderBottom: "1px solid gray", marginTop: "10px", height: "50px" }}>
                <div style={{ color: "#FFFFFF" }}>Update information</div>
                <div>
                <button
                  onClick={handleCloseClick}
                  style={{

                    padding: "10px 20px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6b7280", 
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    marginLeft:"10px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
                </div>
                {showConfirm && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#000000",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    zIndex: 1000,
                    border: "3px solid #ff4e4e",
                  }}
                >
                  <img
                    src="/src/assets/bg-logo.svg"
                    alt="Logo"
                    style={{ width: "50px", height: "50px", marginBottom: "10px" }}
                  />
                  <p>Are you sure with your changes?</p>
                  <button
                    onClick={handleYesClick}
                    style={{
                      margin: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCancelClick}
                    style={{
                      margin: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        )}


      </div>
      <div className='im'>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px" }}>
  <h1>Images</h1>
  <button className="view-button" onClick={() => setView("Media")}>View full</button>
</div>
  <div className="flex-container">
    {Array.from({ length: 4 }).map((_, index) => {
      const image = posts.flatMap(post => post.images || [])[index]; 
      return (
        <div key={index} className="flex-item" style={{ 
          width: "100%", 
          aspectRatio: "1/1", 
          backgroundColor: image ? "transparent" : "#fff", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          border: "1px solid #ccc", 
          borderRadius: "8px"
        }}>
          {image ? (
            <img 
              src={image} 
              alt={`Image ${index + 1}`} 
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.005)";
                e.currentTarget.style.filter = "brightness(80%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "brightness(100%)";
              }}
              onClick={() => setPreviewImage(image)}
            />
          ) : (
            <span style={{ color: "#999" }}></span> 
          )}
        </div>
      );
    })}
  </div>
  {previewImage && (
        <div 
          className="preview-overlay" 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Preview" 
            style={{
              width: "auto",
              height: "90%",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)"
            }}
          />
        </div>
      )}
</div>
</div>
      <div className="right">
      <div className='about' >
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <h1 style={{ margin: "0 20px 0 0" }}>About</h1>
            <div
              onClick={() => { setEditMode(true); setNewDescription(description); }}
              style={{ cursor: "pointer" }}
            >
              { id === user._id && (<img src="/src/assets/pen.svg" alt="Edit" width={15} height={15} />)}
            </div>
          </div>

          {editMode ? (
            <div >
              <div dangerouslySetInnerHTML={{ __html: newDescription }} />

              <Editor
                apiKey={textEditorAPI}
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
                <button onClick={() => setShowConfirm1(true)} style={{
                  marginLeft: '10px',
                  backgroundColor: 'black',
                  color: 'white',
                  border: '1px solid white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>Save</button>
                {showConfirm1 && (
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#000000",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    zIndex: 1000,
                    border: "3px solid #ff4e4e",
                  }}
                >
                  <img
                    src="/src/assets/bg-logo.svg"
                    alt="Logo"
                    style={{ width: "50px", height: "50px", marginBottom: "10px" }}
                  />
                  <p>Are you sure with your changes?</p>
                  <button
                    onClick={handleYesClick1}
                    style={{
                      margin: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#22c55e",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setShowConfirm1(false);
                    }}
                    style={{
                      margin: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
                <button
                  onClick={() => { setEditMode(false); setNewDescription(""); }}
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
            <div dangerouslySetInnerHTML={{ __html: information?.description }}

            >

            </div>
          )}
        </div>

      </div>
      


<div className='Post'>
  <h1 style={{ margin: "20px" }}>Posts</h1>

  <div>
    <div className="posts-container">
      {(information?.posts ?? []).slice().reverse().map((post, index) => {
        const date = new Date(post.createdAt);
        const formattedDate = `${date.getDate()} ${date.toLocaleString('en', { month: 'long' })}, ${date.getFullYear()}`;

        // Chọn icon phù hợp
        const postIcon = post.status === "private" ? "/src/assets/private.svg" : "/src/assets/qa.svg";

        return (
          <div className='post-card' key={index}>
            <div className='post-icon-title'>
              <img src={postIcon} alt="" width={30} height={30} />
              <div className='post-title' key={post._id} onClick={() => handlePostClick(post._id)}>
                {post.title}
              </div>
            </div>
            <div className='post-date'>{formattedDate}</div>
          </div>
        );
      })}
    </div>
  </div>
</div>
</div>
      </div>)}
    </div>)
}

export default ProfileMain