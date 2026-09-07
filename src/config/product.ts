import type { SpeechMode } from '../shared/contracts';

export const MAX_HAN_CHARACTERS = 8;
export const CONTEXT_RADIUS = 32;
export const POPOVER_TIMEOUT_MS = 12_000;
export const EMPTY_MESSAGE_TIMEOUT_MS = 3_000;
export const SPEECH_RATE = 0.85;

// Cross-platform pinyin speech has not yet passed the manual listening gate.
// The fallback speaks only the selected Chinese target; surrounding text is used
// exclusively for pinyin disambiguation and is never included in speech output.
export const DEFAULT_SPEECH_MODE: SpeechMode = 'sourceContext';
