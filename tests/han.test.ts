import { describe, expect, it } from 'vitest';

import {
  adjacentHanAfter,
  adjacentHanBefore,
  countHan,
  extractHan,
  normalizeSelection,
  targetHan,
} from '../src/core/han';

describe('Han text helpers', () => {
  it('extracts simplified and traditional Han characters from mixed text', () => {
    expect(extractHan('Hello，重慶 2026！')).toEqual(['重', '慶']);
    expect(countHan('銀行 bank')).toBe(2);
  });

  it('limits the target to the first eight Han characters', () => {
    expect(targetHan('A中华人民共和国国家通用语言文字').join('')).toBe('中华人民共和国国');
    expect(targetHan('中华人民共和国国家通用语言文字')).toHaveLength(8);
  });

  it('normalizes whitespace without changing Han characters', () => {
    expect(normalizeSelection('  重\n\t庆  ')).toBe('重 庆');
  });

  it('reads only immediately adjacent Han context', () => {
    expect(adjacentHanBefore('这家银', 2)).toBe('家银');
    expect(adjacentHanBefore('这家银，', 2)).toBe('');
    expect(adjacentHanAfter('今天营业', 2)).toBe('今天');
    expect(adjacentHanAfter('，今天', 2)).toBe('');
  });
});
