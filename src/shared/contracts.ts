export type ContextQuality = 'dom' | 'selectionOnly';

export type SpeechMode = 'symbolPinyin' | 'numericPinyin' | 'sourceContext';

export interface ShowPinyinRequest {
  requestId: string;
  selectionText: string;
  frameId: number;
}

export interface ViewportRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface SelectionSnapshot {
  selectedText: string;
  prefix: string;
  suffix: string;
  rect: ViewportRect | null;
  contextQuality: ContextQuality;
}

export interface PinyinResult {
  sourceText: string;
  displayPinyin: string;
  numericPinyin: string;
  speechText: string;
  contextQuality: ContextQuality;
}

export interface RuntimePingMessage {
  type: 'SHENDU_RUNTIME_PING';
}

export interface RuntimeShowMessage {
  type: 'SHENDU_SHOW_PINYIN';
  request: ShowPinyinRequest;
}

export type RuntimeMessage = RuntimePingMessage | RuntimeShowMessage;
