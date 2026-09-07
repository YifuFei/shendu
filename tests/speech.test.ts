import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSpeechController } from '../src/runtime/speech';

function setup(initial: SpeechSynthesisVoice[]) {
  let voices = initial;
  const synth = Object.assign(new EventTarget(), {
    getVoices: () => voices, cancel: vi.fn(), speak: vi.fn(),
  });
  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });
  return { synth, setVoices(next: SpeechSynthesisVoice[]) {
    voices = next;
    synth.dispatchEvent(new Event('voiceschanged'));
  } };
}
const voice = (lang: string, localService: boolean) => ({ lang, localService }) as SpeechSynthesisVoice;
afterEach(() => vi.unstubAllGlobals());

describe('offline speech', () => {
  it('rejects remote voices and never falls back to the browser default', () => {
    const { synth } = setup([voice('zh-CN', false), voice('en-US', true)]);
    const controller = createSpeechController();
    expect(controller.available).toBe(false);
    expect(controller.speak('水')).toBe(false);
    expect(synth.speak).not.toHaveBeenCalled();
  });
  it('prefers local zh-CN and sends only the requested text', () => {
    const preferred = voice('zh-CN', true);
    const { synth } = setup([voice('zh-CN', false), voice('zh-TW', true), preferred]);
    const controller = createSpeechController();
    controller.speak('水');
    expect(synth.cancel).toHaveBeenCalledOnce();
    expect(synth.speak).toHaveBeenCalledWith(expect.objectContaining({ text: '水', voice: preferred }));
  });
  it('handles delayed local voices, disappearance, and subscription cleanup', () => {
    const { synth, setVoices } = setup([]);
    const controller = createSpeechController();
    const update = vi.fn();
    const unsubscribe = controller.subscribe?.(update);
    expect(controller.available).toBe(false);
    setVoices([voice('zh-TW', true)]);
    expect(controller.available).toBe(true);
    expect(update).toHaveBeenCalledOnce();
    controller.speak('銀行');
    expect(synth.speak).toHaveBeenCalledOnce();
    setVoices([]);
    expect(controller.speak('水')).toBe(false);
    expect(synth.speak).toHaveBeenCalledOnce();
    unsubscribe?.();
    setVoices([]);
    expect(update).toHaveBeenCalledTimes(2);
  });
});
