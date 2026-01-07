import { useState, useCallback } from 'react';
import { Code2, BookOpen, Sparkles } from 'lucide-react';
import { InputEditor } from '@/components/compiler/InputEditor';
import { OutputConsole } from '@/components/compiler/OutputConsole';
import { ModeSelector } from '@/components/compiler/ModeSelector';
import { RunButton } from '@/components/compiler/RunButton';
import { MappingReference } from '@/components/compiler/MappingReference';
import { compile, CompileMode, CompileResult } from '@/lib/compiler';

const EXAMPLE_INPUT = `// Try these examples:
Hello World
A->Z
1->9
HELLO (becomes URYYB in mapping mode)
A->E combined with mapping`;

const Index = () => {
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [mode, setMode] = useState<CompileMode>('combined');
  const [result, setResult] = useState<CompileResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    
    // Simulate slight delay for "compilation" effect
    setTimeout(() => {
      const compileResult = compile(input, mode);
      setResult(compileResult);
      setIsRunning(false);
    }, 300);
  }, [input, mode]);

  // Run on Ctrl+Enter or Cmd+Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col" onKeyDown={handleKeyDown}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-header-bg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 glow-primary">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              CodeTransform
              <Sparkles className="w-4 h-4 text-primary" />
            </h1>
            <p className="text-xs text-muted-foreground">Educational Compiler Simulator</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeSelector value={mode} onChange={setMode} />
          <RunButton onClick={handleRun} isRunning={isRunning} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Panel - Input */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 px-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Input Editor</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Press Ctrl+Enter to run
            </span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <InputEditor
              value={input}
              onChange={setInput}
              placeholder="Enter your code here... Try patterns like A->Z or 1->9"
            />
          </div>
        </div>

        {/* Right Panel - Output & Reference */}
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          <div className="flex-1 min-h-[200px]">
            <OutputConsole result={result} isRunning={isRunning} />
          </div>
          <MappingReference />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-border bg-header-bg">
        <p className="text-xs text-center text-muted-foreground">
          This project demonstrates how compiler-like behavior can be simulated using logical input 
          transformation rules, making it ideal for educational and beginner-level technical events.
        </p>
      </footer>
    </div>
  );
};

export default Index;
