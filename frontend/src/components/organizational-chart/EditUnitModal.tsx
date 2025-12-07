import { useState, FormEvent, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Form from '../form/Form';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Button from '../ui/button/Button';
import { organizationalChartApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatValidationErrors, getErrorMessage } from '../../utils/errorHandler';

interface Unit {
  id: number;
  code: string;
  name: string;
  type: string;
  parent_unit_id: number | null;
  role: string;
  description: string | null;
}

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unit: Unit | null;
  units?: Array<{ id: number; name: string }>;
}

export default function EditUnitModal({ isOpen, onClose, onSuccess, unit, units = [] }: EditUnitModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'unit' as 'wadek_i' | 'wadek_ii' | 'unit' | 'sdm',
    parent_unit_id: '',
    role: 'unit' as 'admin' | 'dekan' | 'wadek' | 'unit' | 'sdm',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess } = useToast();

  useEffect(() => {
    if (unit) {
      setFormData({
        code: unit.code || '',
        name: unit.name || '',
        type: (unit.type as 'wadek_i' | 'wadek_ii' | 'unit' | 'sdm') || 'unit',
        parent_unit_id: unit.parent_unit_id ? unit.parent_unit_id.toString() : '',
        role: (unit.role as 'admin' | 'dekan' | 'wadek' | 'unit' | 'sdm') || 'unit',
        description: unit.description || '',
      });
      setErrors({});
      setError(null);
    }
  }, [unit]);

  useEffect(() => {
    // Auto-set role based on type
    if (formData.type === 'wadek_i' || formData.type === 'wadek_ii') {
      setFormData((prev) => ({ ...prev, role: 'wadek' }));
    } else if (formData.type === 'unit') {
      setFormData((prev) => ({ ...prev, role: 'unit' }));
    } else {
      setFormData((prev) => ({ ...prev, role: 'sdm' }));
    }
  }, [formData.type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!unit) return;

    setErrors({});
    setError(null);
    setIsLoading(true);

    try {
      const response = await organizationalChartApi.updateUnit(unit.id, {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        parent_unit_id: formData.parent_unit_id ? parseInt(formData.parent_unit_id) : null,
        role: formData.role,
        description: formData.description || null,
      });

      if (response.success) {
        showSuccess('Unit berhasil diperbarui');
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
        setError(getErrorMessage(err) || 'Gagal memperbarui unit');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!unit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Unit
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Perbarui informasi unit.
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
                <Label htmlFor="code">Kode Unit <span className="text-error-500">*</span></Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  error={!!errors.code}
                  required
                  placeholder="Contoh: WADEK_I, KA_PRODI_PPDS"
                />
                {errors.code && <p className="mt-1 text-xs text-error-500">{errors.code}</p>}
              </div>

              <div>
                <Label htmlFor="name">Nama Unit <span className="text-error-500">*</span></Label>
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
                <Label htmlFor="type">Tipe Unit <span className="text-error-500">*</span></Label>
                <Select
                  options={[
                    { value: 'wadek_i', label: 'Wakil Dekan I' },
                    { value: 'wadek_ii', label: 'Wakil Dekan II' },
                    { value: 'unit', label: 'Unit' },
                    { value: 'sdm', label: 'SDM' },
                  ]}
                  defaultValue={formData.type}
                  onChange={(value) => setFormData({ ...formData, type: value as 'wadek_i' | 'wadek_ii' | 'unit' | 'sdm' })}
                />
                {errors.type && <p className="mt-1 text-xs text-error-500">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="parent_unit_id">Unit Induk</Label>
                <Select
                  options={[
                    { value: '', label: 'Tidak ada (Root Unit)' },
                    ...units.filter((u) => u.id !== unit.id).map((u) => ({ value: u.id.toString(), label: u.name })),
                  ]}
                  defaultValue={formData.parent_unit_id}
                  onChange={(value) => setFormData({ ...formData, parent_unit_id: value })}
                />
                {errors.parent_unit_id && (
                  <p className="mt-1 text-xs text-error-500">{errors.parent_unit_id}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={!!errors.description}
                />
                {errors.description && <p className="mt-1 text-xs text-error-500">{errors.description}</p>}
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

