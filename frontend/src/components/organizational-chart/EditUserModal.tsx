import { useState, FormEvent, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Form from '../form/Form';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { organizationalChartApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatValidationErrors, getErrorMessage } from '../../utils/errorHandler';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  employee_id?: string | null;
  role?: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    employee_id: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        employee_id: user.employee_id || '',
      });
      setErrors({});
      setError(null);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      const updateData: {
        name: string;
        username: string | null;
        email: string;
        phone: string | null;
        employee_id: string | null;
        password?: string;
        password_confirmation?: string;
      } = {
        name: formData.name,
        username: formData.username || null,
        email: formData.email,
        phone: formData.phone || null,
        employee_id: formData.employee_id || null,
      };

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await organizationalChartApi.updateUser(user.id, updateData);

      if (response.success) {
        showSuccess('User berhasil diperbarui');
        setFormData({
          name: '',
          username: '',
          email: '',
          phone: '',
          password: '',
          password_confirmation: '',
          employee_id: '',
        });
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const errorData = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { errors?: Record<string, string | string[]>; message?: string } } }).response?.data
        : null;
      
      if (errorData?.errors) {
        setErrors(formatValidationErrors(errorData.errors));
      } else {
        setError(getErrorMessage(err) || 'Gagal memperbarui user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit User
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Perbarui informasi user. Kosongkan password jika tidak ingin mengubahnya.
          </p>
        </div>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="px-2 mb-4 p-3 text-sm text-error-600 bg-error-50 rounded-xl dark:bg-error-500/20 dark:text-error-400">
              {error}
            </div>
          )}
          <div className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama <span className="text-error-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  required
                />
                {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email <span className="text-error-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  required
                />
                {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  error={!!errors.username}
                />
                {errors.username && <p className="mt-1 text-xs text-error-500">{errors.username}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-error-500">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password Baru</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={!!errors.password}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
                {errors.password && <p className="mt-1 text-xs text-error-500">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  error={!!errors.password_confirmation}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-error-500">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="employee_id">ID Karyawan</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  error={!!errors.employee_id}
                />
                {errors.employee_id && <p className="mt-1 text-xs text-error-500">{errors.employee_id}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} size="sm">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} size="sm">
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
                'Simpan'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

