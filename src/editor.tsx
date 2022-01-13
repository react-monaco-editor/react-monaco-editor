import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as PropTypes from "prop-types";
import * as React from "react";
import { MonacoEditorProps } from "./types";
import { noop, processSize } from "./utils";

class MonacoEditor extends React.Component<MonacoEditorProps> {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    language: PropTypes.string,
    theme: PropTypes.string,
    options: PropTypes.object,
    overrideServices: PropTypes.object,
    editorWillMount: PropTypes.func,
    editorDidMount: PropTypes.func,
    editorWillUnmount: PropTypes.func,
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    width: "100%",
    height: "100%",
    value: null,
    defaultValue: "",
    language: "javascript",
    theme: null,
    options: {},
    overrideServices: {},
    editorWillMount: noop,
    editorDidMount: noop,
    editorWillUnmount: noop,
    onChange: noop,
    className: null,
  };

  editor?: monaco.editor.IStandaloneCodeEditor;

  private containerElement?: HTMLDivElement;

  private _subscription: monaco.IDisposable;

  private __prevent_trigger_change_event?: boolean;

  constructor(props: MonacoEditorProps) {
    super(props);
    this.containerElement = undefined;
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentDidUpdate(prevProps: MonacoEditorProps) {
    const { value, language, theme, height, options, width, className } =
      this.props;

    const { editor } = this;
    const model = editor.getModel();

    if (this.props.value != null && this.props.value !== model.getValue()) {
      this.__prevent_trigger_change_event = true;
      this.editor.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      // @ts-expect-error
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ]
      );
      this.editor.pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }
    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(model, language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (editor && (width !== prevProps.width || height !== prevProps.height)) {
      editor.layout();
    }
    if (prevProps.options !== options) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      const { model: _model, ...optionsWithoutModel } = options;
      editor.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
      });
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = (component: HTMLDivElement) => {
    this.containerElement = component;
  };

  destroyMonaco() {
    if (this.editor) {
      this.editorWillUnmount(this.editor);
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  initMonaco() {
    const value =
      this.props.value != null ? this.props.value : this.props.defaultValue;
    const { language, theme, overrideServices, className } = this.props;
    if (this.containerElement) {
      // Before initializing monaco editor
      const options = { ...this.props.options, ...this.editorWillMount() };
      this.editor = monaco.editor.create(
        this.containerElement,
        {
          value,
          language,
          ...(className ? { extraEditorClassName: className } : {}),
          ...options,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      );
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    return options || {};
  }

  editorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    this.props.editorDidMount(editor, monaco);

    this._subscription = editor.onDidChangeModelContent((event) => {
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(editor.getValue(), event);
      }
    });
  }

  editorWillUnmount(editor: monaco.editor.IStandaloneCodeEditor) {
    const { editorWillUnmount } = this.props;
    editorWillUnmount(editor, monaco);
  }

  render() {
    const { width, height } = this.props;
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    const style = {
      width: fixedWidth,
      height: fixedHeight,
    };

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}

export default MonacoEditor;
