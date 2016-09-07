# react-monaco-editor

> [Monaco Editor](https://github.com/Microsoft/monaco-editor) for React.

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[![react-monaco-editor](https://nodei.co/npm/react-monaco-editor.png)](https://npmjs.org/package/react-monaco-editor)

[npm-url]: https://npmjs.org/package/react-monaco-editor
[downloads-image]: http://img.shields.io/npm/dm/react-monaco-editor.svg
[npm-image]: http://img.shields.io/npm/v/react-monaco-editor.svg

## Examples

To build the examples locally, run:

```
npm install
cd examples
npm start
```

Then open `http://localhost:8886` in a browser.

## Installation

```
npm install react-monaco-editor
```

## Usage

```js
import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

class App extends React.Component {
  onDidMount(editor) {
    console.log('onDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  render() {
    const initialCode = '// type your code...';
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        value={initialCode}
        options={options}
        onChange={::this.onChange}
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

Note that `react-monaco-editor` requires `webpack` and its plugin `copy-webpack-plugin`, below is an example for `webpack.config.js`:

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      }
    ])
  ]
};
```

Fill `from` field with the actual path of `monaco-editor` package in node_modules.  

## Properties

- `width` width of editor. Defaults to `100%`.
- `height` height of editor. Defaults to `500`.
- `value` the initial value of the auto created model in the editor.
- `language` the initial language of the auto created model in the editor.
- `options` refer to [Monaco interface IEditorOptions](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L1029).
- `onChange` an event emitted when the content of the current model has changed.
- `onDidMount` an event emitted when the editor has been mounted (similar to `componentDidMount` of React).

## Events & Methods

Refer to [Monaco interface IEditor](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L2813).

## Q & A

### How to interact with the MonacoEditor instance

Using the first parameter of `onDidMount`, or using a `ref` (e.g. `<MonacoEditor ref="monaco">`) after `onDidMount` event has fired.

Then you can invoke instance methods via `this.refs.monaco.editor`, e.g. `this.refs.monaco.editor.focus()` to focuses the MonacoEditor instance.

### How to get value of editor

Using `this.refs.monaco.editor.getValue()` or via method of `Model` instance:

```js
const model = this.refs.monaco.editor.getModel();
const value = model.getValue();
```

# License

MIT, see the [LICENSE](/LICENSE.md) file for detail.
