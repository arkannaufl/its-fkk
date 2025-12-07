import { useState, useCallback } from 'react';
import { organizationalChartApi } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

export interface Unit {
  id: number;
  code: string;
  name: string;
  type: string;
  role: string;
  parent_unit_id: number | null;
  description: string | null;
  position_x: number | null;
  position_y: number | null;
  is_active: boolean;
  users?: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string | null;
  employee_id: string | null;
  role?: string;
}

interface UseOrganizationalChartDataReturn {
  units: Unit[];
  unassignedUsers: User[];
  loading: boolean;
  error: string | null;
  loadChart: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useOrganizationalChartData = (): UseOrganizationalChartDataReturn => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationalChartApi.getChart();
      if (response.success && response.data) {
        setUnits(response.data.units);
        setUnassignedUsers(response.data.unassigned_users);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Gagal memuat struktur organisasi');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    units,
    unassignedUsers,
    loading,
    error,
    loadChart,
    setError,
  };
};

