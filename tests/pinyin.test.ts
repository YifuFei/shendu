import { describe, expect, it } from 'vitest';

import { buildPinyinResult } from '../src/core/pinyin';
import type { SelectionSnapshot } from '../src/shared/contracts';

function snapshot(selectedText: string, prefix = '', suffix = ''): SelectionSnapshot {
  return {
    selectedText,
    prefix,
    suffix,
    rect: null,
    contextQuality: prefix.length > 0 || suffix.length > 0 ? 'dom' : 'selectionOnly',
  };
}

describe('contextual pinyin', () => {
  it.each([
    ['重庆', 'chóng qìng'],
    ['银行', 'yín háng'],
    ['行长', 'háng zhǎng'],
    ['行走', 'xíng zǒu'],
    ['长大', 'zhǎng dà'],
    ['长江', 'cháng jiāng'],
    ['音乐', 'yīn yuè'],
    ['快乐', 'kuài lè'],
  ])('converts %s to %s', (text, expected) => {
    expect(buildPinyinResult(snapshot(text))?.displayPinyin).toBe(expected);
  });

  it('uses surrounding context when a single polyphonic character is selected', () => {
    const result = buildPinyinResult(snapshot('行', '这家银', '今天营业'));
    expect(result?.displayPinyin).toBe('háng');
    expect(result?.speechText).toBe('行');
  });

  it('never includes pronunciation context in speech output', () => {
    const result = buildPinyinResult(snapshot('水', '武则天，名曌，并州文', '人，早年为唐太宗才人'));
    expect(result?.displayPinyin).toBe('shuǐ');
    expect(result?.speechText).toBe('水');
  });

  it('handles traditional characters and numeric tones', () => {
    const result = buildPinyinResult(snapshot('銀行'));
    expect(result?.displayPinyin).toBe('yín háng');
    expect(result?.numericPinyin).toBe('yin2 hang2');
  });

  it('returns null for selections without Han characters', () => {
    expect(buildPinyinResult(snapshot('hello 2026'))).toBeNull();
  });

  it('keeps only the first eight Han characters', () => {
    const result = buildPinyinResult(snapshot('中华人民共和国国家通用语言文字'));
    expect(result?.sourceText).toHaveLength(8);
    expect(result?.displayPinyin.split(' ')).toHaveLength(8);
  });
});
