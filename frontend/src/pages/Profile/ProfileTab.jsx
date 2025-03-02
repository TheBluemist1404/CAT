import { useState, useEffect } from "react";
import axios from "axios";

function ProfileTab({
  view,
  setView,
  id,
  user,
  token,
  profileData,
  isPrivate,
  setIsPrivate,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [follow, setFollow] = useState(false);

  // Action for owner
  const handleSvgClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

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
        console.error(
          "Error fetching description:",
          err.response?.data?.message || err.message
        );
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

  // Action for visitor
  useEffect(()=>{
    const fetchFollow = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/followees', {headers: {Authorization: `Bearer ${token.accessToken}`}})
        const followers = response.data.map(follower => follower._id)
        console.log(followers)
        if (followers.includes(id)) {
          setFollow(true)
        }
      } catch (error) {
        console.error("failed get follow status", error)
      }
    }

    if (id !== user._id) {
      fetchFollow();
    }

  }, [])

  const handleFollow = async () =>{
    if (!follow) {                      
      setFollow(!follow)
      await axios.post('http://localhost:3000/api/v1/users/follows', {id: id}, {headers: {Authorization: `Bearer ${token.accessToken}`}})
    } else {
      setFollow(!follow)
      await axios.delete('http://localhost:3000/api/v1/users/follows', {headers: {Authorization: `Bearer ${token.accessToken}`}, data:{id: id}})
    }

  }

  return (
    <div className="tabs">
      <div className="tab-container">
        {!(id !== user._id && profileData.isPrivate) && (
          <button
            type="button"
            className={`p ${view === "posts" ? "active" : ""}`}
            onClick={() => setView("posts")}
          >
            Posts
          </button>
        )}
        {!(id !== user._id && profileData.isPrivate) && (
          <button
            type="button"
            className={`i ${view === "Media" ? "active" : ""}`}
            onClick={() => setView("Media")}
          >
            Media
          </button>
        )}
        {id === user._id && (
          <button
            type="button"
            className={`v ${view === "Saved" ? "active" : ""}`}
            onClick={() => setView("Saved")}
          >
            Saved
          </button>
        )}
      </div>
      {id === user._id ? (
        <div style={{ marginRight: "10%" }}>
          <div className="settings" onClick={handleSvgClick}>
            <img src="/src/assets/setting.svg" alt="" width={30} height={30} />
          </div>

          {isVisible && (
            <div
              className="bb"
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
              <button onClick={() => alert("settings!")} className="b">
                Settings
              </button>
              <button onClick={handleTogglePrivacy} className="b">
                {isPrivate ? "Set Public" : "Set Private"}
              </button>
              <button onClick={handleClose} className="b">
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="follow"
          onClick={() => {
            handleFollow();
            setFollow(!follow);            
          }}
        >
          {!follow ? (
            <div className="following">
              <div
                style={{ width: "24px", height: "24px", objectFit: "cover" }}
              >
                <img src="/src/assets/following.svg" alt="" />
              </div>
              <div>Follow</div>
            </div>
          ) : (
            <div className="followed">
              <div
                style={{ width: "24px", height: "24px", objectFit: "cover" }}
              >
                <img src="/src/assets/followed.svg" alt="" />
              </div>
              <div>Followed</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileTab;
