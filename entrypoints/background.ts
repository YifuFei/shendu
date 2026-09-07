import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';

import { deliverWithTopFrameFallback, type RuntimeDeliveryApi } from '../src/background/delivery';
import type { ShowPinyinRequest } from '../src/shared/contracts';

const MENU_ID = 'shendu-show-pinyin';
const SUPPORTED_DOCUMENTS = ['http://*/*', 'https://*/*'];

async function installContextMenu(): Promise<void> {
  await browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: MENU_ID,
    title: browser.i18n.getMessage('contextMenuShowPinyin') || '显示中文拼音',
    contexts: ['selection'],
    documentUrlPatterns: SUPPORTED_DOCUMENTS,
  });
}

const deliveryApi: RuntimeDeliveryApi = {
  async executeRuntime(tabId, frameId) {
    await browser.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      files: ['/page-runtime.js'],
    });
  },
  async sendMessage(tabId, frameId, message) {
    return browser.tabs.sendMessage(tabId, message, { frameId });
  },
};

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    void installContextMenu();
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== MENU_ID || tab?.id === undefined || typeof info.selectionText !== 'string') {
      return;
    }

    const frameId = info.frameId ?? 0;
    const request: ShowPinyinRequest = {
      requestId: crypto.randomUUID(),
      selectionText: info.selectionText,
      frameId,
    };

    void deliverWithTopFrameFallback(deliveryApi, tab.id, frameId, request);
  });
});
