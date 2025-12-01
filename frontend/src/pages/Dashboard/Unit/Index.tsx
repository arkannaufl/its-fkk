import PageMeta from "../../../components/common/PageMeta";
import MetricCard from "../../../components/common/MetricCard";
import ActivityList, { ActivityItem } from "../../../components/common/ActivityList";
import TaskTable, { Task } from "../../../components/dashboard/TaskTable";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import {
  TaskIcon,
  CheckCircleIcon,
  TimeIcon,
  GroupIcon,
} from "../../../icons";

// Mock Data untuk Dashboard Unit
const mockMetrics = {
  tugasMasuk: 24,
  tugasSelesai: 18,
  butuhReview: 5,
};

const mockTugasDariDekan: Task[] = [
  {
    id: 1,
    title: "Penyusunan Laporan Akreditasi Prodi",
    priority: "tinggi",
    status: "proses",
    deadline: "5 Des 2025",
    createdAt: "28 Nov 2025",
  },
  {
    id: 2,
    title: "Evaluasi Kurikulum Berbasis OBE",
    priority: "tinggi",
    status: "baru",
    deadline: "10 Des 2025",
    createdAt: "27 Nov 2025",
  },
  {
    id: 3,
    title: "Data Tracer Study Alumni 2024",
    priority: "sedang",
    status: "proses",
    deadline: "15 Des 2025",
    createdAt: "25 Nov 2025",
  },
  {
    id: 4,
    title: "Proposal Pengembangan Lab Baru",
    priority: "sedang",
    status: "review",
    deadline: "20 Des 2025",
    createdAt: "20 Nov 2025",
  },
];

const mockButuhReview: Task[] = [
  {
    id: 1,
    title: "Laporan Penelitian Dosen",
    assignee: { name: "Dr. Andi Wijaya", avatar: "/images/user/user-05.jpg" },
    priority: "tinggi",
    status: "review",
    deadline: "3 Des 2025",
    createdAt: "25 Nov 2025",
  },
  {
    id: 2,
    title: "Dokumen RPS Mata Kuliah",
    assignee: { name: "Dr. Sari Indah", avatar: "/images/user/user-06.jpg" },
    priority: "sedang",
    status: "review",
    deadline: "5 Des 2025",
    createdAt: "26 Nov 2025",
  },
  {
    id: 3,
    title: "Proposal Pengabdian Masyarakat",
    assignee: { name: "Prof. Bambang S.", avatar: "/images/user/user-07.jpg" },
    priority: "sedang",
    status: "review",
    deadline: "8 Des 2025",
    createdAt: "27 Nov 2025",
  },
];

const mockAktivitasSDM: ActivityItem[] = [
  {
    id: 1,
    user: {
      name: "Dr. Andi Wijaya",
      avatar: "/images/user/user-05.jpg",
      status: "online",
    },
    action: "menyelesaikan",
    target: "Laporan Penelitian Q3",
    time: "10 menit lalu",
    category: "Penelitian",
  },
  {
    id: 2,
    user: {
      name: "Dr. Sari Indah",
      avatar: "/images/user/user-06.jpg",
      status: "online",
    },
    action: "mengupload dokumen",
    target: "RPS Semester Ganjil",
    time: "30 menit lalu",
    category: "Akademik",
  },
  {
    id: 3,
    user: {
      name: "Prof. Bambang S.",
      avatar: "/images/user/user-07.jpg",
      status: "busy",
    },
    action: "meminta review untuk",
    target: "Proposal Hibah",
    time: "1 jam lalu",
    category: "Pengabdian",
  },
  {
    id: 4,
    user: {
      name: "Dr. Rina Kusuma",
      avatar: "/images/user/user-08.jpg",
      status: "online",
    },
    action: "menandai selesai",
    target: "Bimbingan Skripsi",
    time: "2 jam lalu",
    category: "Akademik",
  },
  {
    id: 5,
    user: {
      name: "Dr. Hendra Putra",
      avatar: "/images/user/user-09.jpg",
      status: "offline",
    },
    action: "mengajukan revisi",
    target: "Modul Praktikum",
    time: "3 jam lalu",
    category: "Akademik",
  },
];

export default function DashboardUnit() {
  const { user } = useAuth();

  return (
    <>
      <PageMeta
        title="Dashboard Unit | ITS (Integrated Task System)"
        description="Dashboard untuk Kepala Unit - Manajemen tugas dan SDM"
      />

      <div className="space-y-6">
        {/* Header Card */}
        <DashboardHeader
          title="Dashboard Unit"
          icon={<GroupIcon className="size-7" />}
          userName={user?.name || "Kepala Unit"}
          userRole="kepala_unit"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          <MetricCard
            title="Tugas Masuk"
            value={mockMetrics.tugasMasuk}
            icon={<TaskIcon className="size-6" />}
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Tugas Selesai"
            value={mockMetrics.tugasSelesai}
            icon={<CheckCircleIcon className="size-6" />}
            trend={{ value: 12.8, isPositive: true }}
          />
          <MetricCard
            title="Butuh Review"
            value={mockMetrics.butuhReview}
            icon={<TimeIcon className="size-6" />}
            trend={{ value: 2.1, isPositive: false }}
          />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-6">
            <TaskTable
              tasks={mockTugasDariDekan}
              title="Tugas dari Dekan"
              showAssignee={false}
              showPriority={true}
              onViewAll={() => {
                // TODO: Navigate to all tasks from dekan page
              }}
            />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <TaskTable
              tasks={mockButuhReview}
              title="Butuh Review"
              showAssignee={true}
              showPriority={true}
              onViewAll={() => {
                // TODO: Navigate to all review tasks page
              }}
            />
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <ActivityList
              items={mockAktivitasSDM}
              title="Aktivitas SDM"
              maxItems={5}
              onViewAll={() => {
                // TODO: Navigate to all SDM activities page
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
