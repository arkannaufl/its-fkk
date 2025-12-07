import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { organizationalChartApi } from '../services/api';
import { User, Unit } from './useOrganizationalChartData';
import { getErrorMessage } from '../utils/errorHandler';

interface DeleteModalState<T> {
  isOpen: boolean;
  item: T | null;
}

interface UseDeleteConfirmationReturn {
  deleteUserModal: DeleteModalState<User>;
  deleteUnitModal: DeleteModalState<Unit>;
  isDeleting: boolean;
  openDeleteUserModal: (user: User) => void;
  openDeleteUnitModal: (unit: Unit) => void;
  closeDeleteUserModal: () => void;
  closeDeleteUnitModal: () => void;
  confirmDeleteUser: () => Promise<void>;
  confirmDeleteUnit: () => Promise<void>;
}

export const useDeleteConfirmation = (
  onSuccess?: () => void,
  onLoadChart?: () => Promise<void>
): UseDeleteConfirmationReturn => {
  const [deleteUserModal, setDeleteUserModal] = useState<DeleteModalState<User>>({
    isOpen: false,
    item: null,
  });
  const [deleteUnitModal, setDeleteUnitModal] = useState<DeleteModalState<Unit>>({
    isOpen: false,
    item: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess } = useToast();

  const openDeleteUserModal = useCallback((user: User) => {
    setDeleteUserModal({ isOpen: true, item: user });
  }, []);

  const openDeleteUnitModal = useCallback((unit: Unit) => {
    setDeleteUnitModal({ isOpen: true, item: unit });
  }, []);

  const closeDeleteUserModal = useCallback(() => {
    setDeleteUserModal({ isOpen: false, item: null });
  }, []);

  const closeDeleteUnitModal = useCallback(() => {
    setDeleteUnitModal({ isOpen: false, item: null });
  }, []);

  const confirmDeleteUser = useCallback(async () => {
    if (!deleteUserModal.item) return;
    
    try {
      setIsDeleting(true);
      const response = await organizationalChartApi.deleteUser(deleteUserModal.item.id);
      if (response.success) {
        showSuccess('User berhasil dihapus');
        setDeleteUserModal({ isOpen: false, item: null });
        onSuccess?.();
        await onLoadChart?.();
      }
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err) || 'Gagal menghapus user');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteUserModal.item, onSuccess, onLoadChart, showSuccess]);

  const confirmDeleteUnit = useCallback(async () => {
    if (!deleteUnitModal.item) return;
    
    try {
      setIsDeleting(true);
      const response = await organizationalChartApi.deleteUnit(deleteUnitModal.item.id);
      if (response.success) {
        showSuccess('Unit berhasil dihapus');
        setDeleteUnitModal({ isOpen: false, item: null });
        onSuccess?.();
        await onLoadChart?.();
      }
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err) || 'Gagal menghapus unit');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteUnitModal.item, onSuccess, onLoadChart, showSuccess]);

  return {
    deleteUserModal,
    deleteUnitModal,
    isDeleting,
    openDeleteUserModal,
    openDeleteUnitModal,
    closeDeleteUserModal,
    closeDeleteUnitModal,
    confirmDeleteUser,
    confirmDeleteUnit,
  };
};

