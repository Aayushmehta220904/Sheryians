import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = "tsx" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-950 px-4 py-2 text-gray-100">
        <span className="font-mono text-xs uppercase">{language}</span>
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-2 rounded bg-gray-800 px-2 py-1 text-xs transition-colors hover:bg-gray-700"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className="code-block-pre">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
