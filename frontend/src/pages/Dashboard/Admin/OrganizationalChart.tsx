import { useState, useEffect, useRef } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import PageHeader from '../../../components/common/PageHeader';
import QuickActionsSection from '../../../components/common/QuickActionsSection';
import OrganizationalChart from '../../../components/organizational-chart/OrganizationalChart';
import AddUserModal from '../../../components/organizational-chart/AddUserModal';
import AddUnitModal from '../../../components/organizational-chart/AddUnitModal';
import Button from '../../../components/ui/button/Button';
import { organizationalChartApi } from '../../../services/api';
import { UserIcon, GroupIcon } from '../../../icons';
import { exportOrganizationalChartToPDF } from '../../../utils/pdfExport';
import { useToast } from '../../../context/ToastContext';
import { Unit, User } from '../../../hooks/useOrganizationalChartData';

export default function OrganizationalChartPage() {
  const { showSuccess } = useToast();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [units, setUnits] = useState<Array<{ id: number; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [chartData, setChartData] = useState<{ units: Unit[]; unassignedUsers: User[] } | null>(null);
  const chartKeyRef = useRef(0);

  const loadUnits = async () => {
    try {
      setError(null);
      const response = await organizationalChartApi.getChart();
      if (response.success && response.data) {
        setUnits(
          response.data.units.map((unit) => ({
            id: unit.id,
            name: unit.name,
          }))
        );
        // Store full chart data for PDF export
        setChartData({
          units: response.data.units,
          unassignedUsers: response.data.unassigned_users,
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat unit';
      setError(errorMessage);
    }
  };

  const handleExportPDF = async () => {
    if (!chartData) {
      setError('Data struktur organisasi belum dimuat');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);
      await exportOrganizationalChartToPDF(chartData.units, chartData.unassignedUsers);
      showSuccess('PDF berhasil diekspor');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengekspor PDF';
      setError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleChartUpdate = () => {
    chartKeyRef.current += 1;
    loadUnits();
  };

  useEffect(() => {
    // Load initial data only
    loadUnits();
  }, []);

  return (
    <>
      <PageMeta
        title="Organizational Chart | ITS (Integrated Task System)"
        description="Kelola struktur organisasi dan assign user ke unit"
      />
      
      <PageBreadcrumb pageTitle="Struktur Organisasi" />

      <div className="space-y-6">
        {/* Header Section */}
        <PageHeader
          title="Struktur Organisasi"
          subtitle="Kelola struktur organisasi fakultas, buat unit baru, dan assign user ke unit yang sesuai. Gunakan drag and drop untuk memindahkan user antar unit dengan mudah."
          icon={<GroupIcon className="size-7" />}
          allowSubtitleWrap={true}
        />

        {/* Action Buttons Section */}
        <QuickActionsSection description="Ekspor struktur organisasi ke PDF untuk dicetak, atau tambahkan user dan unit baru ke sistem">
          <Button 
            onClick={handleExportPDF}
            size="sm"
            variant="outline"
            disabled={isExporting || !chartData}
            startIcon={
              isExporting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            }
            className="bg-blue-500! hover:bg-blue-600! text-white! border-0! ring-0! shadow-sm hover:shadow-md transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Mengekspor...' : 'Export PDF'}
          </Button>
          <Button 
            onClick={() => setShowAddUserModal(true)}
            size="sm"
            variant="outline"
            startIcon={<UserIcon className="w-4 h-4" />}
            className="bg-green-500! hover:bg-green-600! text-white! border-0! ring-0! shadow-sm hover:shadow-md transition-all font-medium"
          >
            Tambah User
          </Button>
          <Button 
            onClick={() => setShowAddUnitModal(true)} 
            size="sm"
            startIcon={<GroupIcon className="w-4 h-4" />}
            className="bg-brand-500! hover:bg-brand-600! text-white! border-0! ring-0! shadow-sm hover:shadow-md transition-all font-medium"
          >
            Tambah Unit
          </Button>
        </QuickActionsSection>

        {/* Error Message */}
        {error && (
          <div className="rounded-2xl border border-error-200 bg-error-50 p-4 dark:border-error-500/30 dark:bg-error-500/20">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 shrink-0 text-error-600 dark:text-error-400"
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
              <span className="text-sm font-medium text-error-600 dark:text-error-400">{error}</span>
            </div>
          </div>
        )}

        {/* Organizational Chart Content */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 overflow-hidden shadow-sm">
          {/* Chart Section Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-brand-500 dark:text-brand-400 shrink-0">
                <GroupIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  Struktur Organisasi
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Visualisasi hierarki organisasi. Drag dan drop user untuk mengatur struktur
                </p>
              </div>
            </div>
          </div>
          
          {/* Chart Canvas */}
          <OrganizationalChart 
            key={chartKeyRef.current} 
            onUserAssigned={handleChartUpdate}
            onDataChange={setChartData}
          />
        </div>
      </div>

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSuccess={handleChartUpdate}
      />

      <AddUnitModal
        isOpen={showAddUnitModal}
        onClose={() => setShowAddUnitModal(false)}
        onSuccess={handleChartUpdate}
        units={units}
      />
    </>
  );
}

