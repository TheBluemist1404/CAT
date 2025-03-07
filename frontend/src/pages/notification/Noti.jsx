import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Noti({ token, noti }) {
  const navigate = useNavigate();
  const [sender, setSender] = useState();

  useEffect(() => {
    async function getSender() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/profile/detail/${noti.sender}`,
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        );
        setSender(response.data);
      } catch (error) {
        console.error("failed to get sender", error);
      }
    }

    getSender();
  }, []);

  //Return

  if (noti.type === "post" || noti.type === "comment") {
    const postId = noti.post;
    const [post, setPost] = useState();

    useEffect(() => {
      async function fetchPost() {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/forum/detail/${postId}`,
            { headers: { Authorization: `Bearer ${token.accessToken}` } }
          );
          setPost(response.data);
        } catch (error) {
          console.error(error);
          if (error.status === 404) {
            console.log("this post is gone");
          }
        }
      }

      fetchPost();
    }, []);

    const [timeDisplay, setTimeDisplay] = useState();

    useEffect(() => {
      //Handle time display
      if (post) {
        const timestamp = noti.createdAt;
        const createdDate = new Date(timestamp);
        const now = new Date();
        const timeDiff = now - createdDate; //in miliseconds

        if (timeDiff < 60 * 1000) {
          const seconds = Math.floor(timeDiff / 1000);
          setTimeDisplay(`${seconds} seconds ago`);
        } else if (timeDiff < 60 * 60 * 1000) {
          const minutes = Math.floor(timeDiff / (1000 * 60));
          setTimeDisplay(`${minutes} minutes ago`);
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          setTimeDisplay(`${hours} hours ago`);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          setTimeDisplay(`${days} days ago`);
        }
      }
    }, [post]);

    //Mark as read
    const [mark, setMark] = useState(noti.isRead);
    async function markAsRead() {
      try {
        setMark(true);
        const response = await axios.patch(
          `http://localhost:3000/api/v1/notifications/${noti._id}`,
          null,
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        );
      } catch (error) {
        console.error("failed when marking", error);
      }
    }

    if (!post) {
      return <div>Cannot find post {postId}</div>;
    }

    return (
      <div className="noti">
        <div className="message">
          <div className="avatar">
            <img src={sender?.avatar} alt="" />
          </div>
          <div className="text">
            <div>{noti.message}</div>
            <div className="time">{timeDisplay}</div>
          </div>
        </div>
        <div className="post">
          <div
            className="title"
            onClick={() => {
              navigate(`/forum/${post._id}`);
            }}
          >
            {post?.title}
          </div>
          <div className="tags">
            {post.tags.map((tag, index) => (
              <div className="tag" key={index}>
                {tag.title}
              </div>
            ))}
          </div>
        </div>
        <div className="mark-as-read" onClick={markAsRead}>
          <div className="br"></div>
          <div className="mark">
            <div className="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M4 9C4 6.17157 4 4.75736 4.87868 3.87868C5.75736 3 7.17157 3 10 3H14C16.8284 3 18.2426 3 19.1213 3.87868C20 4.75736 20 6.17157 20 9V15.8276C20 18.5109 20 19.8525 19.1557 20.2629C18.3114 20.6733 17.2565 19.8444 15.1465 18.1866L14.4713 17.656C13.2849 16.7239 12.6917 16.2578 12 16.2578C11.3083 16.2578 10.7151 16.7239 9.52871 17.656L8.85346 18.1866C6.74355 19.8444 5.68859 20.6733 4.84429 20.2629C4 19.8525 4 18.5109 4 15.8276V9Z"
                    stroke-width="2"
                    stroke={mark && "var(--highlight-blue)"}
                    fill={mark && "var(--highlight-blue)"}
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="text">Mark as read</div>
          </div>
        </div>
      </div>
    );
  }

  if (noti.type === "project_invite" ) {
    const projectId = noti.project;
    const [project, setProject] = useState();

    useEffect(() => {
      async function fetchProject() {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/projects/${projectId}`,
            { headers: { Authorization: `Bearer ${token.accessToken}` } }
          );
          setProject(response.data);
        } catch (error) {
          console.error(error);
          if (error.status === 404) {
            console.log("this project is gone");
          }
        }
      }

      fetchProject();
    }, []);

    const [timeDisplay, setTimeDisplay] = useState();

    useEffect(() => {
      //Handle time display
      if (project) {
        const timestamp = noti.createdAt;
        const createdDate = new Date(timestamp);
        const now = new Date();
        const timeDiff = now - createdDate; //in miliseconds

        if (timeDiff < 60 * 1000) {
          const seconds = Math.floor(timeDiff / 1000);
          setTimeDisplay(`${seconds} seconds ago`);
        } else if (timeDiff < 60 * 60 * 1000) {
          const minutes = Math.floor(timeDiff / (1000 * 60));
          setTimeDisplay(`${minutes} minutes ago`);
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          setTimeDisplay(`${hours} hours ago`);
        } else {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          setTimeDisplay(`${days} days ago`);
        }
      }
    }, [project]);

    //Mark as read
    const [mark, setMark] = useState(noti.isRead);
    async function markAsRead() {
      try {
        setMark(true);
        const response = await axios.patch(
          `http://localhost:3000/api/v1/notifications/${noti._id}`,
          null,
          { headers: { Authorization: `Bearer ${token.accessToken}` } }
        );
      } catch (error) {
        console.error("failed when marking", error);
      }
    }

    if (!project) {
      return <div>Cannot find project {projectId}</div>;
    }

    return (
      <div className="noti">
        <div className="message">
          <div className="avatar">
            <img src={sender?.avatar} alt="" />
          </div>
          <div className="text">
            <div>{noti.message}</div>
            <div className="time">{timeDisplay}</div>
          </div>
        </div>
        <div className="post">
          <div
            className="title"
            onClick={() => {
              navigate(`/live-code/preview/${project._id}`);
            }}
          >
            {project?.name}
          </div>
          <div>{project.description}</div>
        </div>
        <div className="mark-as-read" onClick={markAsRead}>
          <div className="br"></div>
          <div className="mark">
            <div className="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M4 9C4 6.17157 4 4.75736 4.87868 3.87868C5.75736 3 7.17157 3 10 3H14C16.8284 3 18.2426 3 19.1213 3.87868C20 4.75736 20 6.17157 20 9V15.8276C20 18.5109 20 19.8525 19.1557 20.2629C18.3114 20.6733 17.2565 19.8444 15.1465 18.1866L14.4713 17.656C13.2849 16.7239 12.6917 16.2578 12 16.2578C11.3083 16.2578 10.7151 16.7239 9.52871 17.656L8.85346 18.1866C6.74355 19.8444 5.68859 20.6733 4.84429 20.2629C4 19.8525 4 18.5109 4 15.8276V9Z"
                    stroke-width="2"
                    stroke={mark && "var(--highlight-blue)"}
                    fill={mark && "var(--highlight-blue)"}
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="text">Mark as read</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Noti;
