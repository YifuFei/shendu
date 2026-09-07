import { MAX_HAN_CHARACTERS } from '../config/product';

const HAN_PATTERN = /\p{Script=Han}/u;

export function isHan(character: string): boolean {
  return HAN_PATTERN.test(character);
}

export function extractHan(text: string, limit = Number.POSITIVE_INFINITY): string[] {
  const result: string[] = [];

  for (const character of text.normalize('NFC')) {
    if (isHan(character)) {
      result.push(character);
      if (result.length >= limit) {
        break;
      }
    }
  }

  return result;
}

export function countHan(text: string): number {
  return extractHan(text).length;
}

export function targetHan(text: string): string[] {
  return extractHan(text, MAX_HAN_CHARACTERS);
}

export function takeLastCodePoints(text: string, count: number): string {
  return [...text].slice(-count).join('');
}

export function takeFirstCodePoints(text: string, count: number): string {
  return [...text].slice(0, count).join('');
}

export function normalizeSelection(text: string): string {
  return text.normalize('NFC').replace(/\s+/gu, ' ').trim();
}

export function adjacentHanBefore(text: string, limit: number): string {
  const characters = [...text.normalize('NFC')];
  const result: string[] = [];

  for (let index = characters.length - 1; index >= 0 && result.length < limit; index -= 1) {
    const character = characters[index];
    if (character === undefined || !isHan(character)) {
      break;
    }
    result.unshift(character);
  }

  return result.join('');
}

export function adjacentHanAfter(text: string, limit: number): string {
  const result: string[] = [];

  for (const character of text.normalize('NFC')) {
    if (!isHan(character) || result.length >= limit) {
      break;
    }
    result.push(character);
  }

  return result.join('');
}
