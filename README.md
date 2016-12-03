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
cd examples && npm install
npm start
```

Then open `http://localhost:8886` in a browser.

## Installation

```
npm install react-monaco-editor
```

## Usage

### Using with webpack

```js
import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
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
        onChange={::this.onChange}
        editorDidMount={::this.editorDidMount}
      />
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
```

Add a Webpack plugin `copy-webpack-plugin` to your `webpack.config.js`:

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

### Using with require.config (do not need Webpack)

```js
class App extends React.Component {
  render() {
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        'vs': 'https://www.mycdn.com/monaco-editor/0.6.1/min/vs'
      }
    };
    return (
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        value="// type your code..."
        requireConfig={requireConfig}
      />
    );
  }
}
```

`requireConfig` is optional, equal to:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js"></script>
<script>
    require.config({ paths: { 'vs': 'https://www.mycdn.com/monaco-editor/0.6.1/min/vs' }});
</script>
```

Both them are valid ways to config loader url and relative path of module.

> You may need to note the [cross domain case](https://github.com/Microsoft/monaco-editor#integrate-cross-domain).

## Properties

If you specify `value` property, the component behaves in controlled mode.
Otherwise, it behaves in uncontrolled mode.

- `width` width of editor. Defaults to `100%`.
- `height` height of editor. Defaults to `500`.
- `value` value of the auto created model in the editor.
- `defaultValue` the initial value of the auto created model in the editor.
- `language` the initial language of the auto created model in the editor.
- `options` refer to [Monaco interface IEditorOptions](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L1029).
- `onChange(newValue, event)` an event emitted when the content of the current model has changed.
- `editorWillMount(monaco)` an event emitted before the editor mounted (similar to `componentWillMount` of React).
- `editorDidMount(editor, monaco)` an event emitted when the editor has been mounted (similar to `componentDidMount` of React).
- `requireConfig` optional, allow to config loader url and relative path of module, refer to [require.config](http://requirejs.org/docs/api.html#config).
- `context` optional, allow to pass a different context then the global window onto which the monaco instance will be loaded. Useful if you want to load the editor in an iframe.

## Events & Methods

Refer to [Monaco interface IEditor](https://github.com/Microsoft/monaco-editor/blob/master/website/playground/monaco.d.ts.txt#L2813).

## Q & A

### How to interact with the MonacoEditor instance

Using the first parameter of `editorDidMount`, or using a `ref` (e.g. `<MonacoEditor ref="monaco">`) after `editorDidMount` event has fired.

Then you can invoke instance methods via `this.refs.monaco.editor`, e.g. `this.refs.monaco.editor.focus()` to focuses the MonacoEditor instance.

### How to get value of editor

Using `this.refs.monaco.editor.getValue()` or via method of `Model` instance:

```js
const model = this.refs.monaco.editor.getModel();
const value = model.getValue();
```

### Do something before editor mounted

For example, you may want to configure some JSON schemas before editor mounted, then you can go with `editorWillMount(monaco)`:

```js
class App extends React.Component {
    editorWillMount(monaco) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [{
                uri: "http://myserver/foo-schema.json",
                schema: {
                    type: "object",
                    properties: {
                        p1: {
                            enum: [ "v1", "v2"]
                        },
                        p2: {
                            $ref: "http://myserver/bar-schema.json"
                        }
                    }
                }
            }]
        });
    }
    render() {
        return (
          <MonacoEditor language="json" editorWillMount={this.editorWillMount} />
        );
    }
}
```

# License

MIT, see the [LICENSE](/LICENSE.md) file for detail.
