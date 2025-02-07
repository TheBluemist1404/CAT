import './code-editor.scss'

import Editor from "@monaco-editor/react";
import axios from 'axios';
import { useRef } from "react";

function CodeEditor () {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const execute = async () => {
    const code = editorRef.current.getValue();
    const response = await axios.post('http://localhost:3000/execute', {code: code})
    console.log(response.data)
  }

  return (
    <div className="code-editor">
      <button onClick={execute}>Run code</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        options={{
          fontSize: 20
        }}
      />
    </div>
  );
}

export default CodeEditor;
