import { registerUser } from "@/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { signupSchema } from "../schema/signupSchema";

export type SignupFormData = z.infer<typeof signupSchema>;

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UseSignupFormReturn {
  register: ReturnType<typeof useForm<SignupFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<SignupFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<SignupFormData>>["formState"]["errors"];
  termsChecked: boolean;
  isLoading: boolean;
  showPassword: boolean;
  error: string | null;
  success: boolean;
  onSubmit: (data: SignupFormData) => Promise<void>;
  togglePassword: () => void;
}

export const useSignupForm = (): UseSignupFormReturn => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const termsChecked = watch("terms");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
      reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    termsChecked,
    isLoading,
    showPassword,
    error,
    success,
    onSubmit,
    togglePassword,
  };
};
