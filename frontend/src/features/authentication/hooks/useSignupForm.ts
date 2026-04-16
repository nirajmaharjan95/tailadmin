import { onError, onSuccess } from "@/utils/toast";
import { useClerk, useSignUp } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { signupSchema } from "../schema/signupSchema";
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

  const togglePassword = () => setShowPassword((prev) => !prev);

  const { signUp, isLoaded } = useSignUp();
  const { setActive } = useClerk();
  const navigate = useNavigate();

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: data.email,
        username: data.firstName,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }

      onSuccess("Account created successfully");
      navigate("/employees");
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
