import { onError, onSuccess } from "@/utils/toast";
import { useSignIn } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { signinSchema } from "../schema/signinSchema";
export type SigninFormData = z.infer<typeof signinSchema>;

interface UseSigninFormReturn {
  register: ReturnType<typeof useForm<SigninFormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<SigninFormData>>["handleSubmit"];
  errors: ReturnType<typeof useForm<SigninFormData>>["formState"]["errors"];
  isLoading: boolean;
  showPassword: boolean;
  onSubmit: (data: SigninFormData) => Promise<void>;
  togglePassword: () => void;
}

export const useSigninForm = (): UseSigninFormReturn => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (data: SigninFormData): Promise<void> => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }

      onSuccess("Signed in successfully");
      navigate("/employees");
      reset();
    } catch (err) {
      onError(err, "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    showPassword,
    onSubmit,
    togglePassword,
  };
};
