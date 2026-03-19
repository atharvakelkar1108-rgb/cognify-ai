import { SimplificationLevel } from '@/types/reading';

export interface SimplifyResult {
  original: string;
  simplified: string;
  level: SimplificationLevel;
  changesCount: number;
}

export async function simplifyText(
  text: string,
  level: SimplificationLevel
): Promise<SimplifyResult> {
    const API_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_URL}/simplify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence: text, level: level }),
  });

  if (!response.ok) throw new Error('Failed to simplify text');

  const data = await response.json();
  const simplified = data.simplified;
  const changesCount = countDifferences(text, simplified);

  return {
    original: text,
    simplified,
    level,
    changesCount,
  };
}

function countDifferences(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/);
  const wordsB = b.toLowerCase().split(/\s+/);
  let diffs = 0;
  const maxLen = Math.max(wordsA.length, wordsB.length);
  for (let i = 0; i < maxLen; i++) {
    if (wordsA[i] !== wordsB[i]) diffs++;
  }
  return diffs;
}