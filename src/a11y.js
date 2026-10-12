// Shared accessibility helpers.
import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Focus + Escape management for a modal dialog.
// Attach the returned ref to the dialog element. While `open` is true, Escape
// calls `onClose`, focus is trapped inside the dialog, and focus is restored
// to the previously active element on close.
export function useDialogA11y(open, onClose) {
  const ref = useRef(null);
  const lastActive = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const node = ref.current;
    if (node) {
      const first = node.querySelector(FOCUSABLE);
      (first || node).focus?.();
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      const prev = lastActive.current;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) prev.focus();
    };
  }, [open]);

  return ref;
}
