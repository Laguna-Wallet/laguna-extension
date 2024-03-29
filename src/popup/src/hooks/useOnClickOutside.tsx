import { RefObject, useEffect } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

const useOnClickOutside = <T extends HTMLElement | null = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void,
  useDataDropdownAttr?: boolean
): void => {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current;

      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, useDataDropdownAttr]);
};

export default useOnClickOutside;
