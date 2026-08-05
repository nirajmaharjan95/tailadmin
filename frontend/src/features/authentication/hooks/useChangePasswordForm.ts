import { onError, onSuccess } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../schema/changePasswordSchema";
import { useAuth } from "./useAuth";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

interface UseChangePasswordFormReturn {
  register: ReturnType<typeof useForm<ChangePasswordFormData>>["register"];
  handleSubmit: ReturnType<
    typeof useForm<ChangePasswordFormData>
  >["handleSubmit"];
  errors: ReturnType<
    typeof useForm<ChangePasswordFormData>
  >["formState"]["errors"];
  isLoading: boolean;
  visibleFields: Record<PasswordField, boolean>;
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  toggleVisibility: (field: PasswordField) => void;
}

export const useChangePasswordForm = (
  onClose: () => void
): UseChangePasswordFormReturn => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [visibleFields, setVisibleFields] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: PasswordField) =>
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));

  const { changePassword } = useAuth();

  const onSubmit = async (data: ChangePasswordFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      onSuccess("Password changed successfully");
      reset();
      onClose();
    } catch (err) {
      onError(err, "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    visibleFields,
    onSubmit,
    toggleVisibility,
  };
};
