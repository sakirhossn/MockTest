import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Parses and renders text that contains inline ($...$) or block ($$...$$) LaTeX formulas
 * using KaTeX with automatic graceful fallback.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', inline = false }) => {
  if (!content) return null;

  // Split content by $$ (block math) and $ (inline math)
  // Regular expression to identify:
  // 1. $$...$$ -> Display/Block math
  // 2. $...$   -> Inline math
  const parts: { type: 'text' | 'inline-math' | 'block-math'; value: string }[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      parts.push({
        type: 'block-math',
        value: matchedStr.slice(2, -2).trim(),
      });
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      parts.push({
        type: 'inline-math',
        value: matchedStr.slice(1, -1).trim(),
      });
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.slice(lastIndex),
    });
  }

  return (
    <span className={`inline-block leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // Render plain text with preserved line breaks
          return (
            <span key={index} className="whitespace-pre-line">
              {part.value}
            </span>
          );
        }

        const isBlock = part.type === 'block-math';

        try {
          const html = katex.renderToString(part.value, {
            displayMode: isBlock && !inline,
            throwOnError: false,
            output: 'htmlAndMathml',
          });

          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: html }}
              className={isBlock && !inline ? 'block my-2 text-center overflow-x-auto py-1' : 'inline-block mx-0.5'}
            />
          );
        } catch (e) {
          // Fallback to literal text if KaTeX fails
          return (
            <code key={index} className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-amber-600 font-mono text-sm">
              ${part.value}$
            </code>
          );
        }
      })}
    </span>
  );
};
