import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useSignupForm } from "../hooks/useSignupForm";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    termsChecked,
    isLoading,
    showPassword,
    onSubmit,
    togglePassword,
  } = useSignupForm();

  const errorClasses = "text-sm text-error-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* <!-- First Name --> */}
          <div className="sm:col-span-1">
            <Label>
              First Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              id="firstName"
              {...register("firstName")}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className={errorClasses}>{errors.firstName.message}</p>
            )}
          </div>
          {/* <!-- Last Name --> */}
          <div className="sm:col-span-1">
            <Label>
              Last Name<span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              id="lastName"
              {...register("lastName")}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className={errorClasses}>{errors.lastName.message}</p>
            )}
          </div>
        </div>
        {/* <!-- Email --> */}
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
        {/* <!-- Password --> */}
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
        {/* <!-- Checkbox --> */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              id="terms"
              {...register("terms")}
              checked={termsChecked}
              onCheckedChange={(checked) => {
                register("terms").onChange({
                  target: { value: checked === true, name: "terms" },
                });
              }}
              className="mt-1"
            />

            <span className="inline-block text-sm font-normal text-gray-500 dark:text-gray-400">
              By creating an account means you agree to the{" "}
              <span className="text-gray-800 dark:text-white/90">
                Terms and Conditions,
              </span>{" "}
              and our{" "}
              <span className="text-gray-800 dark:text-white">
                Privacy Policy
              </span>
            </span>
          </label>
          {errors.terms && (
            <p className={errorClasses}>{errors.terms.message}</p>
          )}
        </div>
        <div>
          <Button
            type="submit"
            size={"lg"}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>
        <div id="clerk-captcha"></div>
      </div>
    </form>
  );
};

export default SignupForm;
