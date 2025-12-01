import PageMeta from "../../../components/common/PageMeta";
import MetricCard from "../../../components/common/MetricCard";
import TaskTable, { Task } from "../../../components/dashboard/TaskTable";
import TodoList, { TodoItem } from "../../../components/dashboard/TodoList";
import DeadlineList, { DeadlineItem } from "../../../components/dashboard/DeadlineList";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import { useAuth } from "../../../context/AuthContext";
import {
  TaskIcon,
  CheckCircleIcon,
  TimeIcon,
  UserCircleIcon,
} from "../../../icons";

// Mock Data untuk Dashboard SDM
const mockMetrics = {
  tugasAktif: 8,
  selesaiBulanIni: 15,
  deadline: 3,
};

const mockTodoItems: TodoItem[] = [
  {
    id: 1,
    title: "Review dokumen akreditasi prodi",
    completed: false,
    priority: "tinggi",
    deadline: "Hari ini",
  },
  {
    id: 2,
    title: "Upload laporan penelitian semester ganjil",
    completed: false,
    priority: "tinggi",
    deadline: "Besok",
  },
  {
    id: 3,
    title: "Revisi RPS mata kuliah Kalkulus",
    completed: true,
    priority: "sedang",
  },
  {
    id: 4,
    title: "Input nilai UTS mahasiswa",
    completed: false,
    priority: "sedang",
    deadline: "3 hari lagi",
  },
  {
    id: 5,
    title: "Bimbingan skripsi mahasiswa",
    completed: true,
    priority: "rendah",
  },
  {
    id: 6,
    title: "Persiapan materi kuliah minggu depan",
    completed: false,
    priority: "rendah",
    deadline: "5 hari lagi",
  },
];

const mockDeadlines: DeadlineItem[] = [
  {
    id: 1,
    title: "Laporan Penelitian Hibah Internal",
    deadline: "30 Nov 2025",
    daysLeft: 1,
    priority: "tinggi",
    assignedBy: "Kepala Unit Penelitian",
  },
  {
    id: 2,
    title: "Dokumen Akreditasi Program Studi",
    deadline: "5 Des 2025",
    daysLeft: 6,
    priority: "tinggi",
    assignedBy: "Wakil Dekan I",
  },
  {
    id: 3,
    title: "Revisi Modul Praktikum",
    deadline: "10 Des 2025",
    daysLeft: 11,
    priority: "sedang",
    assignedBy: "Koordinator Lab",
  },
  {
    id: 4,
    title: "Proposal Pengabdian Masyarakat",
    deadline: "15 Des 2025",
    daysLeft: 16,
    priority: "sedang",
    assignedBy: "Kepala LPPM",
  },
];

const mockRiwayatSelesai: Task[] = [
  {
    id: 1,
    title: "Laporan BKD Semester Genap 2024",
    priority: "tinggi",
    status: "selesai",
    deadline: "25 Nov 2025",
    createdAt: "20 Nov 2025",
  },
  {
    id: 2,
    title: "Input Nilai UAS Semester Genap",
    priority: "tinggi",
    status: "selesai",
    deadline: "22 Nov 2025",
    createdAt: "15 Nov 2025",
  },
  {
    id: 3,
    title: "Review Paper Mahasiswa",
    priority: "sedang",
    status: "selesai",
    deadline: "20 Nov 2025",
    createdAt: "10 Nov 2025",
  },
  {
    id: 4,
    title: "Bimbingan Proposal Skripsi",
    priority: "sedang",
    status: "selesai",
    deadline: "18 Nov 2025",
    createdAt: "12 Nov 2025",
  },
  {
    id: 5,
    title: "Pembuatan Soal UAS",
    priority: "tinggi",
    status: "selesai",
    deadline: "15 Nov 2025",
    createdAt: "5 Nov 2025",
  },
];

export default function DashboardSDM() {
  const { user } = useAuth();

  return (
    <>
      <PageMeta
        title="Dashboard SDM | ITS (Integrated Task System)"
        description="Dashboard untuk SDM/Dosen - To-do list dan manajemen tugas pribadi"
      />

      <div className="space-y-6">
        {/* Header Card */}
        <DashboardHeader
          title="Dashboard SDM"
          icon={<UserCircleIcon className="size-7" />}
          userName={user?.name || "SDM / Dosen"}
          userRole="dosen"
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          <MetricCard
            title="Tugas Aktif"
            value={mockMetrics.tugasAktif}
            icon={<TaskIcon className="size-6" />}
          />
          <MetricCard
            title="Selesai Bulan Ini"
            value={mockMetrics.selesaiBulanIni}
            icon={<CheckCircleIcon className="size-6" />}
            trend={{ value: 25.0, isPositive: true }}
          />
          <MetricCard
            title="Deadline Minggu Ini"
            value={mockMetrics.deadline}
            icon={<TimeIcon className="size-6" />}
            trend={{ value: 10.0, isPositive: false }}
          />
        </div>

        {/* Todo and Deadline Row */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-6">
            <TodoList
              initialItems={mockTodoItems}
              title="To-do List"
              onAddNew={() => {
                // TODO: Open add new todo modal
              }}
            />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <DeadlineList
              items={mockDeadlines}
              title="Deadline Terdekat"
              onViewAll={() => {
                // TODO: Navigate to all deadlines page
              }}
            />
          </div>
        </div>

        {/* Completed Tasks Table */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <TaskTable
              tasks={mockRiwayatSelesai}
              title="Riwayat Tugas Selesai"
              showAssignee={false}
              showPriority={true}
              showCreatedAt={true}
              onViewAll={() => {
                // TODO: Navigate to all completed tasks page
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
