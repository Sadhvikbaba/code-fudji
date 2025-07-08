'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { editor, languages, Position, IRange } from 'monaco-editor';

// Dynamic import of Monaco Editor to avoid SSR issues
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96 bg-gray-900 text-white">Loading editor...</div>
  }
);

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string | number;
  width?: string | number;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  className?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  language = 'typescript',
  height = 'calc(100vh - 100px)',
  width = '100%',
  theme = 'vs-dark',
  options = {},
  className = ''
}) => {

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    // Configure TypeScript compiler options for better IntelliSense
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      strict: true,
      skipLibCheck: true,
    });

    // Add React type definitions
    const reactTypes = `
      declare module 'react' {
        export interface FC<P = {}> {
          (props: P): JSX.Element | null;
        }
        export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useRef<T>(initialValue: T): { current: T };
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export interface ReactNode {}
        export interface JSX {
          Element: any;
          IntrinsicElements: any;
        }
        export interface Component<P = {}, S = {}> {}
        export interface HTMLAttributes<T> {
          className?: string;
          style?: any;
          onClick?: (event: any) => void;
          onChange?: (event: any) => void;
        }
      }
    `;

    const nextTypes = `
      declare module 'next/router' {
        export interface NextRouter {
          push(url: string): Promise<boolean>;
          replace(url: string): Promise<boolean>;
          pathname: string;
          query: any;
          asPath: string;
        }
        export function useRouter(): NextRouter;
      }
      declare module 'next/link' {
        interface LinkProps {
          href: string;
          children: React.ReactNode;
          className?: string;
        }
        declare const Link: React.FC<LinkProps>;
        export default Link;
      }
      declare module 'next/head' {
        interface HeadProps {
          children: React.ReactNode;
        }
        declare const Head: React.FC<HeadProps>;
        export default Head;
      }
    `;

    // Add type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'react.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib(nextTypes, 'next.d.ts');

    // Configure diagnostics options
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });

    // Add custom snippets
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model: editor.ITextModel, position: Position) => {
        const word = model.getWordUntilPosition(position);
        const range: IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions: languages.CompletionItem[] = [
          {
            label: 'rfc',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'import React from \'react\';',
              '',
              'interface ${1:ComponentName}Props {',
              '  $2',
              '}',
              '',
              'const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ $3 }) => {',
              '  return (',
              '    <div>',
              '      $4',
              '    </div>',
              '  );',
              '};',
              '',
              'export default ${1:ComponentName};'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React Functional Component',
            range
          },
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>(${3:initialValue});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useState hook',
            range
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'useEffect(() => {',
              '  $1',
              '}, [$2]);'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useEffect hook',
            range
          },
          {
            label: 'nextpage',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'import { NextPage } from \'next\';',
              '',
              'const ${1:PageName}: NextPage = () => {',
              '  return (',
              '    <div>',
              '      <h1>${2:Page Title}</h1>',
              '      $3',
              '    </div>',
              '  );',
              '};',
              '',
              'export default ${1:PageName};'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Next.js Page Component',
            range
          },
          {
            label: 'useRouter',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const router = useRouter();',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Next.js useRouter hook',
            range
          }
        ];

        return { suggestions };
      }
    });

  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    fontLigatures: true,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    cursorStyle: 'line',
    wordWrap: 'on',
    minimap: {
      enabled: true,
      side: 'right',
      showSlider: 'mouseover',
      renderCharacters: true,
      maxColumn: 120,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    acceptSuggestionOnCommitCharacter: true,
    snippetSuggestions: 'top',
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    quickSuggestionsDelay: 10,
    parameterHints: {
      enabled: true,
      cycle: true
    },
    hover: {
      enabled: true,
      delay: 300,
      sticky: true
    },
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      bracketPairsHorizontal: true,
      highlightActiveBracketPair: true,
      indentation: true,
      highlightActiveIndentation: true
    },
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full',
    tabCompletion: 'on',
    multiCursorModifier: 'ctrlCmd',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    },
    find: {
      seedSearchStringFromSelection: 'always',
      autoFindInSelection: 'never'
    },
    ...options
  };

  return (
    <div className={className}>
      <Editor
        height={height}
        width={width}
        language={language}
        value={value}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={editorOptions}
        loading={<div className="flex items-center justify-center h-96 bg-gray-900 text-white">Loading Monaco Editor...</div>}
      />
    </div>
  );
};

export default MonacoEditor;