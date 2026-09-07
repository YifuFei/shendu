import { browser } from 'wxt/browser';
import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';

import { buildPinyinResult } from '../src/core/pinyin';
import type { RuntimeMessage, RuntimeShowMessage } from '../src/shared/contracts';
import { createPopoverController } from '../src/runtime/popover';
import { captureSelection } from '../src/runtime/selection';
import { createSpeechController } from '../src/runtime/speech';

type RuntimeScope = typeof globalThis & {
  __shenduPageRuntimeInstalled?: boolean;
};

function isRuntimeMessage(message: unknown): message is RuntimeMessage {
  if (typeof message !== 'object' || message === null || !('type' in message)) {
    return false;
  }

  const type = (message as { type: unknown }).type;
  return type === 'SHENDU_RUNTIME_PING' || type === 'SHENDU_SHOW_PINYIN';
}

export default defineUnlistedScript(() => {
  const scope = globalThis as RuntimeScope;
  if (scope.__shenduPageRuntimeInstalled === true) {
    return;
  }
  scope.__shenduPageRuntimeInstalled = true;

  const speech = createSpeechController();
  const popover = createPopoverController(
    {
      appName: browser.i18n.getMessage('appName') || '慎读',
      noChinese: browser.i18n.getMessage('noChineseInSelection') || '选区中没有中文',
      speak: browser.i18n.getMessage('speakPinyin') || '朗读',
      speechUnavailable: browser.i18n.getMessage('speechUnavailable') || '当前浏览器无法朗读',
    },
    speech,
  );
  let latestRequestId = '';

  async function handleShow(message: RuntimeShowMessage): Promise<{ shown: boolean }> {
    latestRequestId = message.request.requestId;
    const forceSelectionOnly = window.top === window && message.request.frameId !== 0;
    const snapshot = captureSelection(message.request, forceSelectionOnly);
    const result = buildPinyinResult(snapshot);

    if (latestRequestId !== message.request.requestId) {
      return { shown: false };
    }

    if (result === null) {
      popover.showNoChinese(snapshot.rect);
    } else {
      popover.showResult(result, snapshot.rect);
    }

    return { shown: true };
  }

  browser.runtime.onMessage.addListener((message: unknown, sender) => {
    if (sender.id !== browser.runtime.id || !isRuntimeMessage(message)) {
      return undefined;
    }

    if (message.type === 'SHENDU_RUNTIME_PING') {
      return Promise.resolve({ ready: true });
    }

    return handleShow(message);
  });
});
