import { CompileMode } from '@/lib/compiler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layers, ArrowLeftRight, Shuffle, Zap } from 'lucide-react';

interface ModeSelectorProps {
  value: CompileMode;
  onChange: (mode: CompileMode) => void;
}

const MODES: { value: CompileMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'No transformation',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    value: 'range',
    label: 'Range Expansion',
    description: 'Expand A->Z patterns',
    icon: <ArrowLeftRight className="w-4 h-4" />,
  },
  {
    value: 'mapping',
    label: 'Cipher Mapping',
    description: 'Apply substitution cipher',
    icon: <Shuffle className="w-4 h-4" />,
  },
  {
    value: 'combined',
    label: 'Combined',
    description: 'Range + Cipher',
    icon: <Zap className="w-4 h-4" />,
  },
];

/**
 * Dropdown to select compilation mode
 */
export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const selectedMode = MODES.find((m) => m.value === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as CompileMode)}>
      <SelectTrigger className="w-[200px] bg-secondary border-border">
        <div className="flex items-center gap-2">
          {selectedMode?.icon}
          <SelectValue placeholder="Select mode" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {MODES.map((mode) => (
          <SelectItem
            key={mode.value}
            value={mode.value}
            className="cursor-pointer focus:bg-secondary"
          >
            <div className="flex items-center gap-2">
              {mode.icon}
              <div>
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs text-muted-foreground">{mode.description}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
