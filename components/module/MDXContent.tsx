/**
 * Server Component -- renders MDX source with math and GFM tables.
 *
 * Plugins:
 *   - remarkGfm    -- GFM tables, strikethrough, task lists
 *   - remarkMath   -- parses $...$ and $$...$$
 *   - rehypeKatex  -- renders LaTeX to HTML via KaTeX
 *
 * blockJS/blockDangerousJS are disabled because MDX content lives in
 * /content (trusted, first-party). This allows JSX props like
 * columns={[...]} in <DataTable /> to work correctly.
 * Re-enable those flags if content ever comes from untrusted sources.
 */
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { mdxComponents } from '@/mdx-components';

interface Props {
  source: string;
}

export function MDXContent({ source }: Props) {
  return (
    <div className="prose prose-ink mt-6 max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-a:text-accent-600 prose-code:text-accent-700 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-accent-300 prose-blockquote:text-ink-600">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          blockJS: false,
          blockDangerousJS: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        }}
      />
    </div>
  );
}
