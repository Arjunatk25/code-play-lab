import { CheckCircle2, XCircle, AlertTriangle, Terminal, Clock } from 'lucide-react';
import { CompileResult } from '@/lib/compiler';

interface OutputConsoleProps {
  result: CompileResult | null;
  isRunning: boolean;
}

/**
 * Terminal-style output console
 */
export function OutputConsole({ result, isRunning }: OutputConsoleProps) {
  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-border bg-console-bg">
      {/* Console Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-header-bg border-b border-border">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Output</span>
        
        {result && (
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {result.stats.executionTime.toFixed(2)}ms
            </span>
            {result.success ? (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="w-3 h-3" />
                Success
              </span>
            ) : (
              <span className="flex items-center gap-1 text-error">
                <XCircle className="w-3 h-3" />
                Errors
              </span>
            )}
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 p-4 overflow-auto scrollbar-thin">
        {isRunning ? (
          <div className="flex items-center gap-2 text-console-prompt animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-sm">Compiling...</span>
          </div>
        ) : result ? (
          <div className="space-y-3 animate-fade-in">
            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="space-y-1">
                {result.errors.map((error, i) => (
                  <div key={i} className="flex items-start gap-2 text-error font-mono text-sm">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="space-y-1">
                {result.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2 text-warning font-mono text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {(result.stats.rangesExpanded > 0 || result.stats.charsTransformed > 0) && (
              <div className="text-muted-foreground font-mono text-xs border-t border-border pt-2 mt-2">
                {result.stats.rangesExpanded > 0 && (
                  <div>→ Ranges expanded: {result.stats.rangesExpanded}</div>
                )}
                {result.stats.charsTransformed > 0 && (
                  <div>→ Characters transformed: {result.stats.charsTransformed}</div>
                )}
              </div>
            )}

            {/* Output */}
            {result.output && (
              <div className="console-output mt-2">
                <span className="console-prompt">{">"} </span>
                {result.output}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Terminal className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">Run your code to see output</p>
          </div>
        )}
      </div>
    </div>
  );
}
