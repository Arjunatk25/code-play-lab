import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  disabled?: boolean;
}

/**
 * Animated run button with glow effect
 */
export function RunButton({ onClick, isRunning, disabled }: RunButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isRunning}
      className={cn(
        "relative px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
        "transition-all duration-300",
        !isRunning && !disabled && "glow-primary hover:glow-accent"
      )}
    >
      {isRunning ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Running...
        </>
      ) : (
        <>
          <Play className="w-4 h-4" />
          Run
        </>
      )}
    </Button>
  );
}
