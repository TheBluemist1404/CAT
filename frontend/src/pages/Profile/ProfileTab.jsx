import { useState,useEffect } from "react"
import axios from "axios";

function ProfileTab({ view, setView,id,user,token,profileData,isPrivate,setIsPrivate }) {
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
  

  
  
  console.log("User Data:", user);
  useEffect(() => {
    const fetchPrivate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/profile/detail/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );

        if (response.status === 200 && response.data.isPrivate) {
          setIsPrivate(response.data.isPrivate);

        }
      } catch (err) {
        console.error("Error fetching description:", err.response?.data?.message || err.message);
      }
    };

    fetchPrivate();
  }, [user, token]);

const handleTogglePrivacy = async () => {
  if (!user) return;

  try {
    const updatedStatus = isPrivate ? "public" : "private"; // Toggle between public & private

    const response = await axios.patch(
      `http://localhost:3000/api/v1/profile/change-status/${user._id}`,
      { status: updatedStatus }, // Sending only required field
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      setIsPrivate(updatedStatus === "private"); // Update state based on response
    }
  } catch (err) {
    console.error("Error:", err.response?.data?.message || err.message);
  }
};

console.log("profiledata:", profileData);

const check = id !== user._id && profileData.isPrivate;
  return (
    <div className='tabs'>
      <div className="tab-container">
        <button type='button' className={`p ${view === "posts" ? "active" : ""}`} onClick={() => setView("posts")}>Posts</button>
        {!check && <button type="button" className={`i ${view === "Media" ? "active" : ""}`} onClick={() => setView("Media")}>Media</button>}
        { id === user._id && (<button type='button' className={`v ${view === 'Saved' ? 'active' : ''}`} onClick={() => setView("Saved")}>Saved</button>)}
      </div>
      { id === user._id && (
      <div style={{marginRight: '10%'}}>
        <div className="settings" onClick={handleSvgClick}>
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
            <button onClick={handleTogglePrivacy} className='b'>{isPrivate ? "Set Public" : "Set Private"}</button>
            <button onClick={handleClose} className='b'>Close</button>
          </div>
        )}

      </div>
      )}
    </div>
  )
}

export default ProfileTab