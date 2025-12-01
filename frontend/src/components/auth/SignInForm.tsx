import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ForceLogoutModal from "./ForceLogoutModal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getDashboardPath } from "./ProtectedRoute";

interface SessionInfo {
  device_name: string;
  browser_name?: string;
  ip_address: string;
  last_activity: string;
}

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const { login } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(email, password, false);

      if (response.success && response.data) {
        showSuccess("Berhasil login!");
        navigate(response.data.redirect_to || getDashboardPath(response.data.user.role));
        return;
      }

      if (response.requires_force_logout && response.existing_session) {
        setSessionInfo(response.existing_session);
        setShowForceLogoutModal(true);
        return;
      }

      setError(response.message || "Login gagal. Silakan coba lagi.");
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(email, password, true);

      if (response.success && response.data) {
        setShowForceLogoutModal(false);
        navigate(response.data.redirect_to || getDashboardPath(response.data.user.role));
      } else {
        setError(response.message || "Login gagal. Silakan coba lagi.");
        setShowForceLogoutModal(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
      setShowForceLogoutModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover blur-sm scale-105 dark:blur-md"
          style={{
            backgroundImage: "url('/images/background/background-umj.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70" />
        </div>

        <div className="relative z-10 flex flex-col justify-center flex-1 w-full px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-xl p-12 mx-auto bg-white shadow-2xl rounded-3xl dark:bg-gray-900">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Login
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Masukkan email atau username dan password Anda untuk login!
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 text-sm text-error-600 bg-error-50 rounded-xl dark:bg-error-500/20 dark:text-error-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email atau Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="email atau username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Memproses...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Force Logout Modal */}
      <ForceLogoutModal
        isOpen={showForceLogoutModal}
        sessionInfo={sessionInfo}
        onConfirm={handleForceLogout}
        onCancel={() => setShowForceLogoutModal(false)}
        isLoading={isLoading}
      />
    </>
  );
}
