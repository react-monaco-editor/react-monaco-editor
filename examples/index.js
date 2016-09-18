import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

// wrapper
class SampleEditor extends React.Component {
  onDidMount(editor) {
    const { onDidMount } = this.props;
    if (onDidMount) {
      onDidMount(editor);
    }
  }
  onChange(newValue, e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(newValue, e);
    }
  }
  render() {
    const { width, height, language, value, requireConfig, options } = this.props;
    const finalProps = {
      width,
      height,
      language,
      value,
      requireConfig,
      options,
    };
    return (
        <MonacoEditor
            {...finalProps}
            onChange={::this.onChange}
            onDidMount={::this.onDidMount}
        />
    );
  }
}

// Using with webpack
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code... \n',
    }
  }
  onDidMount(editor) {
    console.log('onDidMount', editor, editor.model, editor.getValue(), editor.getModel());
    this.editor = editor;
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  changeEditorValue() {
    if (this.editor) {
      this.editor.setValue('// code changed! \n');
    }
  }
  changeBySetState() {
    this.setState({code: '// code changed by setState! \n'});
  }
  render() {
    const initialCode = this.state.code;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      theme: 'vs',
      cursorStyle: 'line',
      automaticLayout: false,
    };
    return (
        <div>
          <div>
            <button onClick={::this.changeEditorValue}>Change value</button>
            <button onClick={::this.changeBySetState}>Change by setState</button>
          </div>
          <hr />
          <SampleEditor
              width="800"
              height="600"
              language="javascript"
              value={initialCode}
              options={options}
              onChange={::this.onChange}
              onDidMount={::this.onDidMount}
          />
        </div>
    );
  }
}

// Using with require.config
class AnotherEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }
  render() {
    const initialCode = this.state.code;
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        'vs': 'https://as.alipayobjects.com/g/cicada/monaco-editor-mirror/0.6.1/min/vs'
      }
    };
    return (
        <div>
          <SampleEditor
              width="800"
              height="600"
              language="javascript"
              value={initialCode}
              requireConfig={requireConfig}
          />
        </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
        <div>
          <CodeEditor />
          <hr />
          <h2>Another editor</h2>
          <AnotherEditor />
        </div>
    );
  }
}

render(
    <App />,
    document.getElementById('root')
);
