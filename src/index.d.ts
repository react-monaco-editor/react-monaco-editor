import * as React from "react";
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

export type ChangeHandler = (
  value: string,
  event: monacoEditor.editor.IModelContentChangedEvent
) => void;

export type EditorDidMount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor
) => void;

/**
 * @remarks
 * This will be `IStandaloneEditorConstructionOptions` in newer versions of monaco-editor, or
 * `IEditorConstructionOptions` in versions before that was introduced.
 */
export type EditorConstructionOptions = NonNullable<Parameters<typeof monacoEditor.editor.create>[1]>;

export type EditorWillMount = (monaco: typeof monacoEditor) => void | EditorConstructionOptions;
                                                  
declare interface MonacoEditorBaseProps {
  /**
   * Width of editor. Defaults to 100%.
   */
  width?: string | number;

  /**
   * Height of editor. Defaults to 500.
   */
  height?: string | number;

  /**
   * The initial value of the auto created model in the editor.
   */
  defaultValue?: string;

  /**
   * The initial language of the auto created model in the editor. Defaults to 'javascript'.
   */
  language?: string;

  /**
   * Theme to be used for rendering.
   * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
   * You can create custom themes via `monaco.editor.defineTheme`.
   */
  theme?: string | null;

  /**
   * Optional, allow to pass a different context then the global window onto which the monaco instance will be loaded. Useful if you want to load the editor in an iframe.
   */
  context?: any;
}

export interface MonacoEditorProps extends MonacoEditorBaseProps {
  /**
   * Value of the auto created model in the editor.
   * If you specify `null` or `undefined` for this property, the component behaves in uncontrolled mode.
   * Otherwise, it behaves in controlled mode.
   */
  value?: string | null;

  /**
   * Refer to Monaco interface {monaco.editor.IEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IEditorConstructionOptions;


  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;

  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  editorDidMount?: EditorDidMount;

  /**
   * An event emitted before the editor mounted (similar to componentWillMount of React).
   */
  editorWillMount?: EditorWillMount;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: ChangeHandler;
}

export default class MonacoEditor extends React.Component<MonacoEditorProps> {
  editor?: monacoEditor.editor.IStandaloneCodeEditor;
}

// ============ Diff Editor ============

export type DiffEditorDidMount = (
  editor: monacoEditor.editor.IStandaloneDiffEditor,
  monaco: typeof monacoEditor
) => void;

export type DiffEditorWillMount = (monaco: typeof monacoEditor) => void;

export type DiffChangeHandler = ChangeHandler;

export interface MonacoDiffEditorProps extends MonacoEditorBaseProps {
  /**
   * The original value to compare against.
   */
  original?: string;

  /**
   * Value of the auto created model in the editor.
   * If you specify value property, the component behaves in controlled mode. Otherwise, it behaves in uncontrolled mode.
   */
  value?: string;

  /**
   * Refer to Monaco interface {monaco.editor.IDiffEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IDiffEditorConstructionOptions;

  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;

  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  editorDidMount?: DiffEditorDidMount;

  /**
   * An event emitted before the editor mounted (similar to componentWillMount of React).
   */
  editorWillMount?: DiffEditorWillMount;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: DiffChangeHandler;
}

export class MonacoDiffEditor extends React.Component<MonacoDiffEditorProps> {
  editor?: monacoEditor.editor.IStandaloneDiffEditor;
}
