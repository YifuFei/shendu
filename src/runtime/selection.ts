import { CONTEXT_RADIUS } from '../config/product';
import { normalizeSelection, takeFirstCodePoints, takeLastCodePoints } from '../core/han';
import type { SelectionSnapshot, ShowPinyinRequest, ViewportRect } from '../shared/contracts';

const BLOCK_TAGS = new Set([
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'BODY',
  'DD',
  'DIV',
  'DL',
  'DT',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'LI',
  'MAIN',
  'NAV',
  'P',
  'PRE',
  'SECTION',
  'TD',
  'TH',
]);

function elementForNode(node: Node): Element | null {
  return node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
}

function isEditable(element: Element | null): boolean {
  if (element === null) {
    return false;
  }

  return (
    element.closest('input, textarea') !== null ||
    element.closest('[contenteditable]:not([contenteditable="false"])') !== null
  );
}

function nearestTextContainer(range: Range): Element | null {
  let current = elementForNode(range.commonAncestorContainer);

  while (current !== null && current !== document.documentElement) {
    if (BLOCK_TAGS.has(current.tagName)) {
      return current;
    }
    current = current.parentElement;
  }

  return document.body;
}

function serializeRect(range: Range): ViewportRect | null {
  const rect = range.getBoundingClientRect();

  if (rect.width <= 0 && rect.height <= 0) {
    return null;
  }

  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function surroundingText(range: Range, container: Element): Pick<SelectionSnapshot, 'prefix' | 'suffix'> {
  const before = range.cloneRange();
  before.selectNodeContents(container);
  before.setEnd(range.startContainer, range.startOffset);

  const after = range.cloneRange();
  after.selectNodeContents(container);
  after.setStart(range.endContainer, range.endOffset);

  return {
    prefix: takeLastCodePoints(before.toString(), CONTEXT_RADIUS),
    suffix: takeFirstCodePoints(after.toString(), CONTEXT_RADIUS),
  };
}

function fallbackSnapshot(selectionText: string): SelectionSnapshot {
  return {
    selectedText: selectionText,
    prefix: '',
    suffix: '',
    rect: null,
    contextQuality: 'selectionOnly',
  };
}

export function captureSelection(
  request: ShowPinyinRequest,
  forceSelectionOnly = false,
): SelectionSnapshot {
  if (forceSelectionOnly) {
    return fallbackSnapshot(request.selectionText);
  }

  const selection = window.getSelection();

  if (selection === null || selection.rangeCount === 0 || selection.isCollapsed) {
    return fallbackSnapshot(request.selectionText);
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  const startElement = elementForNode(range.startContainer);

  if (
    normalizeSelection(selectedText) !== normalizeSelection(request.selectionText) ||
    isEditable(startElement) ||
    range.commonAncestorContainer.getRootNode() !== document
  ) {
    return fallbackSnapshot(request.selectionText);
  }

  const container = nearestTextContainer(range);

  if (container === null) {
    return fallbackSnapshot(request.selectionText);
  }

  try {
    const context = surroundingText(range, container);
    return {
      selectedText,
      ...context,
      rect: serializeRect(range),
      contextQuality: 'dom',
    };
  } catch {
    return fallbackSnapshot(request.selectionText);
  }
}
