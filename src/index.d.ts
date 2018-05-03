import React from 'react';
import * as monacoEditor from 'monaco-editor';

declare class MonacoEditor extends React.Component<MonacoEditorProps> {
  constructor(props: Partial<MonacoEditorProps>);

  componentDidMount(): void;
  componentDidUpdate(prevProps: Partial<MonacoEditorProps>): void;
  componentWillUnmount(): void;

  editorDidMount(editor: monacoEditor.editor.IEditor, monaco: typeof monacoEditor): void;
  editorWillMount(monaco: any): void;

  afterViewInit(): void;
  initMonaco(): void;
  destroyMonaco(): void;

  render(): React.DOMElement<any, any>;

  updateModel(value: string | null, original: string | null): void;
}

declare interface MonacoEditorProps {
  width: string | number;
  height: string | number;
  value: string | null;
  defaultValue: string;
  language: string;
  theme: string | null;
  options: object;
  editorDidMount: (editor, monaco) => void;
  editorWillMount: (monaco) => void;
  onChange: (value, event) => void;
  requireConfig: object;
  context: object;
}

declare interface MonacoDiffEditorProps {
  width: string | number;
  height: string | number;
  original: string;
  value: string;
  defaultValue: string;
  language: string;
  theme: string;
  options: object;
  editorDidMount: (editor, monaco) => void;
  editorWillMount: (monaco) => void;
  onChange: (value, event) => void;
  requireConfig: object;
  context: object;
}

declare class MonacoDiffEditor extends React.Component<MonacoDiffEditorProps> {
  constructor(props: Partial<MonacoDiffEditorProps>);

  componentDidMount(): void;
  componentDidUpdate(prevProps: Partial<MonacoDiffEditorProps>): void;
  componentWillUnmount(): void;

  editorWillMount(monaco): void;
  editorDidMount(editor: monacoEditor.editor.IEditor, monaco: typeof monacoEditor): void;

  afterViewInit(): void;
  initMonaco(): void;
  destroyMonaco(): void;

  assignRef(component): void;

  render(): React.DOMElement<any, any>;

  updateModel(value: string | null, original: string | null): void;
}

export { MonacoEditor as default, MonacoEditorProps, MonacoDiffEditor, MonacoDiffEditorProps };
