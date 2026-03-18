export type FontFamily = 'reading' | 'dyslexic' | 'hyperlegible';
export type SimplificationLevel = 'easy' | 'medium' | 'hard';

export interface ReadingSettings {
  fontSize: number;
  lineSpacing: number;
  fontFamily: FontFamily;
  focusMode: boolean;
  simplificationLevel: SimplificationLevel;
}

export interface ParagraphBehavior {
  paragraphIndex: number;
  timeSpent: number; // ms
  pauseCount: number;
  totalPauseDuration: number; // ms
  backtrackCount: number;
  scrollSpeed: number; // px/s average
}

export interface ReadingSession {
  id: string;
  startTime: number;
  textPreview: string;
  paragraphBehaviors: ParagraphBehavior[];
  settings: ReadingSettings;
  difficultParagraphs: number[]; // indices
}

export const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  lineSpacing: 1.8,
  fontFamily: 'reading',
  focusMode: false,
  simplificationLevel: 'medium',
};

export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  reading: 'font-reading',
  dyslexic: 'font-dyslexic',
  hyperlegible: 'font-hyperlegible',
};

export const FONT_LABELS: Record<FontFamily, string> = {
  reading: 'Lexend',
  dyslexic: 'OpenDyslexic',
  hyperlegible: 'Atkinson Hyperlegible',
};
