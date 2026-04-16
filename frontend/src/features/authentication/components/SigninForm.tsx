import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useSigninForm } from "../hooks/useSigninForm";

const SigninForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    showPassword,
    onSubmit,
    togglePassword,
  } = useSigninForm();

  const errorClasses = "text-sm text-error-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div>
          <Label>
            Email<span className="text-error-500">*</span>
          </Label>
          <Input
            type="email"
            id="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label>
            Password<span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <span className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
              <button
                type="button"
                onClick={togglePassword}
                className="fill-gray-500 dark:fill-gray-400"
              >
                {showPassword ? <LuEye size={16} /> : <LuEyeOff size={16} />}
              </button>
            </span>

            {errors.password && (
              <p className={errorClasses}>{errors.password.message}</p>
            )}
          </div>
        </div>
        <div>
          <Button
            type="submit"
            size={"lg"}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
        <div id="clerk-captcha"></div>
      </div>
    </form>
  );
};

export default SigninForm;
