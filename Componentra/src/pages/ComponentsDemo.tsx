import { useState, type ReactNode } from "react";
import { Code } from "lucide-react";
import CodeBlock from "@/components/Personal/CodeBlock";

interface ComponentDemoProps {
  children?: ReactNode;
  code: string;
}

const ComponentDemo = ({ children, code }: ComponentDemoProps) => {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  return (
    <div className="component-demo">
      <div className="component-demo-toolbar">
        <span className="component-demo-toolbar-label text-sm font-medium">
          Preview
        </span>
        <button
          type="button"
          onClick={() => setIsCodeVisible((visible) => !visible)}
          className="component-demo-code-button text-sm"
        >
          <Code size={14} />
          {isCodeVisible ? "Hide Code" : "View Code"}
        </button>
      </div>

      <div className="component-demo-preview">{children}</div>

      {isCodeVisible && (
        <div className="component-demo-code">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
};

export default ComponentDemo;
