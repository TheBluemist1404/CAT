import './code-editor.scss'

import Editor from "@monaco-editor/react";
import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

import logo from '@code-editor-assets/logo.svg'

function CodeEditor() {
  const navigate = useNavigate()
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const [projectName, setProjectName] = useState("Project")
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const execute = async () => {
    try {
      setCodeDisplay([])
      setErrorDisplay("")
      const code = editorRef.current.getValue()
      const input = inputRef.current ? inputRef.current.value: ""
      const response = await axios.post('http://localhost:3000/execute', { code: code, input: input, language: lang })
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
  useEffect(()=>{
    setLang(defaultLang[String(mode)])
  },[mode])

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

  return (
    <div className="live-code">
      <div className="sidebar">
        <div className='logo'>
          <img src={logo} alt="logo" onClick={() => { navigate('/') }} />
          <div className='language'>
            <label htmlFor="language">Language:</label>
            <select name="language" id="lang" value={lang} onChange={handleLanguage}>
              {(mode=="default") && <option value="javascript">Javascript</option>}
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
                theme='vs-dark'
                onMount={handleEditorDidMount}
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
