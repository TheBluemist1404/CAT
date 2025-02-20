import { useState, useRef } from "react";

import AvatarEditor from "react-avatar-editor";


function ProfileAvatar({ user, profileData, token, id }) {
  console.log(profileData);
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [showAvatarChange, setShowAvatarChange] = useState(false);

  //update avatar

  const [selectedFile, setSelectedFile] = useState(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Choose an image!");
      return;
    }

    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("avatar", blob, "avatar.png");
        formData.append("fullName", user.fullName);
        formData.append("description", user.description || "");

        
        user.companies.forEach(company => formData.append("companies[]", company));
        user.schools.forEach(school => formData.append("schools[]", school));

        try {
          const response = await axios.patch(
            `http://localhost:3000/api/v1/profile/edit/${user._id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`
              }
            }
          );

          console.log("Response from API:", response.data);

          if (response.status === 200) {
            alert("Update avatar successfully!");
            const updatedData = response.data;

            setUser((prevUser) => ({
              ...prevUser,
              avatar: updatedData.avatar || prevUser.avatar,
              fullName: updatedData.fullName || prevUser.fullName,
              description: updatedData.description || prevUser.description,
              companies: Array.isArray(updatedData.companies)
                ? updatedData.companies
                : [updatedData.companies],
              schools: Array.isArray(updatedData.schools)
                ? updatedData.schools
                : [updatedData.schools],
            }));
          }
        } catch (error) {
          console.error("Error:", error.response?.data?.message || error.message);
        }
      }, "image/png");
    }
  };
  console.log(user._id);
  return (
    <div className='image' >

      <div className="profile-avatar">
        <img className='ava' src={profileData?.avatar} alt="" />
        { id === user._id && (<img className='cam' src="/src/assets/camera.svg" onClick={() => setShowAvatarChange(true)} alt="" width={30} height={30} style={{ position: "absolute", bottom: "5px", left: "90px", zIndex: 1000 }} />)}
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
            zIndex: 99999
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

            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "#FFFFFF" }}>Upload Avatar</h1>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" style={{ marginTop: "20px", display: "none" }} />
                <label
                  htmlFor="fileInput"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  Choose File
                </label>

                {selectedFile ? <p>{selectedFile.name}</p> : <p>No file selected</p>}
              </div>
              {selectedFile && (
                <div style={{ marginTop: "20px" }}>
                  <AvatarEditor
                    ref={editorRef}
                    image={selectedFile}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    scale={scale}
                  />
                  <br />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                  />
                  <button onClick={handleUpload} style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center"
                  }}>Save Avatar</button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid gray", borderBottom: "1px solid gray", marginTop: "10px" }}>
              <div style={{ color: "#FFFFFF" }}>Update information</div>
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


      <h1 className='profile-username'>{profileData?.fullName}</h1>
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
  )
}

export default ProfileAvatar