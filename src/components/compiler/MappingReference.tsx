import { getMappingTable } from '@/lib/compiler';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

/**
 * Reference panel showing the cipher mapping table
 */
export function MappingReference() {
  const [isOpen, setIsOpen] = useState(false);
  const { letters, numbers } = getMappingTable();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="glass-panel rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-left">
        <span className="text-sm font-medium text-foreground">Cipher Mapping Reference</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-4 animate-fade-in">
          {/* Letter Mappings */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Letter Mapping (ROT13)
            </h4>
            <div className="grid grid-cols-13 gap-1">
              {Object.entries(letters).map(([from, to]) => (
                <div
                  key={from}
                  className="flex flex-col items-center p-1.5 rounded bg-secondary/50 font-mono text-xs"
                >
                  <span className="text-foreground">{from}</span>
                  <span className="text-primary text-[10px]">↓</span>
                  <span className="text-primary">{to}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Number Mappings */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Number Mapping
            </h4>
            <div className="flex gap-1 flex-wrap">
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <div
                  key={num}
                  className="flex flex-col items-center p-1.5 rounded bg-secondary/50 font-mono text-xs min-w-[28px]"
                >
                  <span className="text-foreground">{num}</span>
                  <span className="text-accent text-[10px]">↓</span>
                  <span className="text-accent">{numbers[num] || num}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Numbers 0 and 7 remain unchanged
            </p>
          </div>

          {/* Range Examples */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Range Expansion Examples
            </h4>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-secondary text-foreground">A-&gt;E</code>
                <span className="text-muted-foreground">→</span>
                <code className="px-2 py-1 rounded bg-primary/20 text-primary">ABCDE</code>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-secondary text-foreground">Z-&gt;V</code>
                <span className="text-muted-foreground">→</span>
                <code className="px-2 py-1 rounded bg-primary/20 text-primary">ZYXWV</code>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-secondary text-foreground">1-&gt;5</code>
                <span className="text-muted-foreground">→</span>
                <code className="px-2 py-1 rounded bg-primary/20 text-primary">12345</code>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
