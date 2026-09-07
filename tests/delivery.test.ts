import { describe, expect, it, vi } from 'vitest';

import {
  deliverWithTopFrameFallback,
  type RuntimeDeliveryApi,
} from '../src/background/delivery';
import type { ShowPinyinRequest } from '../src/shared/contracts';

const request: ShowPinyinRequest = {
  requestId: 'request-1',
  selectionText: '重庆',
  frameId: 7,
};

describe('runtime delivery', () => {
  it('injects the runtime once when the frame has no listener', async () => {
    let ready = false;
    const api: RuntimeDeliveryApi = {
      executeRuntime: vi.fn(async () => {
        ready = true;
      }),
      sendMessage: vi.fn(async (_tabId, _frameId, message) => {
        if (!ready && message.type === 'SHENDU_RUNTIME_PING') throw new Error('No receiver');
        return { ok: true };
      }),
    };

    await expect(deliverWithTopFrameFallback(api, 11, 7, request)).resolves.toBe(7);
    expect(api.executeRuntime).toHaveBeenCalledTimes(1);
  });

  it('reuses an installed frame runtime without reinjection', async () => {
    const api: RuntimeDeliveryApi = {
      executeRuntime: vi.fn(async () => undefined),
      sendMessage: vi.fn(async () => ({ ready: true })),
    };

    await expect(deliverWithTopFrameFallback(api, 11, 7, request)).resolves.toBe(7);
    expect(api.executeRuntime).not.toHaveBeenCalled();
  });

  it('falls back to the top frame after a cross-origin frame failure', async () => {
    const api: RuntimeDeliveryApi = {
      executeRuntime: vi.fn(async (_tabId, frameId) => {
        if (frameId === 7) throw new Error('Missing host permission');
      }),
      sendMessage: vi.fn(async (_tabId, frameId) => {
        if (frameId === 7) throw new Error('No receiver');
        return { ready: true };
      }),
    };

    await expect(deliverWithTopFrameFallback(api, 11, 7, request)).resolves.toBe(0);
  });
});
