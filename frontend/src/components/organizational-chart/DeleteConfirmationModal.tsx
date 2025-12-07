import React from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { User, Unit } from '../../hooks/useOrganizationalChartData';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: User | Unit | null;
  itemType: 'user' | 'unit';
  isDeleting: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemType,
  isDeleting,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const itemName = itemType === 'user' 
    ? (item as User | null)?.name 
    : (item as Unit | null)?.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Konfirmasi Hapus
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus {itemType === 'user' ? 'user' : 'unit'}{' '}
            <span className="font-medium text-gray-900 dark:text-white">{itemName}</span>?
            {itemType === 'unit' && (
              <span className="block mt-2 text-error-600 dark:text-error-400">
                User yang ada di unit ini akan dikembalikan ke unassigned.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            size="sm"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            size="sm"
            className="bg-error-500 hover:bg-error-600 text-white"
          >
            {isDeleting ? (
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
              'Hapus'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

