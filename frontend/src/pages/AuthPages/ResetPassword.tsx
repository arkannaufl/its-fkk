import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon, ChevronLeftIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../services/api";

type Step = "email" | "otp" | "password";

export default function ResetPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleRequestOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await authApi.requestPasswordResetOTP(email);

      if (response.success) {
        setSuccess(response.message || "Kode OTP telah dikirim ke email Anda.");
        setStep("otp");
      } else {
        setError(response.message || "Gagal mengirim OTP. Silakan coba lagi.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await authApi.verifyPasswordResetOTP(email, otp);

      if (response.success) {
        setSuccess(response.message || "Kode OTP berhasil diverifikasi.");
        setStep("password");
      } else {
        setError(response.message || "Kode OTP tidak valid.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.resetPassword({
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.success) {
        setSuccess(response.message || "Password berhasil direset.");
        showSuccess("Password berhasil direset!");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setError(response.message || "Gagal mereset password. Silakan coba lagi.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Reset Password | ITS (Integrated Task System)"
        description="Reset password akun Anda dengan kode OTP yang dikirim ke email"
      />
      <AuthLayout>
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
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === "email" && "Masukkan email Anda untuk menerima kode OTP"}
                  {step === "otp" && "Masukkan kode OTP yang telah dikirim ke email Anda"}
                  {step === "password" && "Masukkan password baru untuk akun Anda"}
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

              {/* Success Message */}
              {success && (
                <div className="p-4 mb-6 text-sm text-green-600 bg-green-50 rounded-xl dark:bg-green-500/20 dark:text-green-400">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              {/* Step 1: Email */}
              {step === "email" && (
                <form onSubmit={handleRequestOTP}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Email <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="Masukkan email Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        to="/signin"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Kembali ke login
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
                            Mengirim...
                          </span>
                        ) : (
                          "Kirim Kode OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOTP}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Kode OTP <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Masukkan 6 digit kode OTP"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtp(value);
                        }}
                        disabled={isLoading}
                        maxLength={6}
                        required
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Kode OTP telah dikirim ke <strong>{email}</strong>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email");
                          setOtp("");
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Ubah email
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestOTP}
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        disabled={isLoading}
                      >
                        Kirim ulang OTP
                      </button>
                    </div>
                    <div>
                      <Button
                        className="w-full"
                        size="sm"
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
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
                            Memverifikasi...
                          </span>
                        ) : (
                          "Verifikasi OTP"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === "password" && (
                <form onSubmit={handleResetPassword}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Password Baru <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password baru"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
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
                    <div>
                      <Label>
                        Konfirmasi Password <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPasswordConfirmation ? "text" : "password"}
                          placeholder="Konfirmasi password baru"
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <span
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPasswordConfirmation ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        className="w-full"
                        size="sm"
                        type="submit"
                        disabled={isLoading || password.length < 8 || password !== passwordConfirmation}
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
                          "Reset Password"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}

