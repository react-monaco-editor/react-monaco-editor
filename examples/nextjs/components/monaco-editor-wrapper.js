window.MonacoEnvironment = { baseUrl: '/monaco-editor-external' };
import * as monaco from '@timkendrick/monaco-editor/dist/external'
import React, { Component } from 'react'
import MonacoEditor from 'react-monaco-editor'

export default class MonacoEditorWrapper extends Component {
  render() {
    return (
      <MonacoEditor {...this.props} />
    )
  }
}