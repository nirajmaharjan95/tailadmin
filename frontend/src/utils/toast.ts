import { toast } from "sonner";

export const onSuccess = (message: string) => {
  toast.success(message, {
    className: "!bg-green-600 !text-white !border-none",
  });
};

export const onError = (error: unknown, fallback = "Something went wrong") => {
  const message = error instanceof Error ? error.message : fallback;
  toast.error(message, {
    className: "!bg-red-600 !text-white !border-none",
  });
};
