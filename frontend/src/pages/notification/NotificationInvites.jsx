import "./notifications.scss";
import Header from "../../Header";
import Noti from "./Noti";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import useInfiniteScroll from "./useInfiniteScroll";

function Notifications({ token, newNoti, setNewNoti }) {
  const navigate = useNavigate();

  const page = window.location.href.split("/").pop(); // Extract 'page' correctly
  const notificationClass = {
    posts: "post",
    comments: "comment",
    invites: "project_invite",
  };
  const notiType = notificationClass[page] || "all";
  console.log(notiType);

  // const [notifications, setNotifications] = useState([]);
  const [value, setValue] = useState(-1);
  const filterRef = useRef();

  const [pageNumber, setPageNumber] = useState(1);

  const { notifications, hasMore, loading } = useInfiniteScroll(
    token,
    value,
    pageNumber,
    notiType, 
    newNoti
  );

  const observer = useRef();
  const lastNotificationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("last element");
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  //--------------------
  function updateNotis() {
    setNewNoti(false);
  }

  function handleFilter() {
    setValue(filterRef.current.value);
  }

  return (
    <div className="notifications">
      <Header token={token} isAuth={false} />
      <div className="new-notification" style={{ display: !newNoti && "none" }}>
        <div className="title" onClick={updateNotis}>
          New Notification
        </div>
      </div>
      <div className="noti-container">
        <div className="sidebar">
          <div
            className="all"
            style={{ background: !notiType && "var(--box-color)" }}
            onClick={() => navigate("/notifications")}
          >
            All
          </div>
          <div
            className="posts"
            style={{ background: notiType === "post" && "var(--box-color)" }}
            onClick={() => navigate("/notifications/posts")}
          >
            Posts
          </div>
          <div
            className="comments"
            style={{ background: notiType === "comment" && "var(--box-color)" }}
            onClick={() => navigate("/notifications/comments")}
          >
            Comments
          </div>
          <div
            className="invites"
            style={{
              background: notiType === "project_invite" && "var(--box-color)",
            }}
            onClick={() => navigate("/notifications/invites")}
          >
            Invites
          </div>
          <select
            className="filter"
            name="filter"
            id=""
            onChange={handleFilter}
            ref={filterRef}
          >
            <option value={-1}>All notifications</option>
            <option value={0}>Unread notifications</option>
            <option value={1}>Read notifications</option>
          </select>
        </div>
        <div className="main">
          {notifications.map((noti, index) => {
            if (notiType === "all" || noti.type === notiType) {
              if (index + 1 === notifications.length) {
                console.log("visible");
                return (
                  <div ref={lastNotificationRef} style={{ minHeight: "200px" }}>
                    <Noti key={index} token={token} noti={noti} />
                  </div>
                );
              } else {
                return (
                  <div style={{ minHeight: "200px" }}>
                    <Noti key={index} token={token} noti={noti} />
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
