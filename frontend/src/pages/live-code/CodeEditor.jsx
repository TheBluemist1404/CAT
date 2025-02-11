import './code-editor.scss'

import Editor from "@monaco-editor/react";
import axios from 'axios';
import { useRef, useState } from "react";

function CodeEditor() {
  const editorRef = useRef(null);
  const [codeDisplay, setCodeDisplay] = useState([])
  const [errorDisplay, setErrorDisplay] = useState("")

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const execute = async () => {
    try {
      setCodeDisplay([])
      setErrorDisplay("")
      const code = editorRef.current.getValue();
      const response = await axios.post('http://localhost:3000/execute', { code: code, language: lang })
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

  const [lang, setLang] = useState("javascript"); // Default language is JavaScript

  const handleLanguage = (event) => {
    event.preventDefault(); // ✅ Prevent form reload

    const selectedLang = event.target.value; // ✅ Get selected value
    setLang(selectedLang); // ✅ Update state

    console.log("Selected Language:", selectedLang); // ✅ Debugging log
  };

  return (
    <div className="code-editor">
      <div className="run-code">
        <button className='run-button' onClick={execute}>Run code</button>
        <div style={{padding: '10px'}}>
          <label htmlFor="language">Language:</label>
          <select name="language" id="lang" value={lang} onChange={handleLanguage}>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <div className="codespace">
        <div className="text-editor">
          <Editor
            height="100%"
            language={lang}
            // defaultValue="// some comment"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 20
            }}
          />
        </div>
        <div className="display">
          <div className="code-display">
            {codeDisplay ? codeDisplay.join('\n') : []}
          </div>
          <div className="error-display">
            {errorDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
