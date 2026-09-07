import { afterEach, expect, it, vi } from 'vitest';
import { createPopoverController } from '../src/runtime/popover';
import { createSpeechController } from '../src/runtime/speech';

afterEach(() => {
  vi.unstubAllGlobals();
  document.querySelectorAll('shendu-pinyin-popover-host').forEach((host) => host.remove());
});

it('enables an already open popover when a local voice loads and cleans up when closed', () => {
  let voices: SpeechSynthesisVoice[] = [];
  const synth = Object.assign(new EventTarget(), { getVoices: () => voices });
  const removeListener = vi.spyOn(synth, 'removeEventListener');
  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', class {});
  const popover = createPopoverController({
    appName: 'Shendu', noChinese: 'No Chinese', speak: 'Speak', speechUnavailable: 'No local Chinese voice',
  }, createSpeechController());
  popover.showResult({ sourceText: '水', displayPinyin: 'shuǐ', numericPinyin: 'shui3', speechText: '水', contextQuality: 'dom' }, null);
  const shadow = document.querySelector('shendu-pinyin-popover-host')?.shadowRoot;
  const button = shadow?.querySelector('button');
  expect(button?.disabled).toBe(true);
  expect(shadow?.textContent).toContain('No local Chinese voice');
  voices = [{ lang: 'zh-CN', localService: true } as SpeechSynthesisVoice];
  synth.dispatchEvent(new Event('voiceschanged'));
  expect(button?.disabled).toBe(false);
  expect(button?.getAttribute('aria-label')).toBe('Speak');
  popover.close();
  expect(removeListener).toHaveBeenCalledWith('voiceschanged', expect.any(Function));
});
