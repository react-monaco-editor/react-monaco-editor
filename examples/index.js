import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

class SampleEditor extends React.Component {
  onDidMount(editor) {
    const { onDidMount } = this.props;
    if (onDidMount) {
      onDidMount(editor);
    }
  }
  render() {
    const { width, height, language, value, options } = this.props;
    const finalProps = {
      width,
      height,
      language,
      value,
      options,
    };

    return (
        <MonacoEditor
            {...finalProps}
            onDidMount={::this.onDidMount}
        />
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '// type your code...'
    }
  }
  onDidMount(editor) {
    console.log('onDidMount', editor, editor.model, editor.model.getValue(), editor.getModel());
    editor.onDidChangeModelContent((e) => {
      console.log(777, e);
    });
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      theme: 'vs',
      cursorStyle: 'line',
      automaticLayout: false,
    }
    return (
        <div>
          <SampleEditor
              width="800"
              height="600"
              language="javascript"
              value={code}
              options={options}
              onDidMount={::this.onDidMount}
          />
          <hr />
          <h2>Another editor</h2>
          <SampleEditor />
        </div>
    );
  }
}

render(
    <App />,
    document.getElementById('root')
)
