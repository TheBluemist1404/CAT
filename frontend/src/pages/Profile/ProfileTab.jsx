import { useState } from "react"

function ProfileTab({ view, setView }) {
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

  return (
    <div className='tabs'>
      <div className="tab-container">
        <button type='button' className={`p ${view === "posts" ? "active" : ""}`} onClick={() => setView("posts")}>Posts</button>
        <button type='button' className={`i ${view === "Media" ? "active" : ""}`} onClick={() => setView("Media")}>Media</button>
        <button type='button' className={`v ${view === 'Saved' ? 'active' : ''}`} onClick={() => setView("Saved")}>Saved</button>
      </div>
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
            <button onClick={() => alert("adjusts!")} className='b'>Adjusts</button>
            <button onClick={handleClose} className='b'>Close</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProfileTab