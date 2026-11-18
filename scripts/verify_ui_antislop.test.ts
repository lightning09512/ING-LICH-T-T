import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Personal avatar /app-icon.png is preserved in TitleScreen and Navbar', () => {
  const title = fs.readFileSync('src/components/TitleScreen.tsx', 'utf8');
  const nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
  assert.ok(title.includes('/app-icon.png'), 'TitleScreen must keep /app-icon.png');
  assert.ok(nav.includes('/app-icon.png'), 'Navbar must keep /app-icon.png');
});

test('All 4 hand-drawn mascot stickers exist in public/doodles and are non-empty', () => {
  for (const name of ['mascot-study.png', 'mascot-streak.png', 'mascot-hearts.png', 'mascot-victory.png']) {
    const p = path.resolve('public/doodles', name);
    assert.ok(fs.existsSync(p), `Missing ${name}`);
    assert.ok(fs.statSync(p).size > 2000, `${name} appears empty`);
  }
});

test('AI-slop emoji density across all core, study, and exam screens is dramatically reduced (<= 10 total across 17 screens)', () => {
  const targets = [
    'TitleScreen.tsx',
    'MenuScreen.tsx',
    'StreakModal.tsx',
    'HeartsModal.tsx',
    'AccountModal.tsx',
    'ToeicSwSelectScreen.tsx',
    'TestSelectScreen.tsx',
    'GrammarScreen.tsx',
    'VocabGameMap.tsx',
    'LearnVocabScreen.tsx',
    'RankedExamScreen.tsx',
    'ReviewSurvivalScreen.tsx',
    'ToeicSpeakingRevisionScreen.tsx',
    'ToeicWritingRevisionScreen.tsx',
    'ToeicExamScreen.tsx',
    'ToeicSpeakingExamScreen.tsx',
    'ToeicWritingExamScreen.tsx',
  ];
  let totalEmojis = 0;
  const breakdown: string[] = [];
  for (const f of targets) {
    const src = fs.readFileSync(path.resolve('src/components', f), 'utf8');
    const matches = src.match(/\p{Extended_Pictographic}/gu) || [];
    if (matches.length > 0) {
      breakdown.push(`${f}:${matches.length}(${[...new Set(matches)].join('')})`);
    }
    totalEmojis += matches.length;
  }
  assert.ok(
    totalEmojis <= 10,
    `Expected <= 10 emojis across 17 screens, found ${totalEmojis}: ${breakdown.join(', ')}`
  );
});
