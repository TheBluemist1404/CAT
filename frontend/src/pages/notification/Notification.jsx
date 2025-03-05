import "./notifications.scss";

import { io } from "socket.io-client";

import Header from "../../Header";
import Noti from "./Noti";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Notifications({ token }) {
  // could send token via auth header or query
  const socket = io("http://localhost:3000", {
    auth: {
      token: token.accessToken, // accessToken here
    },
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("newNotification", (data) => {
    console.log("Received notification:", data);
  });

  const navigate = useNavigate()
  const type = useParams()
  const notificationClass = {posts: "post", comments: "comment", invites: "project_invite"}
  const notiType = notificationClass[type?.page]
  console.log(notiType)
  const [notifications, setNotifications] = useState([])
  useEffect(()=> {
    async function fetchNotifications() {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/notifications', {headers: {Authorization: `Bearer ${token.accessToken}`}})
        console.log(response.data)
        setNotifications(response.data)
      } catch (error) {
        console.error("failed fetching notifications", error)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <div className="notifications">
      <Header />
      <div className="noti-container">
        <div className="sidebar">
          <div className="all" style={{background: !notiType && "var(--box-color)"}} onClick={() => {navigate('/notifications')}}>All</div>
          <div className="posts" style={{background: notiType === "post" && "var(--box-color)"}} onClick={() => {navigate('/notifications/posts')}}>Posts</div>
          <div className="comments" style={{background: notiType === "comment" && "var(--box-color)"}} onClick={() => {navigate('/notifications/comments')}}>Comments</div>          
          <div className="invites" style={{background: notiType === "project_invite" && "var(--box-color)"}} onClick={() => {navigate('/notifications/invites')}}>Invites</div>
        </div>
        <div className="main">
          {notifications.map((noti, index) => (
            (!notiType || noti.type === notiType) && <Noti key={index} noti={noti} type={noti.type}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
