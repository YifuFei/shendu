import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPopoverController } from '../src/runtime/popover';
import type { PinyinResult } from '../src/shared/contracts';

const messages = {
  appName: '慎读',
  noChinese: '选区中没有中文',
  speak: '朗读',
  speechUnavailable: '无法朗读',
};

const result: PinyinResult = {
  sourceText: '重庆',
  displayPinyin: 'chóng qìng',
  numericPinyin: 'chong2 qing4',
  speechText: '重庆',
  contextQuality: 'selectionOnly',
};

beforeEach(() => {
  document.documentElement.querySelectorAll('[data-shendu-extension-host]').forEach((element) => element.remove());
  vi.useFakeTimers();
});

describe('popover', () => {
  it('keeps only one host and speaks the selected result', () => {
    const speak = vi.fn();
    const controller = createPopoverController(messages, { available: true, speak });
    controller.showResult(result, null);
    controller.showResult(result, null);

    const hosts = document.documentElement.querySelectorAll('[data-shendu-extension-host]');
    expect(hosts).toHaveLength(1);
    const button = hosts[0]?.shadowRoot?.querySelector('button');
    expect(button).not.toBeNull();
    button?.click();
    expect(speak).toHaveBeenCalledWith('重庆');
  });

  it('auto-closes the no-Chinese message', () => {
    const controller = createPopoverController(messages, { available: false, speak() {} });
    controller.showNoChinese(null);
    expect(document.documentElement.querySelector('[data-shendu-extension-host]')).not.toBeNull();
    vi.advanceTimersByTime(3_001);
    expect(document.documentElement.querySelector('[data-shendu-extension-host]')).toBeNull();
  });
});
