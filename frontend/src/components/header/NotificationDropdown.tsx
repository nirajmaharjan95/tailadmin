import { notifications } from "@/constants/notificationList";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: Props) => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const handleImgError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!isOpen) return null;

  return (
    <div className="shadow-theme-lg dark:bg-gray-dark absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 sm:w-[361px] lg:right-0 dark:border-gray-800">
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Notification
        </h5>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill=""
            ></path>
          </svg>
        </button>
      </div>

      <ul className="custom-scrollbar flex h-auto flex-col overflow-y-auto">
        {notifications.map((item) => (
          <li key={item.id}>
            <a
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              href="#"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                {imgErrors[item.id] ? (
                  <CircleUserRound size={40} className="text-gray-400" />
                ) : (
                  <figure className="w-11 h-11 overflow-hidden rounded-full">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      onError={() => handleImgError(item.id)}
                    />
                  </figure>
                )}
                <span
                  className={`absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
                    item.online ? "bg-success-500" : "bg-error-500"
                  }`}
                ></span>
              </span>

              <span className="block">
                <span className="text-theme-sm mb-1.5 block text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {item.name}
                  </span>{" "}
                  {item.action}{" "}
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {item.target}
                  </span>
                </span>

                <span className="text-theme-xs flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span>{item.category}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{item.time}</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="text-theme-sm shadow-theme-xs mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        View All Notification
      </a>
    </div>
  );
};

export default NotificationDropdown;
