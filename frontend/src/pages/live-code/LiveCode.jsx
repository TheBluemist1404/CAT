import "./live-code.scss";
import vinyl from "@live-code-assets/vinyl.svg";
import arrow from "@live-code-assets/Arrow 1.svg";
import timer from "@live-code-assets/timer.svg";
import doc from '@live-code-assets/code-doc.svg'

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import ProjectCard from "./ProjectCard";

function LiveCode({ token }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState();

  async function fetchProjects() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/projects",
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );
    setProjects(response.data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function createProject() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/projects",
        { name: "Untitled", description: "write someting..." },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      if (response) {
        console.log(response.data);
        navigate(`/live-code/preview/${response.data._id}`);
      }
    } catch (error) {
      console.error("error create project", error);
    }
  }

  function timeDisplay(secs) {
    if (secs < 60) {
      const seconds = Math.floor(secs);
      return `${seconds} secs`;
    } else if (secs < 60 * 60) {
      const minutes = Math.floor(secs / 60);
      return `${minutes} mins`;
    } else if (secs < 24 * 60 * 60) {
      const hours = Math.floor(secs / (60 * 60));
      return `${hours} hrs`;
    } else {
      const days = Math.floor(secs / (60 * 60 * 24));
      return `${days} days`;
    }
  }

  return (
    <div className="live-code">
      <div className="back">
        <div className="home" onClick={() => navigate("/")}>
          Home
        </div>
        <img src={arrow} alt="" />
      </div>
      <div className="vinyl">
        <img src={vinyl} alt="" />
      </div>
      <div className="user">
        <div className="avatar">
          <img src={user.avatar} alt="" />
        </div>
        <div className="username">
          {user.fullName.length <= 15
            ? user.fullName
            : user.fullName.substr(0, 10)}
        </div>
        <div className="code-time">
          <div className="icon">
            <img src={timer} alt="" />
          </div>
          <div className="content">
            <div className="main">{timeDisplay(user.duration)}</div>
            <div className="sub">hard-coding</div>
          </div>
        </div>
        <div className="number-of-projects">
          <div className="icon">
            <img src={doc} alt="" />
          </div>
          <div className="content">
            <div className="main">{projects && (projects.length > 0)? projects.length + '+': 0}</div>
            <div className="sub">Projects</div>
          </div>
        </div>
      </div>
      <div className="playlist">
        <div className="topbar">
          <div className="create-project" onClick={createProject}>
            + New Project
          </div>
        </div>
        <div className="projects">
          {projects &&
            projects.map((project, index) => (
              <ProjectCard
                key={index}
                info={project}
                token={token}
                fetchProjects={fetchProjects}
              ></ProjectCard>
            ))}
        </div>
      </div>
    </div>
  );
}

export default LiveCode;
