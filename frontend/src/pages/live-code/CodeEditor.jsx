import './code-editor.scss'

import Editor from "@monaco-editor/react";
import { useRef } from "react";

function CodeEditor () {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }

  return (
    <div className="code-editor">
      <button onClick={showValue}>code editor</button>
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
