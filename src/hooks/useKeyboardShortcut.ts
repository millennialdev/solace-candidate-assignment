import { useEffect } from "react";

/**
 * Hook to register keyboard shortcuts
 * @param key - The key to listen for
 * @param callback - Function to call when key is pressed
 * @param options - Additional options
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Exception: allow "/" to trigger even in inputs if not typing
        if (key !== "/" || (target as HTMLInputElement).value.length > 0) {
          return;
        }
      }

      const matchesModifiers =
        (options.ctrl === undefined || event.ctrlKey === options.ctrl) &&
        (options.alt === undefined || event.altKey === options.alt) &&
        (options.shift === undefined || event.shiftKey === options.shift);

      if (event.key === key && matchesModifiers) {
        if (options.preventDefault !== false) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options]);
}
