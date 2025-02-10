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
      const response = await axios.post('http://localhost:3000/execute', { code: code })
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

  return (
    <div className="code-editor">
      <button className='run-code' onClick={execute}>Run code</button>
      <div className="codespace">
        <div className="text-editor">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 20
            }}
          />
        </div>
        <div className="display">
          <div className="code-display">
            {codeDisplay ? codeDisplay.join('\n'): []}
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
