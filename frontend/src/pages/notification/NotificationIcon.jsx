import { useNavigate } from "react-router-dom";

function NotificationIcon() {
  const navigate = useNavigate()
  return (
    <div
    onClick={()=>{navigate('/notifications')}}
      style={{
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        position: "fixed",
        bottom: "30px",
        right: "20px",
        background: "#ffffff",
        border: "none",
        padding: "10px",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 1000,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        role="img"
        aria-labelledby="aokwjs78mu9eue2ieuqpddf8fidyp7t3"
        class="crayons-icon"
      >
        <title id="aokwjs78mu9eue2ieuqpddf8fidyp7t3">Notifications</title>
        <path d="M20 17h2v2H2v-2h2v-7a8 8 0 1116 0v7zm-2 0v-7a6 6 0 10-12 0v7h12zm-9 4h6v2H9v-2z"></path>
      </svg>
    </div>
  );
}

export default NotificationIcon;
