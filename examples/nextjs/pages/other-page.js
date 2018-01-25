import dynamic from 'next/dynamic'
const MonacoEditorWrapper = dynamic(import('../components/monaco-editor-wrapper'), {ssr: false})
import Link from 'next/link'
import Head from 'next/head'

export default () => {
  const someCss = [
    '.exampleDiv {',
    '  background-color: #003;',
    '  color: #ccc;',
    '}'
  ].join("\n")
  const someJs = [
    "import {myCoolFunc} from './utils'",
    'export default async () => {',
    '  await myCoolFunc()',
    '}'
  ].join("\n")
  return (
    <div>
      <Head>
        <link key="monaco-css" rel="stylesheet" href="/monaco-editor-external/monaco.css" />
      </Head>
      <div>
        <Link href="/"><a>Home</a></Link>
      </div>
      <MonacoEditorWrapper
        width={500}
        height={200}
        language="css"
        theme="vs-dark"
        value={someCss}
        options={{selectOnLineNumbers: true}}
        onChange={() => null}
        editorDidMount={() => null}
      />
      <MonacoEditorWrapper
        width={500}
        height={200}
        language="javascript"
        theme="vs-dark"
        value={someJs}
        options={{selectOnLineNumbers: true}}
        onChange={() => null}
        editorDidMount={() => null}
      />
    </div>
  )
}