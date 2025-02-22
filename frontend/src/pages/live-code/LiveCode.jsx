import './live-code.scss'
import vinyl from '@live-code-assets/vinyl.svg';
import arrow from '@live-code-assets/Arrow 1.svg'

import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../authentication/AuthProvider';
import ProjectCard from './ProjectCard';

function LiveCode({token}) {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext)
  const [projectName, setProjectName] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  function handleClick () {

  }
  async function createProject(e) {
    e.preventDefault();

    const response = await axios.post('http://localhost:3000/api/v1/projects/${}', { name: projectName, description: projectDesc}, {headers: `Bearer ${token.accessToken}`})
    console.log(response.data)
  }

  return (
  <div className='live-code'>
    <div className="back">
      <div className='home' onClick={() => navigate('/')}>Home</div>
      <img src={arrow} alt="" />
    </div>
    <div className="vinyl">
      <img src={vinyl} alt="" />
    </div>
    <div className="user">
      <div className="avatar">
        <img src={user.avatar} alt="" />
      </div>
      <div className='username'>{user.fullName}</div>
      <div className="code-time">Code hours</div>
      <div className="number-of-projects">number of projects</div>
    </div>
    <div className="playlist">
      <div className="topbar">
        <div className="create-project" onClick={handleClick}>+ New Project</div>
      </div>
      <div className="projects">
        <ProjectCard></ProjectCard>
        <ProjectCard></ProjectCard>
        <ProjectCard></ProjectCard>
      </div>
    </div>
  </div>)
}

export default LiveCode