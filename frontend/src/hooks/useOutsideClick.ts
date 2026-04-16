import { RefObject, useEffect } from "react";

interface UseOutsideClickOptions {
  ref: RefObject<HTMLElement | null>;
  onClickOutside: () => void;
}

export const useOutsideClick = ({
  ref,
  onClickOutside,
}: UseOutsideClickOptions) => {
  useEffect(() => {
    if (!ref) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClickOutside]);
};
