import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`text-[15px] leading-relaxed text-[#15171c] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 className="mt-6 mb-3 text-[22px] font-bold first:mt-0">{children}</h2>,
          h2: ({ children }) => <h3 className="mt-5 mb-2.5 text-[19px] font-bold first:mt-0">{children}</h3>,
          h3: ({ children }) => <h4 className="mt-4 mb-2 text-[16px] font-bold first:mt-0">{children}</h4>,
          p: ({ children }) => <p className="mb-3.5 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="mb-3.5 ml-5 list-disc space-y-1.5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3.5 ml-5 list-decimal space-y-1.5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          code: ({ children }) => (
            <code className="rounded-[4px] bg-[#f6f4ee] px-1.5 py-0.5 text-[13px] text-[#15171c]">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="mb-3.5 overflow-x-auto rounded-[10px] bg-[#f6f4ee] p-3.5 text-[13px] last:mb-0">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3.5 border-l-[3px] border-[rgba(22,163,74,.35)] pl-3.5 text-[#4a4d54] last:mb-0">{children}</blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[#16a34a] underline underline-offset-2">
              {children}
            </a>
          ),
          hr: () => <hr className="my-5 border-t border-[rgba(21,23,28,.1)]" />,
          table: ({ children }) => (
            <div className="mb-3.5 overflow-x-auto rounded-[12px] border border-[rgba(21,23,28,.1)] last:mb-0">
              <table className="w-full border-collapse text-[13.5px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#f6f4ee]">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-[rgba(21,23,28,.1)] px-3.5 py-2.5 text-left font-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[rgba(21,23,28,.07)] px-3.5 py-2.5 align-top last:border-b-0">{children}</td>
          ),
          tr: ({ children }) => <tr className="last:[&>td]:border-b-0">{children}</tr>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
