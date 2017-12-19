import React from 'react';
import PropTypes from 'prop-types';


function noop() { }


class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.__current_value = props.value;
  }

  componentDidMount() {
    this.afterViewInit();
  }

  componentDidUpdate(prevProps) {
    const context = this.props.context || window;
    if (this.props.value !== this.__current_value) {
      // Always refer to the latest value
      this.__current_value = this.props.value;
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true;
        this.editor.setValue(this.__current_value);
        this.__prevent_trigger_change_event = false;
      }
    }
    if (prevProps.language !== this.props.language) {
      context.monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
    }
    if (prevProps.theme !== this.props.theme) {
      context.monaco.editor.setTheme(this.props.theme);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  editorWillMount(monaco) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor, monaco) {
    this.props.editorDidMount(editor, monaco);
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue();

      // Always refer to the latest value
      this.__current_value = value;

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event);
      }
    });
  }

  afterViewInit = () => {
    const context = this.props.context || window;
    if (context.monaco !== undefined) {
      this.initMonaco();
      return;
    }
    const { requireConfig } = this.props;

    // Checking that the process is a renderer may be overly specific
    const inElectron = context.process && context.process.type === 'renderer';

    let loaderUrl = requireConfig.url || 'vs/loader.js';

    if (inElectron) {
      // Running in electron, need to deal with the difference between node require and AMDRequire
      // Save a reference to node's require to set back up later
      context.electronNodeRequire = context.require;
      loaderUrl = requireConfig.url || '../node_modules/monaco-editor/min/vs/loader.js'
    }

    const onGotAmdLoader = () => {
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (inElectron) {
          // Have just loaded loader.js and now context.require is not node's require
          let amdRequireBaseUrl = requireConfig.baseUrl;

          if (!amdRequireBaseUrl) {
            const path = context.electronNodeRequire('path');
            const monacoPath = path.join(context.__dirname, '../node_modules/monaco-editor/min');

            amdRequireBaseUrl = path.resolve(monacoPath).replace(/\\/g, '/');
            if (amdRequireBaseUrl.length > 0 && amdRequireBaseUrl.charAt(0) !== '/') {
              amdRequireBaseUrl = `/${amdRequireBaseUrl}`;
            }
            amdRequireBaseUrl = encodeURI(`file://${amdRequireBaseUrl}`);
          }

          context.require.config({
            baseUrl: amdRequireBaseUrl
          });

          context.window.module = undefined;
          // workaround monaco-typescript not understanding the environment
          context.window.process.browser = true;
        }

        if (requireConfig.paths && requireConfig.paths.vs && !inElectron) {
          // will need to switch to nodeRequire here
          context.require.config(requireConfig);
        }
      }

      // Load monaco
      context.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        const loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;

        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();

          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    }

    // Load AMD loader if necessary
    if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading
      // concurrently, delay to call callbacks except the first one
      // eslint-disable-next-line max-len
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else if (typeof context.require === 'undefined' || inElectron) {
      const loaderScript = context.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onGotAmdLoader);
      context.document.body.appendChild(loaderScript);
      context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
    } else {
      onGotAmdLoader();
    }
  }

  initMonaco() {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { language, theme, options } = this.props;
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);
      this.editor = context.monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options,
      });
      if (theme) {
        context.monaco.editor.setTheme(theme)
      }
      // After initializing monaco editor
      this.editorDidMount(this.editor, context.monaco);
    }
  }

  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }

  assignRef = (component) => {
    this.containerElement = component;
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
      <div ref={this.assignRef} style={style} className="react-monaco-editor-container" />
    )
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  editorDidMount: PropTypes.func,
  editorWillMount: PropTypes.func,
  onChange: PropTypes.func,
  requireConfig: PropTypes.object,
  context: PropTypes.object // eslint-disable-line react/require-default-props
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: {},
};

export default MonacoEditor;
