import * as React from "react";
import {
  MonacoDiffEditor,
  DiffEditorDidMount,
  DiffChangeHandler,
  DiffEditorWillMount
} from "../..";

type AppState = {
  original: string;
  code: string;
};

class App extends React.Component<{}, AppState> {
  state = {
    original: "// original code",
    code: "// new code"
  };

  editorWillMount: DiffEditorWillMount = monaco => {
    console.log("editorWillMount", monaco);
  };

  editorDidMount: DiffEditorDidMount = (editor, monaco) => {
    console.log("editorDidMount", editor);
    editor.focus();
  };

  onChange: DiffChangeHandler = newValue => {
    console.log("onChange", newValue);
  };

  render() {
    const { original, code } = this.state;

    return (
      <MonacoDiffEditor
        width={800}
        height={600}
        language="javascript"
        theme="vs-dark"
        original={original}
        value={code}
        options={{ renderSideBySide: true }}
        onChange={this.onChange}
        editorWillMount={this.editorWillMount}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
