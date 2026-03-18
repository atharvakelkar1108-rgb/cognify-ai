import { ParagraphBehavior } from '@/types/reading';
import { BarChart3, AlertTriangle, Clock, ArrowUpDown } from 'lucide-react';

interface BehaviorPanelProps {
  difficultParagraphs: number[];
  totalParagraphs: number;
}

const BehaviorPanel = ({ difficultParagraphs, totalParagraphs }: BehaviorPanelProps) => {
  if (totalParagraphs === 0) return null;

  const difficultyPercent = totalParagraphs > 0
    ? Math.round((difficultParagraphs.length / totalParagraphs) * 100)
    : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Reading Insights
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-background p-3 text-center">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totalParagraphs}</p>
          <p className="text-xs text-muted-foreground">Paragraphs</p>
        </div>

        <div className="rounded-md bg-background p-3 text-center">
          <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{difficultParagraphs.length}</p>
          <p className="text-xs text-muted-foreground">Difficult</p>
        </div>
      </div>

      {difficultParagraphs.length > 0 && (
        <div className="rounded-md bg-difficulty-high border-l-2 border-destructive p-3">
          <p className="text-sm font-medium text-foreground mb-1">
            {difficultyPercent}% of text flagged
          </p>
          <p className="text-xs text-muted-foreground">
            Paragraphs {difficultParagraphs.map(i => i + 1).join(', ')} show signs of difficulty
            (long pauses, backtracking, or slow reading).
          </p>
        </div>
      )}

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>Tracking: pause duration, time per paragraph</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3 w-3" />
          <span>Tracking: scroll speed, backtracking behavior</span>
        </div>
      </div>
    </div>
  );
};

export default BehaviorPanel;
