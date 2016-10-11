import React, { PropTypes } from 'react'

function noop() {}

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.__current_value = props.value;
  }
  componentDidMount() {
    this.afterViewInit();
  }
  componentWillUnmount() {
    this.destroyMonaco();
  }
  componentWillUpdate(nextProps) {
    if (nextProps.value !== this.__current_value) {
      this.__prevent_trigger_change_event = true;
      this.editor.setValue(nextProps.value);
      this.__prevent_trigger_change_event = false;
    }
  }
  editorWillMount(monaco) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }
  onDidMount(editor, monaco) {
    const { onDidMount, onChange } = this.props;
    onDidMount(editor, monaco);
    editor.onDidChangeModelContent(event => {
      const value = editor.getValue();
      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        onChange(value, event);
      }
      // Always refer to the latest value
      this.__current_value = value;
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
        if (loaderCallbacks && loaderCallbacks.length) {
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
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, theme, options } = this.props;
    const containerElement = this.refs.container;
    if (typeof monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(monaco);
      this.editor = monaco.editor.create(containerElement, {
        value,
        language,
        theme,
        ...options,
      });
      // After initializing monaco editor
      this.onDidMount(this.editor, monaco);
    }
  }
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }
  render() {
    const { width, height } = this.props;
    const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
    const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
    const style = {
      width: fixedWidth,
      height: fixedHeight,
    };
    return (
      <div ref="container" style={style} className="react-monaco-editor-container"></div>
    )
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  onDidMount: PropTypes.func,
  editorWillMount: PropTypes.func,
  onChange: PropTypes.func,
  requireConfig: PropTypes.object,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: 'vs',
  options: {},
  onDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: {},
};

export default MonacoEditor;
