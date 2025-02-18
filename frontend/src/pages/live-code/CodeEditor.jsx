import './code-editor.scss'

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { Awareness } from "y-protocols/awareness";
import Editor from "@monaco-editor/react";

import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

import logo from '@code-editor-assets/logo.svg'

function getRandomColor() {
  // Generate a random color only once per client.
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const clientColor = getRandomColor(); // Static color for this client


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
  // Create a Yjs document and keep it in a ref so it persists.
  const ydoc = useRef(new Y.Doc());
  const provider = useRef(null);
  const ytext = ydoc.current.getText("monaco"); // Shared Yjs text model

  // Create awareness instance (using Yjs document)
  const awareness = new Awareness(ydoc.current);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]); // to track remote decorations

  useEffect(() => {
    // Initialize the WebRTC provider with awareness
    provider.current = new WebrtcProvider("my-room-name", ydoc.current, { awareness });

    return () => {
      provider.current.destroy();
      ydoc.current.destroy();
    };
  }, []);

  async function handleEditorDidMount(editor) {
    editorRef.current = editor;
    const { MonacoBinding } = await import("y-monaco");
    // Bind Yjs text syncing to Monaco editor model
    new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);

    // Here we store a relative position that initially points to index 0.
    const initialRelPos = Y.createRelativePositionFromTypeIndex(ytext, 0);
    awareness.setLocalStateField("cursor", { relPos: initialRelPos, color: clientColor });

    awareness.setLocalStateField("selection", {
      relPosStart: initialRelPos,
      relPosEnd: initialRelPos
    })

    // Listen to local cursor changes
    editor.onDidChangeCursorPosition((event) => {
      console.log("Local cursor change!");
      const position = event.position;
      const model = editor.getModel();
      // Convert Monaco position to document offset.
      const index = model.getOffsetAt(position);
      const relPos = Y.createRelativePositionFromTypeIndex(ytext, index);
      // Update the local awareness state with the new relative position.
      awareness.setLocalStateField("cursor", { relPos, color: clientColor });
    });

    editor.onDidChangeCursorSelection((event)=> {
      const model = editor.getModel();
      const selection = event.selection;
      // Convert the selection range to offsets.
      const startOffset = model.getOffsetAt(selection.getStartPosition());
      const endOffset = model.getOffsetAt(selection.getEndPosition());
      const relPosStart = Y.createRelativePositionFromTypeIndex(ytext, startOffset);
      const relPosEnd = Y.createRelativePositionFromTypeIndex(ytext, endOffset);
      // Update awareness with the selection data.
      awareness.setLocalStateField("selection", {
        relPosStart,
        relPosEnd,
        color: clientColor  // Optionally use a color for selection (or different from the cursor color)
      });
    })

    // Listen for remote awareness changes to update remote cursor decorations.
    awareness.on("change", () => {
      console.log("Remote awareness change - updating cursor decorations.");
      updateCursorDecorations(editor);
      updateSelectionDecorations(editor);
    });
  }

  function updateCursorDecorations(editor) {
    const decorations = [];
    // Loop through all remote awareness states.
    awareness.getStates().forEach((state, clientId) => {
      // Skip our own state.
      if (clientId === awareness.clientID) return;
      if (state.cursor && state.cursor.relPos) {
        // Convert the relative position back into an absolute position in our document.
        const absolutePos = Y.createAbsolutePositionFromRelativePosition(state.cursor.relPos, ydoc.current);
        if (absolutePos && absolutePos.type === ytext) {
          const model = editor.getModel();
          // Convert the document offset (absolute position index) back to a Monaco position.
          const position = model.getPositionAt(absolutePos.index);

          const remoteColor = state.cursor.color || "red"
          const className = "remoteCursor-" + remoteColor.replace("#", "");
          addDynamicCursorStyle(className, remoteColor);
          decorations.push({
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            options: {
              className: className,
              isWholeLine: false,
              overviewRuler: {
                color: remoteColor,
                position: monaco.editor.OverviewRulerLane.Right,
              },
            },
          });
        }
      }
    });
    // Update decorations (pass the previous decorations for proper cleanup)
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
  }

  // Helper function to inject a CSS rule if it doesn't exist yet.
  function addDynamicCursorStyle(className, color) {
    // Check if the style for this class already exists.
    if (!document.getElementById(className)) {
      const style = document.createElement("style");
      style.id = className;
      style.innerHTML = `
      .${className} {
        border-left: 2px solid ${color};
        margin-left: -1px; /* Adjust so the marker is visible */
        height: 100%;
      }
    `;
      document.head.appendChild(style);
    }
  }

  const selectionDecorationsRef = useRef([]);

  function updateSelectionDecorations(editor) {
    const decorations = [];
    // Loop through all remote awareness states.
    awareness.getStates().forEach((state, clientId) => {
      // Skip our own state.
      if (clientId === awareness.clientID) return;
      if (state.selection && state.selection.relPosStart && state.selection.relPosEnd) {
        // Convert the relative position back into an absolute position in our document.
        const absStart = Y.createAbsolutePositionFromRelativePosition(state.selection.relPosStart, ydoc.current);
        const absEnd = Y.createAbsolutePositionFromRelativePosition(state.selection.relPosEnd, ydoc.current);

        if (absStart && absEnd && absStart.type === ytext && absEnd.type === ytext) {
          const model = editor.getModel();
          const startPos = model.getPositionAt(absStart.index);
          const endPos = model.getPositionAt(absEnd.index);

          const remoteColor = state.selection.color || "red"
          const className = "remoteSelection-" + remoteColor.replace("#", "");
          addDynamicSelectionStyle(className, remoteColor);
          decorations.push({
            range: new monaco.Range(
              startPos.lineNumber,
              startPos.column,
              endPos.lineNumber,
              endPos.column
            ),
            options: {
              className: className,
              isWholeLine: false,
              overviewRuler: {
                color: remoteColor,
                position: monaco.editor.OverviewRulerLane.Right,
              },
            },
          });
        }
      }
    });
    // Update decorations (pass the previous decorations for proper cleanup)
    selectionDecorationsRef.current = editor.deltaDecorations(selectionDecorationsRef.current, decorations);
  }

  // Helper function to inject a CSS rule if it doesn't exist yet.
  function addDynamicSelectionStyle(className, color) {
    // Check if the style for this class already exists.
    if (!document.getElementById(className)) {
      const style = document.createElement("style");
      style.id = className;
      style.innerHTML = `
      .${className} {
        background-color: ${color};
        opacity: 0.3;
      }
    `;
      document.head.appendChild(style);
    }
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
