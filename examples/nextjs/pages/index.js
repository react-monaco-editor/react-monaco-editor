import dynamic from 'next/dynamic'
const MonacoEditorWrapper = dynamic(import('../components/monaco-editor-wrapper'), {ssr: false})
import Link from 'next/link'
import Head from 'next/head'

export default () => {
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
        <Link href="/other-page"><a>Other Page</a></Link>
      </div>
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