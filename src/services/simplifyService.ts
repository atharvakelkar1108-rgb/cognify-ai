import { SimplificationLevel } from '@/types/reading';

/**
 * Mock AI simplification service.
 * Replace with real API calls when Lovable Cloud is enabled.
 * 
 * In production, this would call:
 * POST /functions/v1/simplify-text
 * { text: string, level: SimplificationLevel }
 */

const SIMPLIFICATION_RULES: Record<SimplificationLevel, (text: string) => string> = {
  easy: (text) => {
    // Aggressively simplify: short sentences, basic words
    return text
      .replace(/\b(utilize|employ|leverage)\b/gi, 'use')
      .replace(/\b(commence|initiate)\b/gi, 'start')
      .replace(/\b(terminate|conclude|finalize)\b/gi, 'end')
      .replace(/\b(subsequently|consequently|therefore)\b/gi, 'so')
      .replace(/\b(approximately)\b/gi, 'about')
      .replace(/\b(demonstrate|illustrate)\b/gi, 'show')
      .replace(/\b(facilitate)\b/gi, 'help')
      .replace(/\b(implement)\b/gi, 'do')
      .replace(/\b(fundamental|essential)\b/gi, 'key')
      .replace(/\b(numerous)\b/gi, 'many')
      .replace(/\b(sufficient)\b/gi, 'enough')
      .replace(/\b(acquisition)\b/gi, 'getting')
      .replace(/\b(endeavor)\b/gi, 'try')
      .replace(/\b(additional)\b/gi, 'more')
      .replace(/\b(regarding|concerning|pertaining to)\b/gi, 'about')
      .replace(/\b(prior to)\b/gi, 'before')
      .replace(/\b(in order to)\b/gi, 'to')
      .replace(/\b(notwithstanding)\b/gi, 'despite')
      .replace(/\b(ameliorate)\b/gi, 'improve')
      .replace(/\b(elucidate)\b/gi, 'explain')
      .replace(/\b(proliferation)\b/gi, 'spread')
      .replace(/\b(substantiate)\b/gi, 'prove')
      .replace(/\b(cognizant)\b/gi, 'aware')
      .replace(/\b(ubiquitous)\b/gi, 'everywhere')
      .replace(/\b(paradigm)\b/gi, 'model')
      .replace(/\b(methodology)\b/gi, 'method')
      .replace(/\b(infrastructure)\b/gi, 'system')
      .replace(/;/g, '.')
      .replace(/\s*—\s*/g, '. ')
      .split('. ')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.endsWith('.') ? s : s + '.')
      .join(' ');
  },
  medium: (text) => {
    // Moderate simplification: replace complex words, keep structure
    return text
      .replace(/\b(utilize|employ)\b/gi, 'use')
      .replace(/\b(commence)\b/gi, 'begin')
      .replace(/\b(subsequently)\b/gi, 'then')
      .replace(/\b(approximately)\b/gi, 'about')
      .replace(/\b(demonstrate)\b/gi, 'show')
      .replace(/\b(facilitate)\b/gi, 'help')
      .replace(/\b(numerous)\b/gi, 'many')
      .replace(/\b(regarding)\b/gi, 'about')
      .replace(/\b(prior to)\b/gi, 'before')
      .replace(/\b(methodology)\b/gi, 'method')
      .replace(/\b(infrastructure)\b/gi, 'system');
  },
  hard: (text) => {
    // Minimal simplification: only the most complex words
    return text
      .replace(/\b(ameliorate)\b/gi, 'improve')
      .replace(/\b(elucidate)\b/gi, 'explain')
      .replace(/\b(notwithstanding)\b/gi, 'despite')
      .replace(/\b(ubiquitous)\b/gi, 'widespread');
  },
};

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
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 600));

  const simplified = SIMPLIFICATION_RULES[level](text);
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
