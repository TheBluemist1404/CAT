import "./live-code.scss";
import vinyl from "@live-code-assets/vinyl.svg";
import arrow from "@live-code-assets/Arrow 1.svg";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authentication/AuthProvider";
import ProjectCard from "./ProjectCard";

function LiveCode({ token }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState();
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  async function fetchProjects() {
    const response = await axios.get(
      "http://localhost:3000/api/v1/projects",
      { headers: { Authorization: `Bearer ${token.accessToken}` } },
      { user: { id: user._id } }
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
      console.error("error create project", error.message);
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
        <div className="code-time">Code hours</div>
        <div className="number-of-projects">number of projects</div>
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
