import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../../authentication/AuthProvider";

function ProfileAvatar({ user, profileData, token, id }) {
  const { fetch } = useContext(AuthContext);
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

    async function update(formData) {
      const updatedData = await fetch(
        token,
        axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/profile/edit/${user._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        )
      );

      alert("Update avatar successfully!");

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

    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("avatar", blob, "avatar.png");
        formData.append("fullName", user.fullName);
        formData.append("description", user.description || "");

        user.companies.forEach((company) =>
          formData.append("companies[]", company)
        );
        user.schools.forEach((school) => formData.append("schools[]", school));

        update(formData)
        
      }, "image/png");
    }
  };

  // Status bar
  const getHours = (seconds) => Math.floor(seconds / 36)/100 + " hours";

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    async function getFollowers() {
      const data = await fetch(token, axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/users/${id}/followers`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      ), data)

      setFollowers(data || [])
    }

    getFollowers();
  }, [id, token]);
  //----------------
  const [modal, setModal] = useState(false);
  //navigate
  const navigate = useNavigate();
  return (
    <>
      <div className="image">
        <div className="profile-avatar">
          <img className="ava" src={profileData?.avatar} alt="" />
          {id === user._id && (
            <img
              className="cam"
              src="/src/assets/camera.svg"
              onClick={() => setShowAvatarChange(true)}
              alt=""
              width={30}
              height={30}
              style={{
                position: "absolute",
                bottom: "5px",
                left: "90px",
                zIndex: 2000,
              }}
            />
          )}
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
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "50%",
                height: "70%",
                marginTop: "5%",
                borderRadius: "16px",
                textAlign: "center",
                display: "block",
              }}
              className="detail"
            >
              <style>{`body { overflow: hidden; }`}</style>
              <div style={{ textAlign: "center" }}>
                <h1 style={{ color: "#FFFFFF" }}>Upload Avatar</h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="fileInput"
                    style={{ marginTop: "20px", display: "none" }}
                  />
                  <label
                    htmlFor="fileInput"
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    Choose File
                  </label>

                  {selectedFile ? (
                    <p>{selectedFile.name}</p>
                  ) : (
                    <p>No file selected</p>
                  )}
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
                    <button
                      onClick={handleUpload}
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      Save Avatar
                    </button>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid gray",
                  marginTop: "10px",
                }}
              >
                <div style={{ color: "#FFFFFF", marginLeft: "10px" }}>
                  Update information
                </div>
                <button
                  onClick={() => setShowAvatarChange(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="profile-username">{profileData?.fullName}</h1>
        <div className="social">
          <img src="/src/assets/facebook.svg" alt="" width={30} height={30} />
          <img src="/src/assets/github.svg" alt="" width={30} height={30} />
          <img src="/src/assets/twitter.svg" alt="" width={30} height={30} />
        </div>
        <div className="box" style={{ top: "85%" }}>
          <div className="box-item">
            <span className="number">{(profileData?.posts ?? []).length}</span>
            <span className="label">Posts</span>
          </div>
          <div className="divider"></div>
          <div className="box-item">
            <span className="number">{getHours(profileData.duration)}</span>
            <span className="label">Coding</span>
          </div>
          <div className="divider"></div>
          <div className="box-item">
            <span
              className="number"
              onClick={() => setModal(true)}
              style={{ cursor: "pointer" }}
            >
              {followers.length}
            </span>
            <span className="label">Followers</span>
          </div>
        </div>
      </div>
      {modal && (
        <>
          <div className="modal-overlay" onClick={() => setModal(false)}></div>
          <div className="modal">
            <span className="close-icon" onClick={() => setModal(false)}>
              ✖
            </span>

            <h3>Followers</h3>
            <ul className="followers-list">
              {followers.map((follower) => (
                <li key={follower._id} className="follower-item">
                  <img
                    src={follower.avatar}
                    alt={follower.fullName}
                    className="follower-avatar"
                  />
                  <span
                    className="follower-name"
                    onClick={() => (
                      setModal(false), navigate(`/profile/${follower._id}`)
                    )}
                  >
                    {follower.fullName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default ProfileAvatar;
