import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Ellipsis } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MoreOptions = ({ children }: PropsWithChildren) => {
  const [showOption, setShowOption] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const toggleShowOption = () => {
    setShowOption(prev => !prev);
  };

  useOutsideClick({
    ref,
    onClickOutside: () => setShowOption(false),
  });

  useEffect(() => {
    if (!showOption) return;

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 140,
      });
    }

    const handleScroll = () => setShowOption(false);
    window.addEventListener("scroll", handleScroll, true);

    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [showOption]);

  return (
    <div ref={ref} className="relative">
      <button
        className="text-gray-700 dark:text-gray-400"
        onClick={toggleShowOption}
      >
        <Ellipsis size={16} />
      </button>

      {showOption &&
        children &&
        createPortal(
          <div
            className="fixed z-[9999] w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark flex flex-col"
            style={{ top: position.top, left: position.left }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 items-start px-2 py-2 text-sm">
              {children}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MoreOptions;
