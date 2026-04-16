import AuthSidePannel from "@/features/authentication/components/AuthSidePannel";
import OAuthButtons from "@/features/authentication/components/OAuthButtons";
import OrDivider from "@/features/authentication/components/OrDivider";
import SigninForm from "@/features/authentication/components/SigninForm";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div>
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col justify-center w-full h-screen dark:bg-gray-900 sm:p-0 lg:flex-row">
          <div className="flex flex-col flex-1 w-full lg:w-1/2">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>

              <OAuthButtons
                onGoogleSignup={() => {
                  console.log("Google");
                }}
                onXTwitterSignup={() => {
                  console.log("XTwitter");
                }}
              />

              <OrDivider />

              <SigninForm />

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <AuthSidePannel />
        </div>
      </div>
    </div>
  );
};

export default Signin;
