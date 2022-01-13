import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as PropTypes from "prop-types";
import * as React from "react";
import { MonacoDiffEditorProps } from "./types";
import { noop, processSize } from "./utils";

class MonacoDiffEditor extends React.Component<MonacoDiffEditorProps> {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    original: PropTypes.string,
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
    original: null,
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

  editor?: monaco.editor.IStandaloneDiffEditor;

  private containerElement?: HTMLDivElement;

  private _subscription: monaco.IDisposable;

  private __prevent_trigger_change_event?: boolean;

  constructor(props: MonacoDiffEditorProps) {
    super(props);
    this.containerElement = undefined;
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentDidUpdate(prevProps: MonacoDiffEditorProps) {
    const { language, theme, height, options, width, className } = this.props;

    const { original, modified } = this.editor.getModel();

    if (this.props.original !== original.getValue()) {
      original.setValue(this.props.original);
    }

    if (this.props.value != null && this.props.value !== modified.getValue()) {
      this.__prevent_trigger_change_event = true;
      // modifiedEditor is not in the public API for diff editors
      this.editor.getModifiedEditor().pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      // @ts-expect-error
      modified.pushEditOperations(
        [],
        [
          {
            range: modified.getFullModelRange(),
            text: this.props.value,
          },
        ]
      );
      // modifiedEditor is not in the public API for diff editors
      this.editor.getModifiedEditor().pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }

    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(original, language);
      monaco.editor.setModelLanguage(modified, language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (
      this.editor &&
      (width !== prevProps.width || height !== prevProps.height)
    ) {
      this.editor.layout();
    }
    if (prevProps.options !== options) {
      this.editor.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...options,
      });
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = (component: HTMLDivElement) => {
    this.containerElement = component;
  };

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    return options || {};
  }

  editorDidMount(editor: monaco.editor.IStandaloneDiffEditor) {
    this.props.editorDidMount(editor, monaco);

    const { modified } = editor.getModel();
    this._subscription = modified.onDidChangeContent((event) => {
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(modified.getValue(), event);
      }
    });
  }

  editorWillUnmount(editor: monaco.editor.IStandaloneDiffEditor) {
    const { editorWillUnmount } = this.props;
    editorWillUnmount(editor, monaco);
  }

  initModels(value: string, original: string) {
    const { language } = this.props;
    const originalModel = monaco.editor.createModel(original, language);
    const modifiedModel = monaco.editor.createModel(value, language);
    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }

  initMonaco() {
    const value =
      this.props.value != null ? this.props.value : this.props.defaultValue;
    const { original, theme, options, overrideServices, className } =
      this.props;
    if (this.containerElement) {
      // Before initializing monaco editor
      this.editorWillMount();
      this.editor = monaco.editor.createDiffEditor(
        this.containerElement,
        {
          ...(className ? { extraEditorClassName: className } : {}),
          ...options,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      );
      // After initializing monaco editor
      this.initModels(value, original);
      this.editorDidMount(this.editor);
    }
  }

  destroyMonaco() {
    if (this.editor) {
      this.editorWillUnmount(this.editor);
      this.editor.dispose();
      const { original, modified } = this.editor.getModel();
      if (original) {
        original.dispose();
      }
      if (modified) {
        modified.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
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

export default MonacoDiffEditor;
