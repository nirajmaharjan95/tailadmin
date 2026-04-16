import { LuX } from "react-icons/lu";

interface IModal {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = (props: IModal) => {
  const { onClose, children } = props;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">
      <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[4px]"></div>
      <div className="relative w-full max-w-[584px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
        <button
          className="group absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          onClick={onClose}
        >
          <LuX size={20} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
