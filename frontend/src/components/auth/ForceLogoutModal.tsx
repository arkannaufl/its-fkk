import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

/**
 * Get browser icon - using a single icon for all browsers.
 * Icon represents a browser window with tabs.
 */
function getBrowserIcon(): React.ReactElement {
  const iconClass = "w-4 h-4 text-gray-400";
  
  // Browser window icon with tabs
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9h18M7 5v4M11 5v4" />
    </svg>
  );
}

interface SessionInfo {
  device_name: string;
  browser_name?: string;
  ip_address: string;
  last_activity: string;
}

interface ForceLogoutModalProps {
  isOpen: boolean;
  sessionInfo: SessionInfo | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ForceLogoutModal({
  isOpen,
  sessionInfo,
  onConfirm,
  onCancel,
  isLoading = false,
}: ForceLogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-[500px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-500/20">
              <svg
                className="w-6 h-6 text-warning-600 dark:text-warning-400"
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
                Sesi Aktif Terdeteksi
              </h4>
            </div>
          </div>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Akun ini sedang digunakan di perangkat lain
          </p>
        </div>

        <div className="px-2">
          {sessionInfo && (
            <div className="p-4 mb-6 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Detail Sesi Aktif:
              </h5>
              <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Perangkat: {sessionInfo.device_name}</span>
                </li>
                <li className="flex items-center gap-2">
                  {getBrowserIcon()}
                  <span>Browser: {sessionInfo.browser_name || 'Unknown Browser'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <span>IP: {sessionInfo.ip_address}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Aktivitas Terakhir: {sessionInfo.last_activity}</span>
                </li>
              </ul>
            </div>
          )}

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Apakah Anda ingin <strong>mengeluarkan</strong> perangkat lain dan
            melanjutkan login di sini? Perangkat lain akan otomatis logout.
          </p>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-error-500 hover:bg-error-600"
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
                Memproses...
              </span>
            ) : (
              'Ya, Logout Perangkat Lain'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

