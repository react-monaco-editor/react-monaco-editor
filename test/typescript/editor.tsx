import * as React from "react";
import MonacoEditor from "../..";

type AppState = {
  code: string;
};

class App extends React.Component<{}, AppState> {
  state = {
    code: "// type your code..."
  };

  editorDidMount = (editor: any, monaco: any) => {
    console.log("editorDidMount", editor);
    editor.focus();
  };

  onChange = (newValue: string, e: any) => {
    console.log("onChange", newValue, e);
  };

  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
