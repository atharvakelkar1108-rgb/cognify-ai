import { useCallback, useRef, useState } from 'react';
import { ParagraphBehavior } from '@/types/reading';

const PAUSE_THRESHOLD_MS = 2000;
const BACKTRACK_THRESHOLD_PX = 50;
const DIFFICULTY_PAUSE_THRESHOLD = 5000;
const DIFFICULTY_BACKTRACK_THRESHOLD = 3;

export function useBehaviorTracker(paragraphCount: number) {
  const [behaviors, setBehaviors] = useState<ParagraphBehavior[]>([]);
  const [difficultParagraphs, setDifficultParagraphs] = useState<number[]>([]);

  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paragraphTimers = useRef<Map<number, number>>(new Map());
  const behaviorsRef = useRef<Map<number, ParagraphBehavior>>(new Map());

  const initBehaviors = useCallback((count: number) => {
    behaviorsRef.current = new Map();
    for (let i = 0; i < count; i++) {
      behaviorsRef.current.set(i, {
        paragraphIndex: i,
        timeSpent: 0,
        pauseCount: 0,
        totalPauseDuration: 0,
        backtrackCount: 0,
        scrollSpeed: 0,
      });
    }
  }, []);

  const getVisibleParagraph = useCallback((container: HTMLElement): number => {
    const paragraphs = container.querySelectorAll('[data-paragraph-index]');
    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    let closest = 0;
    let minDist = Infinity;

    paragraphs.forEach((p) => {
      const rect = p.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - centerY);
      const idx = parseInt(p.getAttribute('data-paragraph-index') || '0');
      if (dist < minDist) {
        minDist = dist;
        closest = idx;
      }
    });

    return closest;
  }, []);

  const handleScroll = useCallback((container: HTMLElement) => {
    const now = Date.now();
    const scrollY = container.scrollTop;
    const deltaY = scrollY - lastScrollY.current;
    const deltaTime = now - lastScrollTime.current;

    const visibleParagraph = getVisibleParagraph(container);
    const behavior = behaviorsRef.current.get(visibleParagraph);

    if (behavior) {
      // Track backtracking
      if (deltaY < -BACKTRACK_THRESHOLD_PX) {
        behavior.backtrackCount++;
      }

      // Track scroll speed
      if (deltaTime > 0) {
        const speed = Math.abs(deltaY) / (deltaTime / 1000);
        behavior.scrollSpeed = (behavior.scrollSpeed + speed) / 2;
      }

      // Track time spent
      const prevParagraph = paragraphTimers.current.get(visibleParagraph);
      if (prevParagraph) {
        behavior.timeSpent += now - prevParagraph;
      }
      paragraphTimers.current.set(visibleParagraph, now);

      behaviorsRef.current.set(visibleParagraph, behavior);
    }

    // Detect pauses
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      const b = behaviorsRef.current.get(visibleParagraph);
      if (b) {
        b.pauseCount++;
        b.totalPauseDuration += PAUSE_THRESHOLD_MS;
        behaviorsRef.current.set(visibleParagraph, b);
        updateDifficulty();
      }
    }, PAUSE_THRESHOLD_MS);

    lastScrollY.current = scrollY;
    lastScrollTime.current = now;
  }, [getVisibleParagraph]);

  const updateDifficulty = useCallback(() => {
    const difficult: number[] = [];
    behaviorsRef.current.forEach((b, idx) => {
      if (
        b.totalPauseDuration > DIFFICULTY_PAUSE_THRESHOLD ||
        b.backtrackCount >= DIFFICULTY_BACKTRACK_THRESHOLD ||
        (b.timeSpent > 10000 && b.scrollSpeed < 20)
      ) {
        difficult.push(idx);
      }
    });
    setDifficultParagraphs(difficult);
  }, []);

  const getSnapshot = useCallback((): ParagraphBehavior[] => {
    updateDifficulty();
    return Array.from(behaviorsRef.current.values());
  }, [updateDifficulty]);

  return {
    behaviors,
    difficultParagraphs,
    initBehaviors,
    handleScroll,
    getSnapshot,
  };
}
