import "./notifications.scss";
import Header from "../../Header";
import Noti from "./Noti";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Notifications({ token, newNoti, setNewNoti }) {
  const navigate = useNavigate();
  const { page } = useParams(); // Extract 'page' correctly
  const notificationClass = { posts: "post", comments: "comment", invites: "project_invite" };
  const notiType = notificationClass[page];

  const [notifications, setNotifications] = useState([]);  
  const [value, setValue] = useState(-1)
  const filterRef = useRef()

  async function fetchNotifications() {
    setNotifications([]); //Empty it to avoid unexpected behaviour
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/notifications?isRead=${value}`, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });
      setNotifications(response.data.reverse());
    } catch (error) {
      console.error("Failed fetching notifications", error);
    }
  }
  useEffect(() => {
    fetchNotifications();
  }, [value]); // Add dependency to re-fetch when token changes

  //--------------------
  function updateNotis() {
    fetchNotifications()
    setNewNoti(false)
  }

  function handleFilter() {
    setValue(prev => filterRef.current.value)
  }

  
  return (
    <div className="notifications">
      <Header token={token} isAuth={false}/>
      <div className="new-notification" style={{display: !newNoti && "none"}}>
        <div className="title" onClick={updateNotis}>New Notification</div>
      </div>
      <div className="noti-container">
        <div className="sidebar">          
          <div className="all" style={{ background: !notiType && "var(--box-color)" }} onClick={() => navigate("/notifications")}>
            All
          </div>
          <div className="posts" style={{ background: notiType === "post" && "var(--box-color)" }} onClick={() => navigate("/notifications/posts")}>
            Posts
          </div>
          <div className="comments" style={{ background: notiType === "comment" && "var(--box-color)" }} onClick={() => navigate("/notifications/comments")}>
            Comments
          </div>
          <div className="invites" style={{ background: notiType === "project_invite" && "var(--box-color)" }} onClick={() => navigate("/notifications/invites")}>
            Invites
          </div>
          <select className="filter" name="filter" id="" onChange={handleFilter} ref={filterRef}>
            <option value={-1}>All notifications</option>
            <option value={0}>Unread notifications</option>
            <option value={1}>Read notifications</option>
          </select>
        </div>
        <div className="main">
          {notifications.map((noti, index) => (
            (!notiType || noti.type === notiType) && <Noti key={index} token={token} noti={noti}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
