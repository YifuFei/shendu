import type { RuntimeMessage, ShowPinyinRequest } from '../shared/contracts';

export interface RuntimeDeliveryApi {
  executeRuntime(tabId: number, frameId: number): Promise<void>;
  sendMessage(tabId: number, frameId: number, message: RuntimeMessage): Promise<unknown>;
}

async function ensureRuntime(api: RuntimeDeliveryApi, tabId: number, frameId: number): Promise<void> {
  try {
    await api.sendMessage(tabId, frameId, { type: 'SHENDU_RUNTIME_PING' });
  } catch {
    await api.executeRuntime(tabId, frameId);
    await api.sendMessage(tabId, frameId, { type: 'SHENDU_RUNTIME_PING' });
  }
}

async function deliverToFrame(
  api: RuntimeDeliveryApi,
  tabId: number,
  frameId: number,
  request: ShowPinyinRequest,
): Promise<boolean> {
  try {
    await ensureRuntime(api, tabId, frameId);
    await api.sendMessage(tabId, frameId, {
      type: 'SHENDU_SHOW_PINYIN',
      request,
    });
    return true;
  } catch {
    return false;
  }
}

export async function deliverWithTopFrameFallback(
  api: RuntimeDeliveryApi,
  tabId: number,
  requestedFrameId: number,
  request: ShowPinyinRequest,
): Promise<number | null> {
  if (await deliverToFrame(api, tabId, requestedFrameId, request)) {
    return requestedFrameId;
  }

  if (requestedFrameId !== 0 && (await deliverToFrame(api, tabId, 0, request))) {
    return 0;
  }

  return null;
}
