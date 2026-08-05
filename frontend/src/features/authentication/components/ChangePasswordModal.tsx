import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useChangePasswordForm } from "../hooks/useChangePasswordForm";

interface ChangePasswordModalProps {
  onClose: () => void;
}

const fields = [
  {
    name: "currentPassword",
    label: "Current password",
    placeholder: "Enter your current password",
  },
  {
    name: "newPassword",
    label: "New password",
    placeholder: "Enter your new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    placeholder: "Re-enter your new password",
  },
] as const;

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    visibleFields,
    onSubmit,
    toggleVisibility,
  } = useChangePasswordForm(onClose);

  const errorClasses = "text-sm text-error-500";

  return (
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
        Change Password
      </h4>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Changing your password signs you out of all other devices.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {fields.map(field => (
            <div key={field.name}>
              <Label htmlFor={field.name}>
                {field.label}
                <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  type={visibleFields[field.name] ? "text" : "password"}
                  {...register(field.name)}
                />
                <span className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  <Button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    variant="ghost"
                    size="icon-sm"
                    className="fill-gray-500 dark:fill-gray-400"
                    aria-label={
                      visibleFields[field.name]
                        ? `Hide ${field.label.toLowerCase()}`
                        : `Show ${field.label.toLowerCase()}`
                    }
                  >
                    {visibleFields[field.name] ? (
                      <LuEye size={16} />
                    ) : (
                      <LuEyeOff size={16} />
                    )}
                  </Button>
                </span>
              </div>
              {errors[field.name] && (
                <p className={errorClasses}>{errors[field.name]?.message}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
