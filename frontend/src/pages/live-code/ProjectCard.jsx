import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authentication/AuthProvider";

function ProjectCard({ info, token, fetchProjects }) {
  const { user } = useContext(AuthContext);
  // console.log(info);
  const navigate = useNavigate();
  const [createAt, setCreatedAt] = useState(0);
  const [starred, setStarred] = useState(false);
  const [display, setDisplay] = useState(false);

  function handleCick() {
    navigate(`/live-code/preview/${info._id}`, { replace: true });
  }

  // star
  useEffect(() => {
    const starUsers = info.remarks;
    if (starUsers && starUsers.includes(user._id)) {
      setStarred(true);
    }
  }, []);

  async function star() {
    setStarred(!starred)
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/projects/${info._id}/remarks`,
        { isRemarked: !starred },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }        
      );      
    } catch (error) {
      console.error("get star failed", error);
    }
  }

  // settings
  async function deleteProject() {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/projects/${info._id}`,
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      fetchProjects();
    } catch (error) {
      console.error("failed to delete project".error);
    }
  }

  const toggleOpen = () => {
    setDisplay(!display);
  };

  // set created date

  useEffect(() => {
    const date = new Date(info.createdAt);
    setCreatedAt(formatDate(date));
  }, []);

  function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based, so add 1
    let year = date.getFullYear();

    // Ensure day and month are two digits
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="project-card">
      <div className="like"></div>
      <div className="content">
        <div className="name" onClick={handleCick}>
          {info.name}
        </div>
        <div className="card-icons">
          <div className="star" onClick={star}>
            <svg
              preserveAspectRatio="xMidYMin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={starred ? "#f2e088" : "var(--box-color)"}
              aria-hidden="true"
              style={{
                size: "16px",
                rotate: "0deg",
                width: "16px",
                height: "16px",
              }}
            >
              <path
                fillRule="evenodd"
                d="M12 1.25a.75.75 0 0 1 .673.418l2.915 5.907 6.52.953a.75.75 0 0 1 .415 1.28l-4.717 4.594 1.113 6.491a.75.75 0 0 1-1.088.79L12 18.618l-5.83 3.067a.75.75 0 0 1-1.09-.79l1.114-6.492-4.717-4.595a.75.75 0 0 1 .415-1.28l6.52-.952 2.915-5.907A.75.75 0 0 1 12 1.25Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="settings" onClick={toggleOpen}>
            <svg
              preserveAspectRatio="xMidYMin"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                size: "20px",
                rotate: "0deg",
                width: "20px",
                height: "20px",
              }}
            >
              <path
                fillRule="evenodd"
                d="M10.25 5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Zm0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Zm0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div
              className="open"
              style={{ display: display ? "flex" : "none" }}
            >
              <div className="delete" onClick={deleteProject}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                <div>Delete</div>
              </div>
            </div>
          </div>
        </div>
        <div className="createdAt">{createAt}</div>
      </div>
      <div className="options"></div>
    </div>
  );
}

export default ProjectCard;
