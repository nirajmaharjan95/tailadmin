import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

interface OAuthButtons {
  onGoogleSignup: () => void;
  onXTwitterSignup: () => void;
}

const oauthBtnClass =
  "inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10";

const OAuthButtons = ({ onGoogleSignup, onXTwitterSignup }: OAuthButtons) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
      <button onClick={onGoogleSignup} className={oauthBtnClass}>
        <FcGoogle size={20} />
        Sign up with Google
      </button>
      <button onClick={onXTwitterSignup} className={oauthBtnClass}>
        <FaXTwitter size={20} />
        Sign up with X
      </button>
    </div>
  );
};

export default OAuthButtons;
