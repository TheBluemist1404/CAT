import './code-editor.scss'

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { Awareness } from "y-protocols/awareness";
import Editor from "@monaco-editor/react";

import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

import logo from '@code-editor-assets/logo.svg'

function CodeEditor({ token }) {
  //Get Project info
  const projectId = window.location.href.split('/').pop();
  const [project, setProject] = useState({})
  const [projectName, setProjectName] = useState("")
  const [projectContent, setProjectContent] = useState({})

  useEffect(() => {
    async function fetchProject() {
      const response = await axios.get(`http://localhost:3000/api/v1/projects/${projectId}`, { headers: { Authorization: `Bearer ${token.accessToken}` } })
      console.log(response.data)
      setProject(response.data)
    }
    fetchProject()
  }, [])

  useEffect(() => {
    setProjectName(project.name);
    if (project.files && project.files.length) {
      setProjectContent(project.files[0])
    }
  }, [project])

  useEffect(() => {
    if (!projectContent) {
      console.log("content not updated yet")
    } else {
      console.log(projectContent.content);
    }
  }, [projectContent])

  // -------------------------------
  //Setup monaco editor with Yjs binding
  const ydoc = useRef(new Y.Doc()); // Shared Yjs document, useRef so it would remain after re-render
  const provider = useRef(null);
  const ytext = ydoc.current.getText("monaco"); // Shared text model
  const awareness = new Awareness(ydoc.current); // Awareness API for cursors
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize WebRTC provider (or WebSocket)
    provider.current = new WebrtcProvider("my-room-name", ydoc.current, { awareness });

    return () => {
      provider.current.destroy();
    };
  }, []);

  async function handleEditorDidMount(editor) {
    editorRef.current = editor;

    const {MonacoBinding} = await import("y-monaco")
    // Bind Yjs text syncing to Monaco
    new MonacoBinding(ytext, editor.getModel(), new Set([editor]));

    // Bind cursor awareness
    awareness.setLocalStateField("cursor", { position: 0, color: getRandomColor() });

    editor.onDidChangeCursorPosition((event) => {
      awareness.setLocalStateField("cursor", { position: event.position, color: getRandomColor() });
    });

    awareness.on("change", () => {
      updateCursorDecorations(editor);
    });
  }

  function updateCursorDecorations(editor) {
    const decorations = [];
    for (const user of awareness.getStates().values()) {
      if (user.cursor) {
        decorations.push({
          range: new monaco.Range(
            user.cursor.position.lineNumber,
            user.cursor.position.column,
            user.cursor.position.lineNumber,
            user.cursor.position.column
          ),
          options: {
            className: "remoteCursor",
            isWholeLine: false,
            overviewRuler: {
              color: user.cursor.color,
              position: monaco.editor.OverviewRulerLane.Right,
            },
          },
        });
      }
    }
    editor.deltaDecorations([], decorations);
  }

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate random color
  }


  // -------------------------------

  const navigate = useNavigate()
  const inputRef = useRef(null);
  const [mode, setMode] = useState("default")
  const [codeDisplay, setCodeDisplay] = useState([])
  const [errorDisplay, setErrorDisplay] = useState("")

  //Resize editor properly since it is not dynamic
  const editorContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: "100%", height: "100%" });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    if (editorContainerRef.current) {
      observer.observe(editorContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function getHeight(mode) {
    if (mode == "default") {
      return (dimensions.height + "px")
    } else {
      let resizeHeight = dimensions.height - 110
      return (resizeHeight + "px")
    }
  }

  // ----------------------

  const execute = async () => {
    try {
      setCodeDisplay([])
      setErrorDisplay("")
      const code = editorRef.current.getValue()
      const input = inputRef.current ? inputRef.current.value : ""
      const response = await axios.post('http://localhost:3000/api/v1/code/execute', { code: code, input: input, language: lang })
      const executionId = response.data.executionId
      console.log("✅ Execution started. Connecting WebSocket...");

      // ✅ Connect to WebSocket for real-time logs
      const ws = new WebSocket(`ws://localhost:3001/${executionId}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.log) {
            console.log("📥 Log:", data.log); // ✅ Display log immediately
            setCodeDisplay((prev) => [...prev, data.log])
          }

          if (data.error) {
            console.error("🚨 Error:", data.error); // ✅ Show errors if any
            setErrorDisplay(data.error)
          }

          if (data.done) {
            console.log("✅ Execution Complete.");
            ws.close();
          }
        } catch (error) {
          console.error("⚠️ Error parsing WebSocket data:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
      };

    } catch (error) {
      console.error("❌ Axios Error:", error.response ? error.response.data : error.message);
    }
  }

  //Set language

  const defaultLang = {
    default: "javascript",
    competitive: "cpp"
  }

  const [lang, setLang] = useState("javascript"); // Default language is JavaScript
  useEffect(() => {
    setLang(defaultLang[String(mode)])
  }, [mode])

  const handleLanguage = (event) => {
    event.preventDefault(); // ✅ Prevent form reload

    const selectedLang = event.target.value; // ✅ Get selected value
    setLang(selectedLang); // ✅ Update state

    console.log("Selected Language:", selectedLang); // ✅ Debugging log
  };

  const handleMode = (event) => {
    event.preventDefault(); // ✅ Prevent form reload

    const selectedMode = event.target.value; // ✅ Get selected value
    setMode(selectedMode); // ✅ Update state

    console.log("Selected Mode:", selectedMode); // ✅ Debugging log
  };
  // ---------------------------------
  async function handleChange() {
    const code = editorRef.current.getValue();
    const response = await axios.patch(`http://localhost:3000/api/v1/projects/${projectId}`, { "files": [{ "name": "main", "content": code, "language": lang }] }, { headers: { "Authorization": `Bearer ${token.accessToken}` } })
    console.log(response.data)
  }

  return (
    <div className="live-code">
      <div className="sidebar">
        <div className='logo'>
          <img src={logo} alt="logo" onClick={() => { navigate('/') }} />
          <div className='language'>
            <label htmlFor="language">Language:</label>
            <select name="language" id="lang" value={lang} onChange={handleLanguage}>
              {(mode == "default") && <option value="javascript">Javascript</option>}
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="mode">
            <label htmlFor="mode">Mode:</label>
            <select name="mode" id="mode" value={mode} onChange={handleMode}>
              <option value="default">Default</option>
              <option value="competitive">Competitive</option>
            </select>
          </div>
        </div>
      </div>
      <div className="code-editor">
        <div className="project-name">{projectName}</div>
        <div className="run-code">
          <button className='run-button' onClick={execute}>Run code</button>
        </div>
        <div className="codespace">
          <div className="code-input" ref={editorContainerRef}>
            <div className="text-editor">
              <Editor
                height={getHeight(mode)}
                language={lang}
                value={projectContent ? projectContent.content : ""}
                theme='vs-dark'
                onMount={handleEditorDidMount}
                onChange={handleChange}
                options={{
                  fontSize: 20
                }}
              />
            </div>
            {(mode === "competitive") && (<div className='input-field'>
              <textarea name="" id="" placeholder='Input field' ref={inputRef}></textarea>
            </div>)}
          </div>
          <div className="display">
            <div className="code-display">
              {codeDisplay ? codeDisplay.join('') : []}
            </div>
            <div className="error-display">
              {errorDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
