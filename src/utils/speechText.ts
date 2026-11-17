export const MAX_CLIENT_TTS_CHARS = 1500;

const POS_PARENS_RE = /\(\s*(?:n|v|adj|adv|prep|conj|pron|interj|det|phr|v\.i|v\.t|n\/v|adj\/adv)(?:[.,/\s]+(?:n|v|adj|adv|prep|conj|pron|phr))*\s*\.?\s*\)/gi;
const POS_BRACKETS_RE = /\[\s*(?:n|v|adj|adv|prep|conj|pron|phr|C|U)[^[\]]{0,12}\]/gi;

const ABBREVIATIONS = [
  'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Jr.', 'Sr.',
  'vs.', 'etc.', 'e.g.', 'i.e.', 'U.S.', 'U.K.', 'E.U.',
  'a.m.', 'p.m.', 'A.M.', 'P.M.',
  'No.', 'St.', 'Ave.', 'Blvd.', 'Rd.', 'Dept.', 'Corp.', 'Co.', 'Inc.', 'Ltd.', 'Fig.',
];

const DOT_PLACEHOLDER = '\uE000';

export function cleanSpeechText(raw: string): string {
  if (!raw) return '';
  const cleaned = raw
    .replace(/\/[^/\r\n]{1,60}\//g, ' ')        // Strip IPA phonetic transcriptions like /əˈkɑː.mə.deɪt/
    .replace(POS_PARENS_RE, ' ')                 // Strip grammatical POS annotations like (v), (adj), (n/v)
    .replace(POS_BRACKETS_RE, ' ')               // Strip [v], [n], [C], [U]
    .replace(/•.*$/gm, ' ')                      // Strip trailing bullet notes
    .replace(/^[\s"'“”‘’«»]+|[\s"'“”‘’«»]+$/g, '') // Strip enclosing quotes
    .replace(/_{2,}/g, 'blank')                  // Replace fill-in-the-blank ___ with spoken "blank"
    .replace(/[\r\n\t]+/g, ' ')                  // Normalize linebreaks
    .replace(/\s+/g, ' ')                        // Collapse consecutive spaces
    .trim();

  return cleaned.length > MAX_CLIENT_TTS_CHARS
    ? cleaned.slice(0, MAX_CLIENT_TTS_CHARS).trim()
    : cleaned;
}

export function isSentenceText(cleanText: string): boolean {
  return cleanText.includes(' ') || cleanText.length > 25;
}

function maskDots(text: string): string {
  let masked = text;
  for (const abbr of ABBREVIATIONS) {
    const escaped = abbr.replace(/\./g, '\\.');
    masked = masked.replace(new RegExp(`\\b${escaped}`, 'g'), abbr.replace(/\./g, DOT_PLACEHOLDER));
  }
  // Mask decimal numbers like 3.5 or 12.50
  masked = masked.replace(/(\d)\.(\d)/g, `$1${DOT_PLACEHOLDER}$2`);
  // Mask initials like J. K. or U.S.A.
  masked = masked.replace(/\b([A-Z])\.(?=\s*[A-Z]\.)/g, `$1${DOT_PLACEHOLDER}`);
  return masked;
}

function unmaskDots(text: string): string {
  return text.split(DOT_PLACEHOLDER).join('.');
}

/**
 * Splits long paragraphs at true sentence boundaries without breaking
 * abbreviations ("Mr.", "U.S.", "a.m.") or decimal numbers ("3.5%").
 * Keeps the first chunk concise so playback begins with near-zero synthesis latency.
 */
export function splitSpeechSegments(cleanText: string, maxLen: number = 260): string[] {
  const trimmed = cleanText.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLen) return [trimmed];

  const masked = maskDots(trimmed);
  const rawSentences = masked
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“'(])/)
    .map((s) => unmaskDots(s).trim())
    .filter(Boolean);

  if (rawSentences.length <= 1) {
    // Single very long run-on clause: split gently on semicolons/commas if > maxLen
    if (trimmed.length <= maxLen) return [trimmed];
    const parts = trimmed.split(/(?<=[;,:])\s+/);
    const packed: string[] = [];
    let current = '';
    for (const part of parts) {
      if (!current) {
        current = part;
      } else if (current.length + 1 + part.length <= maxLen) {
        current += ' ' + part;
      } else {
        packed.push(current);
        current = part;
      }
    }
    if (current) packed.push(current);
    return packed;
  }

  const segments: string[] = [];
  let current = '';
  const firstCap = Math.min(maxLen, 180);

  for (const sentence of rawSentences) {
    const limit = segments.length === 0 ? firstCap : maxLen;
    if (!current) {
      current = sentence;
    } else if (current.length + 1 + sentence.length <= limit) {
      current += ' ' + sentence;
    } else {
      segments.push(current);
      current = sentence;
    }
  }
  if (current) segments.push(current);

  return segments;
}
