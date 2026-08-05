import { onError, onSuccess } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { signupSchema } from "../schema/signupSchema";
import { useAuth } from "./useAuth";
export type SignupFormData = z.infer<typeof signupSchema>;

interface UseSignupFormReturn {
  register: ReturnType<typeof useForm<SignupFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<SignupFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<SignupFormData>>["formState"]["errors"];
  termsChecked: boolean;
  isLoading: boolean;
  showPassword: boolean;
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

  const termsChecked = watch("terms");

  const togglePassword = () => setShowPassword(prev => !prev);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      onSuccess("Account created successfully");
      navigate("/dashboard");
      reset();
    } catch (err) {
      onError(err, "Failed to create account. Please try again.");
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
    onSubmit,
    togglePassword,
  };
};
