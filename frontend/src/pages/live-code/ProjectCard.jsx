import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

function ProjectCard ({info}) {
  console.log(info)
  const navigate = useNavigate();
  const [createAt, setCreatedAt] = useState(0);

  useEffect(()=> {
    const date = new Date(info.createdAt);
    console.log(formatDate(date))
    setCreatedAt(formatDate(date));
  }, [])

  function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based, so add 1
    let year = date.getFullYear();
  
    // Ensure day and month are two digits
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
  
    return `${day}/${month}/${year}`;
  }

  function handleCick() {
    navigate(`/live-code/preview/${info._id}`)
  }
  return(
  <div className="project-card">
    <div className="like"></div>
    <div className="content">
      <div className="name" onClick={handleCick}>{info.name}</div>
      <div className="lang">{info.language}</div>
      <div className="createdAt">{createAt}</div>
      <div className="band"></div>
    </div>
    <div className="options"></div>
  </div>)
}

export default ProjectCard