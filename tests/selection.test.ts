import { beforeEach, describe, expect, it, vi } from 'vitest';

import { captureSelection } from '../src/runtime/selection';
import type { ShowPinyinRequest } from '../src/shared/contracts';

function request(selectionText: string): ShowPinyinRequest {
  return { requestId: 'request-1', selectionText, frameId: 0 };
}

function selectText(node: Text, start: number, end: number): Range {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  Object.defineProperty(range, 'getBoundingClientRect', {
    value: () => ({ top: 20, right: 80, bottom: 40, left: 60, width: 20, height: 20 }),
  });
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range;
}

beforeEach(() => {
  document.body.replaceChildren();
  window.getSelection()?.removeAllRanges();
});

describe('DOM selection capture', () => {
  it('captures bounded surrounding context and a viewport rectangle', () => {
    const paragraph = document.createElement('p');
    const text = document.createTextNode('这家银行今天正常营业');
    paragraph.append(text);
    document.body.append(paragraph);
    selectText(text, 3, 4);

    const result = captureSelection(request('行'));
    expect(result.contextQuality).toBe('dom');
    expect(result.prefix).toBe('这家银');
    expect(result.suffix).toBe('今天正常营业');
    expect(result.rect?.left).toBe(60);
  });

  it('falls back when the browser selection no longer matches the click payload', () => {
    const text = document.createTextNode('重庆与银行');
    document.body.append(text);
    selectText(text, 0, 2);

    expect(captureSelection(request('银行'))).toMatchObject({
      selectedText: '银行',
      contextQuality: 'selectionOnly',
      rect: null,
    });
  });

  it('excludes contenteditable selections from DOM context analysis', () => {
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    const text = document.createTextNode('重庆');
    editable.append(text);
    document.body.append(editable);
    selectText(text, 0, 2);

    expect(captureSelection(request('重庆')).contextQuality).toBe('selectionOnly');
  });

  it('supports an explicit selection-only fallback', () => {
    const spy = vi.spyOn(window, 'getSelection');
    const result = captureSelection(request('音乐'), true);
    expect(result.contextQuality).toBe('selectionOnly');
    expect(spy).not.toHaveBeenCalled();
  });
});
