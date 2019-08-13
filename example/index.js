import React from "react";
import { render } from "react-dom";
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";

class CodeEditor extends React.Component {
  state = {
    code: "// type your code... \n",
    theme: "vs-light"
  };

  onChange = newValue => {
    console.log("onChange", newValue); // eslint-disable-line no-console
  };

  editorDidMount = editor => {
    // eslint-disable-next-line no-console
    console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  };

  changeEditorValue = () => {
    if (this.editor) {
      this.editor.setValue("// code changed! \n");
    }
  };

  changeBySetState = () => {
    this.setState({ code: "// code changed by setState! \n" });
  };

  setDarkTheme = () => {
    this.setState({ theme: "vs-dark" });
  };

  setLightTheme = () => {
    this.setState({ theme: "vs-light" });
  };

  render() {
    const { code, theme } = this.state;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      automaticLayout: false
    };
    return (
      <div>
        <div>
          <button onClick={this.changeEditorValue} type="button">
            Change value
          </button>
          <button onClick={this.changeBySetState} type="button">
            Change by setState
          </button>
          <button onClick={this.setDarkTheme} type="button">
            Set dark theme
          </button>
          <button onClick={this.setLightTheme} type="button">
            Set light theme
          </button>
        </div>
        <hr />
        <MonacoEditor
          height="400"
          language="javascript"
          value={code}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          theme={theme}
        />
      </div>
    );
  }
}

class AnotherEditor extends React.Component {
  state = {
    code: ["{", '    "$schema": "http://myserver/foo-schema.json"', "}"].join(
      "\n"
    )
  };

  editorWillMount = monaco => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://myserver/foo-schema.json",
          schema: {
            type: "object",
            properties: {
              p1: {
                enum: ["v1", "v2"]
              },
              p2: {
                $ref: "http://myserver/bar-schema.json"
              }
            }
          }
        },
        {
          uri: "http://myserver/bar-schema.json",
          schema: {
            type: "object",
            properties: {
              q1: {
                enum: ["x1", "x2"]
              }
            }
          }
        }
      ]
    });
  };

  render() {
    const { code } = this.state;
    return (
      <div>
        <MonacoEditor
          width="800"
          height="300"
          language="json"
          defaultValue={code}
          editorWillMount={this.editorWillMount}
        />
      </div>
    );
  }
}

class DiffEditor extends React.Component {
  state = {
    code: 'const a = "Hello Monaco"',
    original: 'const a = "Hello World"'
  };

  onChange = newValue => {
    console.log("onChange", newValue); // eslint-disable-line no-console
  };

  render() {
    const { code, original } = this.state;
    return (
      <div>
        <MonacoDiffEditor
          width="800"
          height="300"
          language="javascript"
          value={code}
          original={original}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const App = () => (
  <div>
    <h2>Monaco Editor Sample (controlled mode)</h2>
    <CodeEditor />
    <hr />
    <h2>Another editor (uncontrolled mode)</h2>
    <AnotherEditor />
    <hr />
    <h2>Another editor (showing a diff)</h2>
    <DiffEditor />
  </div>
);

render(<App />, document.getElementById("root"));
