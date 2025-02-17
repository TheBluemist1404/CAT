import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";


function ProfileMain({ user, token }) {
  // edit school and company modal
  const [showModal, setShowModal] = useState(false);

  // School
  const [schools, setSchools] = useState([]);
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

  const handleRemoveSchool = async (indexToRemove) => {
    if (schools.length > 0) {
      // Lọc ra danh sách mới mà không có phần tử bị xóa
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
    }
  };
  // ---------------------------

  // Company
  const [companies, setCompanies] = useState([]);
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

  const handleRemoveCompany = async (indexToRemove) => {
    if (companies.length > 0) {
      // Lọc ra danh sách mới mà không có phần tử bị xóa
      const updatedCompanies = companies.filter((_, index) => index !== indexToRemove);
      setCompanies(updatedCompanies);

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
          console.log("Company removed successfully");
        }
      } catch (err) {
        console.error("Error removing company:", err.response?.data?.message || err.message);
      }
    }
  };
  // -------------------------------

  // Description
  const textEditorAPI = import.meta.env.VITE_TEXT_EDITOR_API_KEY;


  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editMode, setEditMode] = useState(false);

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

  // --------------------------

  // Post
  const navigate = useNavigate()
  const handlePostClick = (postId) => {
    navigate(`/forum/${postId}`);
  };

  return (
    <div className='main'>
      <div className='bio' >
        <h1 style={{ margin: "20px" }}>Bio</h1>
        <div style={{ marginLeft: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ cursor: "pointer" }}>
              <img src="/src/assets/school.svg" alt="" width={30} height={30} />
            </div>
            {schools.length > 0 && (
              <div style={{ marginLeft: "10px" }}>
                <div>{schools.length === 1 && schools[0]}</div>

                <div>{schools[schools.length - 2]}</div>

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
              {schools[schools.length - 1]}

            </div>
          )}
        </div>
        {/* companies */}
        <div style={{ marginLeft: '30px', marginTop: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ cursor: "pointer" }}>
              <img src="/src/assets/company.svg" alt="" width={30} height={30} />
            </div>
            {companies.length > 0 && (
              <div style={{ marginLeft: "10px" }}>
                <div>{companies.length === 1 && companies[0]}</div>
                <div>{companies[companies.length - 2]}</div>
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
              {companies[companies.length - 1]}

            </div>
          )}
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
                display: "block",
                overflowY: "auto", // ✅ Cho phép cuộn nếu nội dung vượt quá chiều cao
                maxHeight: "80vh", // ✅ Giới hạn chiều cao tối đa
                backgroundColor: "#333", // (Giữ màu nền nếu cần)
                padding: "20px",
              }}
              className='detail'
            >
              <h1 style={{ color: "#FFFFFF", marginTop: "10px" }}>Editing Details</h1>
              <h2 style={{ color: "#FFFFFF", marginLeft: "20px", textAlign: "left" }}>Company</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px", marginTop: "15px" }}>
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

              </div>

              {companies.map((company, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    marginLeft: "20px",
                    height: "30px",
                    position: "relative"
                  }}
                  className="company-item"
                >
                  <div style={{
                    fontSize: "16px",
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {company}
                  </div>
                  <button
                    onClick={() => handleRemoveCompany(index)}
                    className="delete-button"
                  >
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

              <h2 style={{ color: "#FFFFFF", marginLeft: "20px", textAlign: "left", marginTop: "20px" }}>School</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px", marginTop: "15px" }}>
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

              </div>

              {schools.map((school, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    marginLeft: "20px",
                    height: "30px",
                    position: "relative"
                  }}
                  className="school-item"
                >
                  <div style={{
                    fontSize: "16px",
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {school}
                  </div>
                  <button
                    onClick={() => handleRemoveSchool(index)}
                    className="delete-button"
                  >
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

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid gray", borderBottom: "1px solid gray", marginTop: "10px", height: "50px" }}>
                <div style={{ color: "#FFFFFF" }}>Update information</div>
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
                  Close
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

    </div>)
}

export default ProfileMain