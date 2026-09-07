import traditionalDictionary from '@pinyin-pro/data/traditional';
import { addTraditionalDict, pinyin } from 'pinyin-pro';

import { DEFAULT_SPEECH_MODE } from '../config/product';
import type { PinyinResult, SelectionSnapshot, SpeechMode } from '../shared/contracts';
import { countHan, targetHan } from './han';

addTraditionalDict(traditionalDictionary);

function convertHan(text: string, toneType: 'symbol' | 'num'): string[] {
  return pinyin(text, {
    type: 'array',
    toneType,
    nonZh: 'removed',
    traditional: true,
  });
}

function contextualPinyin(snapshot: SelectionSnapshot, toneType: 'symbol' | 'num'): string[] {
  const desiredCount = targetHan(snapshot.selectedText).length;
  const context = `${snapshot.prefix}${snapshot.selectedText}${snapshot.suffix}`;
  const offset = countHan(snapshot.prefix);
  const converted = convertHan(context, toneType);
  const contextualSlice = converted.slice(offset, offset + desiredCount);

  if (contextualSlice.length === desiredCount) {
    return contextualSlice;
  }

  return convertHan(targetHan(snapshot.selectedText).join(''), toneType);
}

export function buildPinyinResult(
  snapshot: SelectionSnapshot,
  speechMode: SpeechMode = DEFAULT_SPEECH_MODE,
): PinyinResult | null {
  const sourceText = targetHan(snapshot.selectedText).join('');

  if (sourceText.length === 0) {
    return null;
  }

  const displayPinyin = contextualPinyin(snapshot, 'symbol').join(' ');
  const numericPinyin = contextualPinyin(snapshot, 'num').join(' ');
  const speechText =
    speechMode === 'symbolPinyin'
      ? displayPinyin
      : speechMode === 'numericPinyin'
        ? numericPinyin
        : sourceText;

  return {
    sourceText,
    displayPinyin,
    numericPinyin,
    speechText,
    contextQuality: snapshot.contextQuality,
  };
}
