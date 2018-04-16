import React from 'react'
import { render } from 'react-dom'
import MonacoEditor from 'react-monaco-editor'


const defaultCode = '// type your code... \n'

const CodeEditor = () => {
  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
  }

  return (
    <MonacoEditor
      width="500"
      height="500"
      language="javascript"
      value={defaultCode}
      options={options}
    />
  )
}

render(
  <CodeEditor />,
  document.getElementById('root')
)
