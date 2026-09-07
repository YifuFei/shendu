import { SPEECH_RATE } from '../config/product';

export interface SpeechController {
  available: boolean;
  speak(text: string): boolean | void;
  subscribe?(listener: () => void): () => void;
}

function chooseChineseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const local = voices.filter((voice) => voice.localService === true);
  return (
    local.find((voice) => voice.lang.toLowerCase().replaceAll('_', '-') === 'zh-cn') ??
    local.find((voice) => /^zh(?:-|$)/iu.test(voice.lang.replaceAll('_', '-')))
  );
}

export function createSpeechController(): SpeechController {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    return {
      available: false,
      speak() {},
    };
  }

  return {
    get available() {
      return chooseChineseVoice(window.speechSynthesis.getVoices()) !== undefined;
    },
    subscribe(listener) {
      window.speechSynthesis.addEventListener('voiceschanged', listener);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', listener);
    },
    speak(text: string) {
      window.speechSynthesis.cancel();
      const voice = chooseChineseVoice(window.speechSynthesis.getVoices());
      // Never delegate to the browser default: it may be a remote service.
      if (voice === undefined || text.trim().length === 0) return false;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice.lang;
      utterance.rate = SPEECH_RATE;

      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
      return true;
    },
  };
}
