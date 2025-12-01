import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../services/api";

export default function ChangePasswordCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      });

      if (response.success) {
        setFormData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        showSuccess("Berhasil mengubah password!");
        closeModal();
      } else {
        setError(response.message || "Gagal mengubah password.");
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

  const handleClose = () => {
    setFormData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setError(null);
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Ubah Password
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pastikan password Anda kuat dan tidak mudah ditebak. Minimal 8 karakter.
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Ubah Password
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Ubah Password
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Masukkan password saat ini dan password baru Anda.
            </p>
          </div>
          <form 
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {error && (
              <div className="px-2 mb-4 p-3 text-sm text-error-600 bg-error-50 rounded-xl dark:bg-error-500/20 dark:text-error-400">
                {error}
              </div>
            )}
            <div className="px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label>Password Saat Ini <span className="text-error-500">*</span></Label>
                  <Input 
                    type="password" 
                    value={formData.current_password}
                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                    disabled={isLoading}
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div>
                  <Label>Password Baru <span className="text-error-500">*</span></Label>
                  <Input 
                    type="password" 
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    disabled={isLoading}
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div>
                  <Label>Konfirmasi Password Baru <span className="text-error-500">*</span></Label>
                  <Input 
                    type="password" 
                    value={formData.new_password_confirmation}
                    onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                    disabled={isLoading}
                    placeholder="Ulangi password baru"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                type="button"
                onClick={handleClose}
                disabled={isLoading}
              >
                Tutup
              </Button>
              <Button 
                size="sm" 
                type="submit"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
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
                    Menyimpan...
                  </span>
                ) : (
                  'Simpan Perubahan'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

