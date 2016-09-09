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
    const { requireConfig } = this.props;
    const loaderUrl = requireConfig.url || 'vs/loader.js';
    const onGotAmdLoader = () => {
      if (window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (requireConfig.paths && requireConfig.paths.vs) {
          window.require.config(requireConfig);
        }
      }
      
      // Load monaco
      window.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        let loaderCallbacks = window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;

        if (loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();
          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    };
    
    // Load AMD loader if necessary
    if (window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else {
      if (typeof window.require === 'undefined') {
        var loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = loaderUrl;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
        window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
      } else {
        onGotAmdLoader();
      }
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
  requireConfig: PropTypes.object,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '500',
  value: '',
  language: 'javascript',
  theme: 'vs',
  onDidMount: noop,
  onChange: noop,
  requireConfig: {},
};

export default MonacoEditor;
