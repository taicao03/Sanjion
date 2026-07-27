// VS Code-Style Rich Code Snippets & IntelliSense Completion Provider for Monaco Editor

let isRegistered = false;

export const registerMonacoSnippets = (monaco: any) => {
  if (isRegistered || !monaco || !monaco.languages) return;
  isRegistered = true;

  const CompletionItemKind = monaco.languages.CompletionItemKind;
  const InsertTextRule = monaco.languages.CompletionItemInsertTextRule;

  const snippets = [
    // Console & Debugging
    {
      label: 'clg',
      detail: 'console.log(...)',
      documentation: 'Log output to browser console',
      insertText: 'console.log(${1:item});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'err',
      detail: 'console.error(...)',
      documentation: 'Log error to browser console',
      insertText: 'console.error(${1:error});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'warn',
      detail: 'console.warn(...)',
      documentation: 'Log warning to browser console',
      insertText: 'console.warn(${1:warning});',
      kind: CompletionItemKind.Snippet,
    },

    // Functions
    {
      label: 'fn',
      detail: 'function statement',
      documentation: 'Standard named function definition',
      insertText: 'function ${1:functionName}(${2:params}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'afn',
      detail: 'arrow function',
      documentation: 'ES6 Arrow Function expression',
      insertText: 'const ${1:funcName} = (${2:params}) => {\n\t${0}\n};',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'async',
      detail: 'async function',
      documentation: 'Async function declaration',
      insertText: 'async function ${1:funcName}(${2:params}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'prom',
      detail: 'new Promise(...)',
      documentation: 'Create a new ES6 Promise',
      insertText: 'new Promise((resolve, reject) => {\n\t${0}\n});',
      kind: CompletionItemKind.Snippet,
    },

    // Control Flow & Loops
    {
      label: 'if',
      detail: 'if statement',
      documentation: 'Conditional if block',
      insertText: 'if (${1:condition}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'ife',
      detail: 'if / else statement',
      documentation: 'Conditional if/else block',
      insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'for',
      detail: 'for loop',
      documentation: 'Standard indexed for loop',
      insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'forof',
      detail: 'for...of loop',
      documentation: 'Iterate over iterable elements',
      insertText: 'for (const ${1:item} of ${2:iterable}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'forin',
      detail: 'for...in loop',
      documentation: 'Iterate over object keys',
      insertText: 'for (const ${1:key} in ${2:object}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'tc',
      detail: 'try / catch block',
      documentation: 'Error handling try/catch block',
      insertText: 'try {\n\t${1}\n} catch (${2:error}) {\n\t${0}\n}',
      kind: CompletionItemKind.Snippet,
    },

    // Array Higher-Order Methods
    {
      label: 'map',
      detail: 'Array.map(...)',
      documentation: 'Transform array elements into a new array',
      insertText: '${1:array}.map((${2:item}) => {\n\treturn ${0};\n});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'filter',
      detail: 'Array.filter(...)',
      documentation: 'Filter array elements based on condition',
      insertText: '${1:array}.filter((${2:item}) => {\n\treturn ${0};\n});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'reduce',
      detail: 'Array.reduce(...)',
      documentation: 'Reduce array to a single value',
      insertText: '${1:array}.reduce((acc, ${2:curr}) => {\n\treturn ${0};\n}, ${3:initialValue});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'forEach',
      detail: 'Array.forEach(...)',
      documentation: 'Execute callback for each array item',
      insertText: '${1:array}.forEach((${2:item}) => {\n\t${0}\n});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'find',
      detail: 'Array.find(...)',
      documentation: 'Find first matching element in array',
      insertText: '${1:array}.find((${2:item}) => ${3:item.id === id});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'some',
      detail: 'Array.some(...)',
      documentation: 'Check if at least one item matches condition',
      insertText: '${1:array}.some((${2:item}) => ${0});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'every',
      detail: 'Array.every(...)',
      documentation: 'Check if all items match condition',
      insertText: '${1:array}.every((${2:item}) => ${0});',
      kind: CompletionItemKind.Snippet,
    },

    // Useful JS Utilities
    {
      label: 'isarr',
      detail: 'Array.isArray(...)',
      documentation: 'Check if value is an Array',
      insertText: 'Array.isArray(${1:value})',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'objkeys',
      detail: 'Object.keys(...)',
      documentation: 'Get array of object keys',
      insertText: 'Object.keys(${1:object})',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'objentries',
      detail: 'Object.entries(...)',
      documentation: 'Get key-value pairs array',
      insertText: 'Object.entries(${1:object})',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'jsonp',
      detail: 'JSON.parse(...)',
      documentation: 'Parse JSON string into Object',
      insertText: 'JSON.parse(${1:jsonString})',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'jsons',
      detail: 'JSON.stringify(...)',
      documentation: 'Serialize Object into JSON string',
      insertText: 'JSON.stringify(${1:object}, null, 2)',
      kind: CompletionItemKind.Snippet,
    },

    // React Hooks
    {
      label: 'useState',
      detail: 'const [state, setState] = useState(...)',
      documentation: 'React State Hook',
      insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialState});',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'useEffect',
      detail: 'useEffect(() => {...}, [...])',
      documentation: 'React Effect Hook',
      insertText: 'useEffect(() => {\n\t${1}\n\treturn () => {\n\t\t${2}\n\t};\n}, [${3}]);',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'useMemo',
      detail: 'useMemo(() => ..., [...])',
      documentation: 'React Memoized Value Hook',
      insertText: 'const ${1:memoizedValue} = useMemo(() => {\n\treturn ${2};\n}, [${3}]);',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'useCallback',
      detail: 'useCallback((...) => ..., [...])',
      documentation: 'React Memoized Callback Hook',
      insertText: 'const ${1:handleClick} = useCallback((${2:params}) => {\n\t${0}\n}, [${3}]);',
      kind: CompletionItemKind.Snippet,
    },
    {
      label: 'useRef',
      detail: 'const ref = useRef(...)',
      documentation: 'React Ref Hook',
      insertText: 'const ${1:refName} = useRef(${2:null});',
      kind: CompletionItemKind.Snippet,
    },
  ];

  const provider = {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = snippets.map((s) => ({
        label: s.label,
        kind: s.kind,
        detail: s.detail,
        documentation: s.documentation,
        insertText: s.insertText,
        insertTextRules: InsertTextRule.InsertAsSnippet,
        range: range,
      }));

      return { suggestions };
    },
  };

  monaco.languages.registerCompletionItemProvider('javascript', provider);
  monaco.languages.registerCompletionItemProvider('typescript', provider);
};
