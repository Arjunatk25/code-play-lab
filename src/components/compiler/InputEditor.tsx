import { useRef, useEffect } from 'react';

interface InputEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Code editor-style input with line numbers
 */
export function InputEditor({ value, onChange, placeholder }: InputEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Calculate line numbers
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 10);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !lineNumbers) return;

    const handleScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex h-full rounded-lg overflow-hidden border border-border bg-editor-bg">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex-shrink-0 w-12 py-4 overflow-hidden select-none bg-secondary/30"
        aria-hidden="true"
      >
        <div className="font-mono text-xs text-muted-foreground text-right pr-3">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-textarea w-full h-full p-4 scrollbar-thin"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{ lineHeight: '1.5rem' }}
        />
      </div>
    </div>
  );
}
