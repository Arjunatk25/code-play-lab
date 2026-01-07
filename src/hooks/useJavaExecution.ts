import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface JavaExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  language?: string;
  version?: string;
  executionTime: number;
}

export function useJavaExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<JavaExecutionResult | null>(null);

  const executeJava = async (code: string) => {
    setIsRunning(true);
    const startTime = performance.now();

    try {
      const { data, error } = await supabase.functions.invoke('execute-java', {
        body: { code },
      });

      const executionTime = performance.now() - startTime;

      if (error) {
        setResult({
          success: false,
          output: '',
          error: error.message,
          executionTime,
        });
        return;
      }

      setResult({
        success: data.success,
        output: data.output || '',
        error: data.error,
        language: data.language,
        version: data.version,
        executionTime,
      });
    } catch (err) {
      const executionTime = performance.now() - startTime;
      setResult({
        success: false,
        output: '',
        error: err instanceof Error ? err.message : 'Unknown error',
        executionTime,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return { executeJava, isRunning, result, reset };
}
