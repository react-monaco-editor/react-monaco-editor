import * as React from "react";
import MonacoEditor, {
  EditorDidMount,
  ChangeHandler,
  EditorWillMount
} from "../..";

type AppState = {
  code: string;
};

class App extends React.Component<{}, AppState> {
  state = {
    code: "// type your code..."
  };

  editorWillMount: EditorWillMount = monaco => {
    console.log("editorWillMount", monaco);
  };

  editorDidMount: EditorDidMount = (editor, monaco) => {
    console.log("editorDidMount", editor);
    editor.focus();
  };

  onChange: ChangeHandler = (newValue, e) => {
    console.log("onChange", newValue, e);
  };

  render() {
    const { code } = this.state;

    return (
      <MonacoEditor
        width={800}
        height={600}
        language="javascript"
        theme="vs-dark"
        value={code}
        options={{ selectOnLineNumbers: true }}
        onChange={this.onChange}
        editorWillMount={this.editorWillMount}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
