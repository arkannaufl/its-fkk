import { pdf } from '@react-pdf/renderer';
import { Unit, User } from '../hooks/useOrganizationalChartData';
import { OrganizationalChartPDF } from '../components/organizational-chart/OrganizationalChartPDF';

export const exportOrganizationalChartToPDF = async (
  units: Unit[],
  unassignedUsers: User[]
): Promise<void> => {
  try {
    // Create PDF document
    const doc = (
      <OrganizationalChartPDF units={units} unassignedUsers={unassignedUsers} />
    );

    // Generate PDF blob
    const blob = await pdf(doc).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struktur-Organisasi-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Gagal mengekspor PDF. Silakan coba lagi.');
  }
};

