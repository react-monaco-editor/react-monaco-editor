import React from 'react'
import { render } from 'react-dom'

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import MonacoEditor from 'react-monaco-editor'
/* eslint-enable import/extensions */
/* eslint-enable import/no-unresolved */
/* eslint-enable import/no-extraneous-dependencies */


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
