import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authApi } from "../../services/api";
import { getInitials, getAvatarUrl } from "../../utils/avatar";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface AvatarUploadProps {
  size?: "sm" | "md" | "lg";
  showUploadMenu?: boolean;
  className?: string;
}

export default function AvatarUpload({ 
  size = "md", 
  showUploadMenu = true,
  className = "" 
}: AvatarUploadProps) {
  const { user, checkAuth } = useAuth();
  const { showSuccess } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = getInitials(user?.name);
  const avatarUrl = getAvatarUrl(user?.avatar);

  const sizeClasses = {
    sm: "w-11 h-11 text-sm",
    md: "w-20 h-20 text-xl",
    lg: "w-24 h-24 text-2xl",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await authApi.uploadAvatar(file);
      
      if (response.success) {
        // Refresh user data
        await checkAuth();
        showSuccess("Berhasil mengupload avatar!");
        setShowMenu(false);
      } else {
        setError(response.message || "Gagal mengupload avatar.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleDeleteConfirm = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await authApi.deleteAvatar();
      
      if (response.success) {
        // Refresh user data
        await checkAuth();
        showSuccess("Berhasil menghapus avatar!");
        setShowDeleteModal(false);
      } else {
        setError(response.message || "Gagal menghapus avatar.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.name || "User"}
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-700`}
          />
        ) : (
          <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-brand-500 text-white font-semibold`}>
            {initials}
          </div>
        )}
        
        {showUploadMenu && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-colors"
            disabled={isUploading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

      {showUploadMenu && showMenu && (
        <div className="absolute z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {error && (
            <div className="p-2 text-xs text-error-600 bg-error-50 dark:bg-error-500/20 dark:text-error-400">
              {error}
            </div>
          )}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isUploading ? "Mengupload..." : "Upload Foto"}
          </button>
          {avatarUrl && (
            <button
              onClick={handleDeleteClick}
              disabled={isUploading}
              className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Hapus Foto
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-100 dark:bg-error-500/20">
                <svg
                  className="w-6 h-6 text-error-600 dark:text-error-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Hapus Avatar
                </h4>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Apakah Anda yakin ingin menghapus avatar? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDeleteCancel}
              disabled={isUploading}
            >
              Batal
            </Button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-error-500 text-white shadow-theme-xs hover:bg-error-600 disabled:bg-error-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
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
                  Menghapus...
                </span>
              ) : (
                'Ya, Hapus'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

