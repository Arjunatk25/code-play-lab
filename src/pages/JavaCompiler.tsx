import { useState, useCallback } from 'react';
import { Code2, Play, Terminal, Coffee } from 'lucide-react';
import { InputEditor } from '@/components/compiler/InputEditor';
import { Button } from '@/components/ui/button';
import { useJavaExecution } from '@/hooks/useJavaExecution';

const DEFAULT_JAVA_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some Java features
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum of 1 to 10: " + sum);
    }
}`;

const JavaCompiler = () => {
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const { executeJava, isRunning, result } = useJavaExecution();

  const handleRun = useCallback(() => {
    executeJava(code);
  }, [code, executeJava]);

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
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/20">
            <Coffee className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              Java Compiler
              <Code2 className="w-4 h-4 text-orange-500" />
            </h1>
            <p className="text-xs text-muted-foreground">
              {result?.version ? `Java ${result.version}` : 'Online Java Execution'}
            </p>
          </div>
        </div>

        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="gap-2 bg-orange-500 hover:bg-orange-600"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Code2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Main.java</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Press Ctrl+Enter to run
            </span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <InputEditor
              value={code}
              onChange={setCode}
              placeholder="Write your Java code here..."
            />
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 px-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Output</span>
            {result && (
              <span className="text-xs text-muted-foreground ml-auto">
                {result.executionTime.toFixed(0)}ms
              </span>
            )}
          </div>
          <div className="flex-1 min-h-[300px] bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-full p-4 font-mono text-sm overflow-auto">
              {isRunning ? (
                <div className="text-muted-foreground animate-pulse">
                  Compiling and executing...
                </div>
              ) : result ? (
                <div className="space-y-2">
                  {result.error ? (
                    <pre className="text-red-400 whitespace-pre-wrap">{result.error}</pre>
                  ) : (
                    <pre className="text-green-400 whitespace-pre-wrap">{result.output}</pre>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Click "Run" or press Ctrl+Enter to execute your Java code.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-border bg-header-bg">
        <p className="text-xs text-center text-muted-foreground">
          Powered by Piston API - Free, open-source code execution engine
        </p>
      </footer>
    </div>
  );
};

export default JavaCompiler;
