import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProjectCard({ info, token, fetchProjects }) {
  console.log(info)
  const navigate = useNavigate();
  const [createAt, setCreatedAt] = useState(0);
  const [display, setDisplay] = useState(false);

  async function deleteProject() {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/projects/${info._id}`,{headers: {Authorization: `Bearer ${token.accessToken}`}})
      console.log(response.data);
      fetchProjects();
    } catch (error) {
      console.error("failed to delete project". error.message)
    }
  }

  const toggleOpen = () => {
    setDisplay(!display);
    console.log(display);
  };

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

  function handleCick() {
    navigate(`/live-code/preview/${info._id}`, { replace: true });
  }
  return (
    <div className="project-card">
      <div className="like"></div>
      <div className="content">
        <div className="name" onClick={handleCick}>
          {info.name}
        </div>
        <div className="settings" onClick={toggleOpen}>
          <svg
            preserveAspectRatio="xMidYMin"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="css-492dz9"
            style={{
              size: "20px",
              rotate: "0deg",
              width: "20px",
              height: "20px",
            }}
          >
            <path
              fill-rule="evenodd"
              d="M10.25 5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Zm0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Zm0 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div className="open" style={{ display: display ? "flex" : "none" }}>
            <div className="delete" onClick={deleteProject}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
              <div>Delete</div>
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
