import './editor-preview.scss'

import { useNavigate } from "react-router-dom"
import CodeEditor from "./CodeEditor"

function EditorPreview ({token}) {
  const projectId = window.location.href.split('/').pop();
  const navigate = useNavigate()
  return(
    <div className="editor-preview">
      <div className="container">
        <div className="details">details
          <div onClick={()=>{navigate(`/live-code/${projectId}`)}}>To Code Editor</div>
        </div>
        <div className="preview">
          <CodeEditor token={token}>
          </CodeEditor>
        </div>
      </div>
    </div>
  )
}

export default EditorPreview