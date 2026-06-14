import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** Renders lesson markdown body, including LaTeX via KaTeX. */
export function LessonContent({ content }: { content: string }) {
  return (
    <div className="prose prose-ink max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-a:text-accent-600 prose-code:text-accent-700 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-accent-300 prose-blockquote:text-ink-600">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
