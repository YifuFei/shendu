import { EMPTY_MESSAGE_TIMEOUT_MS, POPOVER_TIMEOUT_MS } from '../config/product';
import { normalizeSelection } from '../core/han';
import type { PinyinResult, ViewportRect } from '../shared/contracts';
import type { SpeechController } from './speech';

interface PopoverMessages {
  appName: string;
  noChinese: string;
  speak: string;
  speechUnavailable: string;
}

export interface PopoverController {
  close(): void;
  showResult(result: PinyinResult, rect: ViewportRect | null): void;
  showNoChinese(rect: ViewportRect | null): void;
}

const HOST_ATTRIBUTE = 'data-shendu-extension-host';
const HOST_TAG = 'shendu-pinyin-popover-host';

function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className !== undefined) {
    element.className = className;
  }
  return element;
}

function styleText(): string {
  return `
    :host { all: initial; color-scheme: light dark; }
    *, *::before, *::after { box-sizing: border-box; }
    .card {
      min-width: 176px;
      max-width: min(360px, calc(100vw - 16px));
      padding: 12px 12px 10px;
      border: 1px solid rgba(99, 102, 241, 0.28);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.98);
      color: #172033;
      box-shadow: 0 10px 32px rgba(15, 23, 42, 0.22), 0 2px 8px rgba(15, 23, 42, 0.12);
      font: 14px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: normal;
      text-align: left;
      overflow-wrap: anywhere;
    }
    .source { margin: 0 0 5px; color: #4b5563; font-size: 13px; }
    .row { display: flex; align-items: center; gap: 10px; }
    .pinyin { flex: 1; color: #312e81; font-size: 17px; font-weight: 650; }
    .speak {
      all: unset;
      display: inline-flex;
      width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #eef2ff;
      color: #3730a3;
      cursor: pointer;
      font: 17px/1 system-ui, sans-serif;
    }
    .speak:hover { background: #e0e7ff; }
    .speak:focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; }
    .speak:disabled { cursor: not-allowed; opacity: 0.45; }
    .message { min-width: 150px; color: #374151; }
    @media (prefers-color-scheme: dark) {
      .card { background: rgba(17, 24, 39, 0.98); color: #f8fafc; border-color: rgba(129, 140, 248, 0.42); }
      .source, .message { color: #d1d5db; }
      .pinyin { color: #c7d2fe; }
      .speak { background: #312e81; color: #eef2ff; }
      .speak:hover { background: #3730a3; }
    }
    @media (prefers-reduced-motion: no-preference) {
      .card { animation: shendu-enter 110ms ease-out; }
      @keyframes shendu-enter { from { opacity: 0; transform: translateY(3px) scale(0.985); } }
    }
  `;
}

function placeHost(host: HTMLElement, card: HTMLElement, rect: ViewportRect | null): void {
  const margin = 8;
  const gap = 8;
  const measured = card.getBoundingClientRect();
  let left: number;
  let top: number;

  if (rect === null) {
    left = (window.innerWidth - measured.width) / 2;
    top = window.innerHeight - measured.height - 24;
  } else {
    left = rect.left;
    top = rect.bottom + gap;

    if (top + measured.height > window.innerHeight - margin) {
      top = rect.top - measured.height - gap;
    }
  }

  left = Math.max(margin, Math.min(left, window.innerWidth - measured.width - margin));
  top = Math.max(margin, Math.min(top, window.innerHeight - measured.height - margin));
  host.style.setProperty('left', `${Math.round(left)}px`, 'important');
  host.style.setProperty('top', `${Math.round(top)}px`, 'important');
  host.style.setProperty('visibility', 'visible', 'important');
}

export function createPopoverController(
  messages: PopoverMessages,
  speech: SpeechController,
): PopoverController {
  document
    .querySelectorAll(`${HOST_TAG}[${HOST_ATTRIBUTE}]`)
    .forEach((existingHost) => existingHost.remove());

  let host: HTMLElement | null = null;
  let timer: number | null = null;
  let selectionAtOpen = '';
  let unsubscribeSpeech: (() => void) | undefined;

  function close(): void {
    unsubscribeSpeech?.();
    unsubscribeSpeech = undefined;
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    host?.remove();
    host = null;
  }

  function scheduleClose(timeout: number): void {
    if (timer !== null) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(close, timeout);
  }

  function mount(card: HTMLElement, rect: ViewportRect | null, timeout: number): void {
    close();
    host = document.createElement(HOST_TAG);
    host.setAttribute(HOST_ATTRIBUTE, 'true');
    host.style.setProperty('all', 'initial', 'important');
    host.style.setProperty('display', 'block', 'important');
    host.style.setProperty('position', 'fixed', 'important');
    host.style.setProperty('z-index', '2147483647', 'important');
    host.style.setProperty('visibility', 'hidden', 'important');
    host.style.setProperty('pointer-events', 'auto', 'important');
    host.style.setProperty('margin', '0', 'important');
    host.style.setProperty('padding', '0', 'important');
    host.style.setProperty('transform', 'none', 'important');

    const shadow = host.attachShadow({ mode: 'open' });
    const style = createElement('style');
    style.textContent = styleText();
    shadow.append(style, card);
    document.documentElement.append(host);
    placeHost(host, card, rect);
    selectionAtOpen = normalizeSelection(window.getSelection()?.toString() ?? '');
    scheduleClose(timeout);
  }

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (host !== null && !event.composedPath().includes(host)) {
        close();
      }
    },
    true,
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        close();
      }
    },
    true,
  );
  document.addEventListener('selectionchange', () => {
    const currentSelection = normalizeSelection(window.getSelection()?.toString() ?? '');
    if (currentSelection.length > 0 && currentSelection !== selectionAtOpen) {
      close();
    }
  });
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);

  return {
    close,
    showNoChinese(rect) {
      const card = createElement('div', 'card message');
      card.setAttribute('role', 'status');
      card.textContent = messages.noChinese;
      mount(card, rect, EMPTY_MESSAGE_TIMEOUT_MS);
    },
    showResult(result, rect) {
      const card = createElement('div', 'card');
      card.setAttribute('role', 'group');
      card.setAttribute('aria-label', messages.appName);

      const source = createElement('div', 'source');
      source.textContent = result.sourceText;

      const row = createElement('div', 'row');
      const pinyin = createElement('span', 'pinyin');
      pinyin.setAttribute('aria-live', 'polite');
      pinyin.textContent = result.displayPinyin;

      const button = createElement('button', 'speak');
      button.type = 'button';
      button.textContent = '🔊';
      const speechStatus = createElement('div', 'source');
      speechStatus.setAttribute('role', 'status');
      const updateSpeech = () => {
        button.disabled = !speech.available;
        button.title = speech.available ? messages.speak : messages.speechUnavailable;
        button.setAttribute('aria-label', button.title);
        speechStatus.textContent = speech.available ? '' : messages.speechUnavailable;
        speechStatus.hidden = speech.available;
      };
      updateSpeech();
      button.addEventListener('click', () => {
        speech.speak(result.speechText);
        updateSpeech();
        scheduleClose(POPOVER_TIMEOUT_MS);
      });

      row.append(pinyin, button);
      card.append(source, row, speechStatus);
      mount(card, rect, POPOVER_TIMEOUT_MS);
      unsubscribeSpeech = speech.subscribe?.(updateSpeech);
    },
  };
}
