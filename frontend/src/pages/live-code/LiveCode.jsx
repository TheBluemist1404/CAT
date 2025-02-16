import axios from 'axios'
import { useState } from 'react';

function LiveCode({token}) {
  const [projectName, setProjectName] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  async function createProject(e) {
    e.preventDefault();

    const response = await axios.post('http://localhost:3000/api/v1/projects/${}', { name: projectName, description: projectDesc}, {headers: `Bearer ${token.accessToken}`})
    console.log(response.data)
  }
  return (<div>
    <form action="" onSubmit={createProject}>
      <div>
        <label htmlFor="name">Project Name</label>
        <input type="text" id="name" required={true} onChange={(e) => { setProjectName(e.target.value) }} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input type="text" id="description" required={true} onChange={(e) => { setProjectDesc(e.target.value) }} />
      </div>
      <input type="submit" content="New Project" />
    </form>
  </div>)
}

export default LiveCode