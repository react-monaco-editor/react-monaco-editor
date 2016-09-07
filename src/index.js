import React, { PropTypes } from 'react'

function noop() {
}

class MonacoEditor extends React.Component {
  componentDidMount() {
    this.afterViewInit();
  }
  componentWillUnmount() {
    this.destroyMonaco();
  }
  onDidMount() {
    const { onDidMount, onChange } = this.props;
    const editor = this.editor;

    onDidMount(editor);
    editor.onDidChangeModelContent(event => {
      onChange(editor.getValue(), event);
    });
  }
  afterViewInit() {
    var onGotAmdLoader = () => {
      // Load monaco
      window.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };
    // Load AMD loader if necessary
    if (typeof window.require === 'undefined') {
      var loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
  initMonaco() {
    const { value, language, theme, options } = this.props;
    const containerElement = this.refs.container;
    if (typeof monaco !== 'undefined') {
      this.editor = monaco.editor.create(containerElement, {
        value,
        language,
        theme,
        ...options,
      });
      // After monaco editor has been initialized
      this.onDidMount();
    }
  }
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }
  render() {
    const { width, height } = this.props;
    return (
      <div ref="container" style={{ width, height }} className="react-monaco-editor-container"></div>
    )
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  value: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  onDidMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '500',
  value: '',
  language: 'javascript',
  theme: 'vs-dark',
  onDidMount: noop,
  onChange: noop,
};

export default MonacoEditor;
