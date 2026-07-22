import React from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!content) return null;

  // Unescape literal \n strings if present
  const unescaped = content.replace(/\\n/g, '\n');

  // Clean orphan "javascript" words appearing right above code blocks
  const cleanedContent = unescaped.replace(/^javascript\s*$/gm, '');

  // Split explicit code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g;
  const parts: { type: 'text' | 'code'; text: string; lang?: string }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(cleanedContent)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: cleanedContent.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'javascript',
      text: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < cleanedContent.length) {
    parts.push({ type: 'text', text: cleanedContent.slice(lastIndex) });
  }

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to render paragraph with inline backtick code badges (`code`)
  const renderParagraphWithInlineCode = (text: string) => {
    const segments = text.split(/(`[^`]+`)/g);
    return segments.map((seg, i) => {
      if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
        const codeText = seg.slice(1, -1);
        return (
          <code
            key={i}
            className="bg-pink-100/90 border border-pink-200 text-pink-700 px-1.5 py-0.5 mx-0.5 rounded-lg font-mono text-[11px] font-semibold break-all"
          >
            {codeText}
          </code>
        );
      }
      return seg;
    });
  };

  // ✨ ACCURATE CHARACTER-PRESERVING VS CODE SYNTAX HIGHLIGHTER WITH AUTO WORD WRAP ✨
  const renderHighlightedCode = (codeText: string) => {
    const keywords = new Set([
      'function', 'let', 'const', 'var', 'return', 'async', 'await',
      'if', 'else', 'try', 'catch', 'for', 'while', 'new', 'of', 'in',
      'class', 'import', 'export', 'default', 'extends', 'typeof', 'instanceof'
    ]);

    const booleans = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
    const builtins = new Set(['Promise', 'resolve', 'reject', 'setTimeout', 'setInterval', 'console', 'log', 'Math', 'Array', 'Object', 'Date']);

    // Master Regex that captures ALL tokens including dots '.', quotes, spaces, and punctuation
    const masterRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:function|let|const|var|return|async|await|if|else|try|catch|for|while|new|of|in|class|import|export|default|extends|typeof|instanceof)\b|\b(?:true|false|null|undefined|NaN|Infinity)\b|\b(?:Promise|setTimeout|setInterval|console|Math|Array|Object|Date)\b|\b[a-zA-Z_$][a-zA-Z0-9_$]*\b|\b\d+(?:\.\d+)?\b|=>|[=+\-*\/%&|^!<>:]+|[.,;:(){}[\]]|\s+)/g;

    const lines = codeText.split('\n');

    return (
      <pre className="font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-words select-text">
        <code>
          {lines.map((line, lineIdx) => {
            const tokens: React.ReactNode[] = [];
            let m: RegExpExecArray | null;
            let lastTokIndex = 0;

            masterRegex.lastIndex = 0;

            while ((m = masterRegex.exec(line)) !== null) {
              if (m.index > lastTokIndex) {
                tokens.push(
                  <span key={`un-${lastTokIndex}`} className="text-slate-300">
                    {line.slice(lastTokIndex, m.index)}
                  </span>
                );
              }

              const tok = m[0];
              const tokKey = `${lineIdx}-${m.index}`;

              if (/^\s+$/.test(tok)) {
                tokens.push(<span key={tokKey}>{tok}</span>);
              } else if (tok.startsWith('//') || tok.startsWith('/*')) {
                tokens.push(<span key={tokKey} className="text-slate-500 italic">{tok}</span>);
              } else if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) {
                tokens.push(<span key={tokKey} className="text-emerald-300 font-medium">{tok}</span>);
              } else if (/^\d+(?:\.\d+)?$/.test(tok)) {
                tokens.push(<span key={tokKey} className="text-amber-400 font-bold">{tok}</span>);
              } else if (keywords.has(tok)) {
                tokens.push(<span key={tokKey} className="text-purple-400 font-bold">{tok}</span>);
              } else if (booleans.has(tok)) {
                tokens.push(<span key={tokKey} className="text-rose-400 font-bold">{tok}</span>);
              } else if (builtins.has(tok)) {
                tokens.push(<span key={tokKey} className="text-sky-400 font-bold">{tok}</span>);
              } else if (tok === '=>') {
                tokens.push(<span key={tokKey} className="text-pink-400 font-black px-0.5">{tok}</span>);
              } else if (tok === '.') {
                tokens.push(<span key={tokKey} className="text-slate-300 font-bold">{tok}</span>);
              } else if (/^[=+\-*\/%&|^!<>:]+$/.test(tok)) {
                tokens.push(<span key={tokKey} className="text-pink-400 font-extrabold">{tok}</span>);
              } else if (/^[,;:(){}[\]]$/.test(tok)) {
                tokens.push(<span key={tokKey} className="text-slate-400 font-bold">{tok}</span>);
              } else {
                tokens.push(<span key={tokKey} className="text-slate-100">{tok}</span>);
              }

              lastTokIndex = m.index + tok.length;
            }

            if (lastTokIndex < line.length) {
              tokens.push(
                <span key={`end-${lastTokIndex}`} className="text-slate-300">
                  {line.slice(lastTokIndex)}
                </span>
              );
            }

            return (
              <div key={lineIdx} className="min-h-[1.25rem]">
                {tokens.length > 0 ? tokens : ' '}
              </div>
            );
          })}
        </code>
      </pre>
    );
  };

  // Helper to check if line is a question / instruction prompt
  const isQuestionPrompt = (line: string) => {
    const trimmed = line.trim();
    return (
      /^(\/\/|\#\#|\#)?\s*(Hỏi|Câu hỏi|Yêu cầu|Chọn đáp án|Đầu ra|Kết quả)\b/i.test(trimmed) ||
      /^(\/\/|\#\#|\#)?\s*Question\b/i.test(trimmed)
    );
  };

  // Helper to check if line contains STRICT JavaScript/JSX code indicators
  const isCodeIndicator = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (isQuestionPrompt(line)) return false;

    // Never match list items like "1). Đây là kiến thức" or "1. Lời giải"
    if (/^\d+[\).]\s*/.test(trimmed)) return false;

    // Do NOT trigger code box on plain text explanation sentences (containing spaces & normal words)
    if (
      trimmed.length > 15 &&
      /\s/.test(trimmed) &&
      !/^(let|const|var|function|return|import|export|class)\b/.test(trimmed) &&
      !trimmed.startsWith('//') &&
      !trimmed.includes('=>') &&
      !/^<\/?[a-zA-Z0-9_$]+.*?>?$/.test(trimmed)
    ) {
      return false;
    }

    return (
      /^(let|const|var|function|return|import|export|class|if|else|for|while|try|catch|switch|case|default|async|await|console\.)\b/.test(trimmed) ||
      /=>/.test(trimmed) ||
      /^<\/?[a-zA-Z0-9_$]+.*?>?$/.test(trimmed) ||
      /^\);?$/.test(trimmed) ||
      /^\};?$/.test(trimmed) ||
      (trimmed.startsWith('//') && !isQuestionPrompt(line))
    );
  };

  // ✨ UNIFIED SINGLE CODE SPAN MERGER ENGINE ✨
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');

    // Find the first line index that contains code & expand code block to include all JSX/closing tags
    let firstCodeIdx = -1;
    let lastCodeIdx = -1;

    for (let i = 0; i < lines.length; i++) {
      if (isQuestionPrompt(lines[i])) break; // Stop at question prompt
      const tr = lines[i].trim();

      if (isCodeIndicator(lines[i])) {
        if (firstCodeIdx === -1) firstCodeIdx = i;
        lastCodeIdx = i;
      } else if (firstCodeIdx !== -1) {
        // Expand code block range to include JSX tags & closing brackets (<div>, <h1>, </p>, );, etc.)
        if (tr.startsWith('<') || tr.endsWith('>') || tr.includes('</') || tr === ');' || tr === '}' || tr === '};' || tr === ')' || tr === ';') {
          lastCodeIdx = i;
        }
      }
    }

    // Only merge into code box if there are AT LEAST 2 contiguous code lines or explicit code block
    if (firstCodeIdx !== -1 && lastCodeIdx >= firstCodeIdx) {
      const preLines = lines.slice(0, firstCodeIdx);
      const codeLines = lines.slice(firstCodeIdx, lastCodeIdx + 1);
      const postLines = lines.slice(lastCodeIdx + 1);

      const codeText = codeLines.join('\n').trim();

      return (
        <div className="space-y-3">
          {/* Pre-code text */}
          {preLines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'javascript') return null;
            return (
              <p key={`pre-${idx}`} className="mb-1.5 leading-relaxed text-slate-700 font-medium">
                {renderParagraphWithInlineCode(line)}
              </p>
            );
          })}

          {/* Unified Single Continuous Code Block */}
          {codeText && (
            <div className="my-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="uppercase font-bold text-pink-400">javascript</span>
                <button
                  onClick={() => handleCopyCode(codeText, 8888)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === 8888 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 overflow-x-auto scrollbar-thin">
                {renderHighlightedCode(codeText)}
              </div>
            </div>
          )}

          {/* Post-code text & Question Prompts */}
          {postLines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            if (isQuestionPrompt(trimmed)) {
              const cleanQuestionText = trimmed.replace(/^(\/\/|\#\#|\#)?\s*/, '');
              return (
                <div
                  key={`q-${idx}`}
                  className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-200/80 shadow-sm flex items-start gap-2.5 text-slate-900"
                >
                  <div className="w-6 h-6 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black flex-shrink-0 mt-0.5 shadow-sm">
                    <HelpCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                    {cleanQuestionText}
                  </div>
                </div>
              );
            }

            return (
              <p key={`post-${idx}`} className="mb-1.5 leading-relaxed text-slate-700 font-medium">
                {renderParagraphWithInlineCode(line)}
              </p>
            );
          })}
        </div>
      );
    }

    // Normal paragraph text rendering fallback
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'javascript') return <div key={lineIdx} className="h-2" />;

      if (isQuestionPrompt(trimmed)) {
        const cleanQuestionText = trimmed.replace(/^(\/\/|\#\#|\#)?\s*/, '');
        return (
          <div
            key={`q-${lineIdx}`}
            className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-200/80 shadow-sm flex items-start gap-2.5 text-slate-900"
          >
            <div className="w-6 h-6 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black flex-shrink-0 mt-0.5 shadow-sm">
              <HelpCircle className="w-4 h-4 text-slate-900" />
            </div>
            <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
              {cleanQuestionText}
            </div>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="mb-1.5 leading-relaxed text-slate-700 font-medium">
          {renderParagraphWithInlineCode(line)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-800">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div key={index} className="my-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
              {/* Explicit Code block header */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="uppercase font-bold text-pink-400">{part.lang || 'javascript'}</span>
                <button
                  onClick={() => handleCopyCode(part.text, index)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content with VS Code Syntax Highlighting & Auto Word Wrap */}
              <div className="p-4 overflow-x-auto scrollbar-thin">
                {renderHighlightedCode(part.text)}
              </div>
            </div>
          );
        }

        return <div key={index}>{renderFormattedText(part.text)}</div>;
      })}
    </div>
  );
};
