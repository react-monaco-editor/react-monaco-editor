# react-monaco-editor

> [Monaco Editor](https://github.com/Microsoft/monaco-editor) for React.

## Examples

To build the examples locally, run:

```
npm install
cd examples/sample && npm install
npm start
```

Then open `http://localhost:8886` in a browser.

## Installation

```
npm install react-monaco-editor
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      code: '// type your code...'
    }
  }
  onDidMount(editor) {
    editor.onDidChangeModelContent((e) => {
      console.log('onDidChangeModelContent', e);
    });
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        value={code}
        options={options}
        onDidMount={::this.onDidMount}
      />
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
```

## Properties

- `width` width of editor. Defaults to `100%`.
- `height` height of editor. Defaults to `500`.
- `value` the initial value of the auto created model in the editor.
- `language` the initial language of the auto created model in the editor.
- `options` refer to [Monaco interface IEditorOptions](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L1029).
- `onDidMount` an event emitted when the editor has been mounted (similar to `componentDidMount` of React).

## Methods

Refer to [Monaco interface IEditor](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L2813).

## Q & A

### How to interact with the MonacoEditor instance

Using the first parameter of `onDidMount`, or using a `ref` (e.g. `<MonacoEditor ref="monaco">`) after `onDidMount` event has fired.

Then you can invoke instance methods via `this.refs.monaco.editor`, e.g. `this.refs.monaco.editor.focus()` to focuses the MonacoEditor instance.

### How to get value of editor

There are 2 ways:

1. `const value = this.refs.monaco.editor.model.getValue();`

2. via method of `Model` instance:
 
```js
const model = this.refs.monaco.editor.getModel();
const value = model.getValue();
```

# License

MIT, see the [LICENSE](/LICENSE.md) file for detail.

