import { useCallback, useEffect, useRef, useState } from 'react';
import { ReadingSettings, FONT_FAMILY_MAP } from '@/types/reading';
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker';

interface ReadingViewProps {
  text: string;
  settings: ReadingSettings;
  onBehaviorUpdate?: (difficultParagraphs: number[]) => void;
}

const ReadingView = ({ text, settings, onBehaviorUpdate }: ReadingViewProps) => {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  const [focusedLine, setFocusedLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { initBehaviors, handleScroll, difficultParagraphs, getSnapshot } = useBehaviorTracker(paragraphs.length);

  useEffect(() => {
    initBehaviors(paragraphs.length);
  }, [paragraphs.length, initBehaviors]);

  useEffect(() => {
    onBehaviorUpdate?.(difficultParagraphs);
  }, [difficultParagraphs, onBehaviorUpdate]);

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

  const fontClass = FONT_FAMILY_MAP[settings.fontFamily];

  const getDifficultyClass = (index: number) => {
    if (!difficultParagraphs.includes(index)) return '';
    return 'difficulty-high';
  };

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-y-auto rounded-lg border border-border bg-card p-6 md:p-10 animate-fade-in"
      style={{ maxHeight: '70vh' }}
    >
      <div className={`${fontClass} max-w-prose mx-auto space-y-4`}>
        {paragraphs.map((paragraph, index) => {
          const isFocused = settings.focusMode && focusedLine === index;
          const isDimmed = settings.focusMode && focusedLine !== index;

          return (
            <p
              key={index}
              data-paragraph-index={index}
              className={`
                rounded px-3 py-2 transition-all duration-300
                ${isFocused ? 'focus-line-highlight' : ''}
                ${isDimmed ? 'opacity-25' : 'opacity-100'}
                ${getDifficultyClass(index)}
              `}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineSpacing,
              }}
            >
              {paragraph.trim()}
            </p>
          );
        })}
      </div>

      {paragraphs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {paragraphs.length} paragraphs · {difficultParagraphs.length} flagged as difficult
          </p>
        </div>
      )}
    </div>
  );
};

export default ReadingView;
