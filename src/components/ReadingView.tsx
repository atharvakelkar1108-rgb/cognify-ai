import { useCallback, useEffect, useRef, useState } from 'react';
import { ReadingSettings, FONT_FAMILY_MAP, SimplificationLevel } from '@/types/reading';
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker';
import { simplifyText, SimplifyResult } from '@/services/simplifyService';
import { Loader2, Sparkles, X, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingViewProps {
  text: string;
  settings: ReadingSettings;
  onBehaviorUpdate?: (difficultParagraphs: number[]) => void;
  showHeatmap?: boolean;
}

const ReadingView = ({ text, settings, onBehaviorUpdate, showHeatmap = false }: ReadingViewProps) => {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  const [focusedLine, setFocusedLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { initBehaviors, handleScroll, difficultParagraphs } = useBehaviorTracker(paragraphs.length);

  const [simplifications, setSimplifications] = useState<Map<number, SimplifyResult>>(new Map());
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [showSideBySide, setShowSideBySide] = useState<Set<number>>(new Set());

  useEffect(() => {
    initBehaviors(paragraphs.length);
  }, [paragraphs.length, initBehaviors]);

  useEffect(() => {
    onBehaviorUpdate?.(difficultParagraphs);
  }, [difficultParagraphs, onBehaviorUpdate]);

  useEffect(() => {
    setSimplifications(new Map());
    setShowSideBySide(new Set());
  }, [settings.simplificationLevel]);

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    handleScroll(containerRef.current);

    if (settings.focusMode) {
      const paragraphEls = containerRef.current.querySelectorAll('[data-paragraph-index]');
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;

      let closest = 0;
      let minDist = Infinity;
      paragraphEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - centerY);
        const idx = parseInt(el.getAttribute('data-paragraph-index') || '0');
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });
      setFocusedLine(closest);
    }
  }, [handleScroll, settings.focusMode]);

  const handleParagraphClick = useCallback(async (index: number, paragraphText: string) => {
    const isDifficult = difficultParagraphs.includes(index);

    if (!isDifficult) {
      toast.info('This paragraph hasn\'t been flagged as difficult yet. Keep reading — difficult sections will be detected based on your behavior.');
      return;
    }

    if (simplifications.has(index)) {
      setShowSideBySide(prev => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
      return;
    }

    setLoadingIndex(index);
    try {
      const result = await simplifyText(paragraphText, settings.simplificationLevel);
      setSimplifications(prev => new Map(prev).set(index, result));
      setShowSideBySide(prev => new Set(prev).add(index));

      if (result.changesCount === 0) {
        toast.info('This text is already simple at this level.');
      } else {
        toast.success(`Simplified with ${result.changesCount} changes (${settings.simplificationLevel} level)`);
      }
    } catch {
      toast.error('Failed to simplify text. Please try again.');
    } finally {
      setLoadingIndex(null);
    }
  }, [difficultParagraphs, simplifications, settings.simplificationLevel]);

  const dismissSimplification = useCallback((index: number) => {
    setShowSideBySide(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    setSimplifications(prev => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const fontClass = FONT_FAMILY_MAP[settings.fontFamily];
  const isDifficult = (index: number) => difficultParagraphs.includes(index);
  const isSimplified = (index: number) => simplifications.has(index) && showSideBySide.has(index);

  const getHeatmapColor = (index: number) => {
    if (!showHeatmap) return '';
    if (difficultParagraphs.includes(index))
      return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20';
    return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20';
  };

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-y-auto rounded-lg border border-border bg-card p-6 md:p-10 animate-fade-in"
      style={{ maxHeight: '70vh' }}
    >
      {/* Heatmap Legend */}
      {showHeatmap && (
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-accent/50 text-xs">
          <span className="font-medium">Heatmap:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Easy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Difficult</span>
          </div>
        </div>
      )}

      <div className={`${fontClass} max-w-prose mx-auto space-y-4`}>
        {paragraphs.map((paragraph, index) => {
          const isFocused = settings.focusMode && focusedLine === index;
          const isDimmed = settings.focusMode && focusedLine !== index;
          const difficult = isDifficult(index);
          const simplified = simplifications.get(index);
          const showingComparison = isSimplified(index);
          const isLoading = loadingIndex === index;

          return (
            <div key={index} data-paragraph-index={index} className="group">
              {showingComparison && simplified ? (
                <div
                  className={`rounded-lg border border-primary/20 overflow-hidden transition-all duration-300
                    ${isFocused ? 'focus-line-highlight' : ''}
                    ${isDimmed ? 'opacity-25' : 'opacity-100'}
                    ${getHeatmapColor(index)}
                  `}
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-accent/50 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-medium text-accent-foreground">
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>Original vs Simplified ({simplified.level})</span>
                      <span className="text-muted-foreground">· {simplified.changesCount} changes</span>
                    </div>
                    <button
                      onClick={() => dismissSimplification(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                    <div className="p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Original</p>
                      <p
                        className="text-muted-foreground line-through decoration-destructive/30"
                        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
                      >
                        {paragraph.trim()}
                      </p>
                    </div>
                    <div className="p-4 bg-accent/20">
                      <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">Simplified</p>
                      <p
                        className="text-foreground"
                        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
                      >
                        {simplified.simplified}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p
                  onClick={() => handleParagraphClick(index, paragraph.trim())}
                  className={`
                    rounded px-3 py-2 transition-all duration-300
                    ${getHeatmapColor(index)}
                    ${isFocused ? 'focus-line-highlight' : ''}
                    ${isDimmed ? 'opacity-25' : 'opacity-100'}
                    ${difficult ? 'difficulty-high cursor-pointer hover:ring-2 hover:ring-primary/30' : ''}
                    ${!difficult ? 'cursor-default' : ''}
                    ${isLoading ? 'animate-pulse' : ''}
                  `}
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineSpacing,
                  }}
                >
                  {isLoading && (
                    <span className="inline-flex items-center gap-1 mr-2 text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                  )}
                  {difficult && !isLoading && !simplifications.has(index) && (
                    <span className="inline-flex items-center gap-1 mr-1.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                  )}
                  {paragraph.trim()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {paragraphs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            {paragraphs.length} paragraphs · {difficultParagraphs.length} flagged as difficult · {simplifications.size} simplified
          </p>
          {difficultParagraphs.length > 0 && (
            <p className="text-xs text-primary">
              Click any highlighted paragraph to simplify it
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingView;