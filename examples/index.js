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
  onChange(newValue, e) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(newValue, e);
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
            onChange={::this.onChange}
            onDidMount={::this.onDidMount}
        />
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
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
      this.editor.setValue('// code changed!');
    }
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
          <SampleEditor
              width="800"
              height="600"
              language="javascript"
              value={initialCode}
              options={options}
              onChange={::this.onChange}
              onDidMount={::this.onDidMount}
          />
          <div onClick={::this.changeEditorValue}>change editor value</div>
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
);
