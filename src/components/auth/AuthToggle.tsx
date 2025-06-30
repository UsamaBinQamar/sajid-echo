
interface AuthToggleProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  loading: boolean;
}

const AuthToggle = ({ isSignUp, setIsSignUp, loading }: AuthToggleProps) => {
  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        disabled={loading}
        className="text-purple-600 hover:text-purple-700 underline disabled:opacity-50"
      >
        {isSignUp 
          ? "Already have an account? Sign in" 
          : "Need an account? Sign up"
        }
      </button>
    </div>
  );
};

export default AuthToggle;
