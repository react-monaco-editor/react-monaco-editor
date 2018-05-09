import * as React from "react";
import * as monacoEditor from "monaco-editor";

export type ChangeHandler = (
  value: string,
  event: monacoEditor.editor.IModelContentChangedEvent
) => void;

export type EditorDidMount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor
) => void;

export type EditorWillMount = (monaco: typeof monacoEditor) => void;

declare interface MonacoEditorProps {
  width?: string | number;
  height?: string | number;
  value?: string | null;
  defaultValue?: string;
  language?: string;
  theme?: string | null;
  options?: monacoEditor.editor.IEditorConstructionOptions;
  editorDidMount?: EditorDidMount;
  editorWillMount?: EditorWillMount;
  onChange?: ChangeHandler;
}

declare class MonacoEditor extends React.Component<MonacoEditorProps> {}

// ============ Diff Editor ============

export type DiffEditorDidMount = (
  editor: monacoEditor.editor.IStandaloneDiffEditor,
  monaco: typeof monacoEditor
) => void;

export type DiffEditorWillMount = (monaco: typeof monacoEditor) => void;

export type DiffChangeHandler = (value: string) => void;

declare interface MonacoDiffEditorProps {
  width?: string | number;
  height?: string | number;
  original?: string;
  value?: string;
  defaultValue?: string;
  language?: string;
  theme?: string;
  options?: monacoEditor.editor.IDiffEditorConstructionOptions;
  editorDidMount?: DiffEditorDidMount;
  editorWillMount?: DiffEditorWillMount;
  onChange?: DiffChangeHandler;
}

declare class MonacoDiffEditor extends React.Component<MonacoDiffEditorProps> {}

export {
  MonacoEditor as default,
  MonacoEditorProps,
  MonacoDiffEditor,
  MonacoDiffEditorProps
};
