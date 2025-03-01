import "./editor-preview.scss";
import add from "@live-code-assets/add-person.svg";
import arrow from "@live-code-assets/Arrow 1.svg";


import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../../authentication/AuthProvider";
import CodeEditor from "./CodeEditor";
import Button from "./Button";
import Member from "./Member";

function EditorPreview({ token, preview }) {
  const projectId = window.location.href.split("/").pop();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [detail, setDetail] = useState({});
  const [renderInvite, setRenderInvite] = useState(false);
  const [display, setDisplay] = useState(false);
  const [email, setEmail] = useState("");

  async function fetchProject() {
    const response = await axios.get(
      `http://localhost:3000/api/v1/projects/${projectId}`,
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );
    if (response) {
      setDetail(response.data);
      console.log(response.data.owner[0]._id === user._id);
      setRenderInvite(response.data.owner[0]._id === user._id); // Collaborators wont be able to invite others
    }
  }

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  function handleName(event) {
    async function updateDesc(e) {
      const input = e.target.innerHTML;
      const response = await axios.patch(
        `http://localhost:3000/api/v1/projects/${projectId}`,
        { name: input },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      console.log(response.data);
    }

    updateDesc(event);
  }

  function handleDesc(event) {
    async function updateDesc(e) {
      const input = e.target.innerHTML;
      const response = await axios.patch(
        `http://localhost:3000/api/v1/projects/${projectId}`,
        { description: input },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      console.log(response.data);
    }

    updateDesc(event);
  }

  async function addMember() {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/projects/${projectId}/collaborators`,
        { email: email },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );
      if (response) {
        console.log(response.data);
        fetchProject();
      }
    } catch (error) {
      console.error("error adding member", error);
    }
  }

  function renderingInvite() {
    if (renderInvite) {
      return (
        <div
          className="add"
          onClick={() => {
            setDisplay(() => !display);
          }}
        >
          <div className="img-container">
            <img src={add} alt="" />
          </div>
          Invite
        </div>
      );
    }
  }

  return (
    <div className="editor-preview">
      <div className="back">
        <div className="home" onClick={() => navigate("/live-code")}>
          Live Code
        </div>
        <img src={arrow} alt="" />
      </div>
      <div className="container">
        <div className="details">
          <div className="container">
            <div
              className="project-name"
              contentEditable={true}
              onInput={handleName}
            >
              {detail?.name}
            </div>
            <div className="desc" contentEditable={true} onInput={handleDesc}>
              {detail?.description}
            </div>
            <div
              className="navigate"
              onClick={() => {
                console.log("redirect to editor")
                navigate(`/live-code/editor/${projectId}`, {replace: true});
              }}
            >
              <Button />
            </div>
            <div className="band">
              {renderingInvite()}
              <div
                className="members"
                style={{ display: display ? "flex" : "none" }}
              >
                <div className="invite">
                  <input
                    type="text"
                    placeholder="Add member by email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <div className="invite-button" onClick={addMember}>
                    Invite
                  </div>
                </div>
                <div className="members-container">
                  {detail.collaborators &&
                    detail.collaborators.map((member, index) => (
                      <div className="member-container" key={index}>
                        <Member
                          member={member}
                          projectId={projectId}
                          token={token}
                          fetchProject={fetchProject}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="preview">
          <CodeEditor token={token} preview={preview} />
        </div>
      </div>
    </div>
  );
}

export default EditorPreview;
